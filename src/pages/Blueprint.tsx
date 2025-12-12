import { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Save, Edit2, Lightbulb, Bookmark } from 'lucide-react';
import { useGenerateSuggestions, useCompanyId, useSaveBlueprint, useBlueprints } from '../hooks';
import { Button } from '../components/shared/Button';
import { ChipFilter, type ChipOption } from '../components/shared/ChipFilter';
import { BlueprintCard, BlueprintDetailModal } from '../components/blueprints';
import { PlatformIcon } from '../components/shared/PlatformIcon';
import type { Blueprint as BlueprintType } from '../types/blueprint';
import styles from './Blueprint.module.css';

// Local storage key for persisting blueprint results and saved state
const BLUEPRINT_STORAGE_KEY = 'vantura_blueprint_results';
const SAVED_STATE_KEY = 'vantura_saved_blueprint_ids';

type Tab = 'generate' | 'saved';

export function Blueprint() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [platform, setPlatform] = useState<'LinkedIn' | 'Twitter' | 'Instagram'>('LinkedIn');
  const [objective, setObjective] = useState('engagement');
  const [contentAngle, setContentAngle] = useState('data-driven');
  const [topics, setTopics] = useState('growth, innovation');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedResults, setSavedResults] = useState<any>(null);

  // Blueprint titles (editable)
  const [blueprintTitles, setBlueprintTitles] = useState<string[]>(['Blueprint 1', 'Blueprint 2', 'Blueprint 3']);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null);
  const [savedBlueprintIds, setSavedBlueprintIds] = useState<(string | null)[]>([null, null, null]);

  // Intelligence switches
  const [useDataChamber, setUseDataChamber] = useState(true);
  const [useYourTopPosts, setUseYourTopPosts] = useState(true);
  const [useCompetitorPosts, setUseCompetitorPosts] = useState(true);

  // Saved blueprints tab state
  const [savedPlatformFilter, setSavedPlatformFilter] = useState<string>('');
  const [savedActionFilter, setSavedActionFilter] = useState<string>('');
  const [copiedSavedId, setCopiedSavedId] = useState<string | null>(null);
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintType | null>(null);

  // Filter options
  const platformOptions: ChipOption[] = [
    { value: '', label: 'All Platforms' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    // Future platforms (disabled for now)
    // { value: 'Instagram', label: 'Instagram' },
    // { value: 'TikTok', label: 'TikTok' },
    // { value: 'Twitter', label: 'X' },
    // { value: 'Facebook', label: 'Facebook' },
  ];

  const actionOptions: ChipOption[] = [
    { value: '', label: 'All' },
    { value: 'post', label: 'Post' },
    { value: 'comment', label: 'Comment' },
    { value: 'repost', label: 'Repost' },
    { value: 'story', label: 'Story' },
    { value: 'video', label: 'Video' },
  ];

  const companyId = useCompanyId();
  const saveBlueprintMutation = useSaveBlueprint();

  // Fetch saved blueprints
  const { data: savedBlueprintsData, isLoading: savedBlueprintsLoading, error: savedBlueprintsError } = useBlueprints({
    companyId,
    platform: savedPlatformFilter || undefined,
    actionType: savedActionFilter || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 50,
    offset: 0,
  });

  // Debug logging
  useEffect(() => {
    console.log('Saved Blueprints Data:', savedBlueprintsData);
    console.log('Saved Blueprints Loading:', savedBlueprintsLoading);
    console.log('Saved Blueprints Error:', savedBlueprintsError);
    console.log('Company ID:', companyId);
  }, [savedBlueprintsData, savedBlueprintsLoading, savedBlueprintsError, companyId]);

  const generateMutation = useGenerateSuggestions();

  // Debug logging for generate mutation
  useEffect(() => {
    console.log('Generate Mutation State:', {
      data: generateMutation.data,
      error: generateMutation.error,
      isError: generateMutation.isError,
      isSuccess: generateMutation.isSuccess,
      isPending: generateMutation.isPending,
    });
  }, [generateMutation.data, generateMutation.error, generateMutation.isError, generateMutation.isSuccess, generateMutation.isPending]);

  // Load saved results and saved state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(BLUEPRINT_STORAGE_KEY);
    if (saved) {
      try {
        setSavedResults(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved blueprint results:', e);
      }
    }

    const savedState = localStorage.getItem(SAVED_STATE_KEY);
    if (savedState) {
      try {
        setSavedBlueprintIds(JSON.parse(savedState));
      } catch (e) {
        console.error('Failed to parse saved blueprint IDs:', e);
      }
    }
  }, []);

  // Save results to localStorage whenever generateMutation data changes
  useEffect(() => {
    if (generateMutation.data) {
      localStorage.setItem(BLUEPRINT_STORAGE_KEY, JSON.stringify(generateMutation.data));
      setSavedResults(generateMutation.data);
    }
  }, [generateMutation.data]);

  // Save savedBlueprintIds to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SAVED_STATE_KEY, JSON.stringify(savedBlueprintIds));
  }, [savedBlueprintIds]);

  const handleGenerate = () => {
    const topicTags = topics.split(',').map((t) => t.trim()).filter(Boolean);

    // Reset saved state when generating new blueprints
    setSavedBlueprintIds([null, null, null]);
    setBlueprintTitles(['Blueprint 1', 'Blueprint 2', 'Blueprint 3']);
    localStorage.removeItem(SAVED_STATE_KEY);

    // Clear previous results so loading state shows cleanly
    setSavedResults(null);
    localStorage.removeItem(BLUEPRINT_STORAGE_KEY);

    generateMutation.mutate({
      companyId,
      platform,
      objective,
      contentAngle,
      topicTags,
      nVariants: 3,
      useDataChamber,
      useYourTopPosts,
      useCompetitorPosts,
    });
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveBlueprint = async (index: number) => {
    const variant = (generateMutation.data?.variants || savedResults?.variants)?.[index];
    const blueprint = generateMutation.data?.blueprint || savedResults?.blueprint;

    if (!variant || !blueprint) return;

    try {
      const result = await saveBlueprintMutation.mutateAsync({
        companyId,
        title: blueprintTitles[index],
        platform,
        objective,
        topicTags: topics.split(',').map(t => t.trim()).filter(Boolean),
        contentAngle,
        useDataChamber,
        useYourTopPosts,
        useCompetitorPosts,
        reasoning: variant.reasoning,
        visualDescription: blueprint.visualDescription || '',
        hook: blueprint.hook || '',
        context: variant.text,
        hashtags: blueprint.hashtags || [],
        mentions: blueprint.mentions,
        bestTimeToPost: blueprint.bestTimeToPost,
        recommendedFormat: blueprint.recommendedFormat,
        postingInsight: blueprint.postingInsight,
        dataSources: blueprint.dataSources || [],
        timeWindow: blueprint.timeWindow,
        confidence: blueprint.confidence,
        yourPerformanceScore: blueprint.yourPerformanceScore,
        competitorScore: blueprint.competitorScore,
        vanturaScore: variant.finalScore,
        estimatedReachMin: blueprint.estimatedReachMin,
        estimatedReachMax: blueprint.estimatedReachMax,
        estimatedEngagementMin: blueprint.estimatedEngagementMin,
        estimatedEngagementMax: blueprint.estimatedEngagementMax,
        optimizationNote: blueprint.optimizationNote,
      });

      // Update saved blueprint IDs
      const newSavedIds = [...savedBlueprintIds];
      newSavedIds[index] = result.id;
      setSavedBlueprintIds(newSavedIds);
    } catch (error) {
      console.error('Failed to save blueprint:', error);
    }
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const newTitles = [...blueprintTitles];
    newTitles[index] = newTitle;
    setBlueprintTitles(newTitles);
  };

  const handleTitleBlur = () => {
    setEditingTitleIndex(null);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent, _index: number) => {
    if (e.key === 'Enter') {
      setEditingTitleIndex(null);
    }
  };

  // Modal handlers
  const handleOpenModal = (blueprint: BlueprintType) => {
    setSelectedBlueprint(blueprint);
  };

  const handleCloseModal = () => {
    setSelectedBlueprint(null);
  };

  const handleCopyFromModal = () => {
    if (selectedBlueprint) {
      const fullContent = `${selectedBlueprint.hook}\n\n${selectedBlueprint.context}`;
      navigator.clipboard.writeText(fullContent);
      setCopiedSavedId(selectedBlueprint.id);
      setTimeout(() => setCopiedSavedId(null), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Data Backed Blueprints</h1>
          <p className={styles.subtitle}>
            Create high-impact posts tailored to your brand voice and strategic objectives
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'generate' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          <Sparkles size={18} />
          Generate New
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'saved' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={18} />
          Saved Blueprints
          {savedBlueprintsData?.total ? ` (${savedBlueprintsData.total})` : ''}
        </button>
      </div>

      {activeTab === 'generate' ? (
        <div className={styles.content}>
        <div className={styles.controlPanel}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Configuration</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Platform</label>
              <select
                className={styles.select}
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Objective</label>
              <input
                type="text"
                className={styles.input}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="engagement, brand awareness, thought leadership"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Content Angle</label>
              <select
                className={styles.select}
                value={contentAngle}
                onChange={(e) => setContentAngle(e.target.value)}
              >
                <option value="data-driven">Data-Driven (stats, research, numbers)</option>
                <option value="storytelling">Storytelling (personal stories, narratives)</option>
                <option value="educational">Educational (how-to, tutorials)</option>
                <option value="thought-leadership">Thought Leadership (insights, opinions)</option>
                <option value="behind-the-scenes">Behind-the-Scenes (process, transparency)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Topics (comma-separated)</label>
              <input
                type="text"
                className={styles.input}
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="growth, innovation, data-driven"
              />
            </div>

            <div className={styles.intelligenceSwitches}>
              <h3 className={styles.switchesTitle}>Intelligence Sources</h3>

              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={useDataChamber}
                  onChange={(e) => setUseDataChamber(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.switchText}>
                  <strong>Data Chamber</strong>
                  <span className={styles.switchDescription}>
                    Use your brand voice, values & audience
                  </span>
                </span>
              </label>

              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={useYourTopPosts}
                  onChange={(e) => setUseYourTopPosts(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.switchText}>
                  <strong>Your Top Posts</strong>
                  <span className={styles.switchDescription}>
                    Learn from your best performers
                  </span>
                </span>
              </label>

              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={useCompetitorPosts}
                  onChange={(e) => setUseCompetitorPosts(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.switchText}>
                  <strong>Competitor Posts</strong>
                  <span className={styles.switchDescription}>
                    Analyze competitor patterns & gaps
                  </span>
                </span>
              </label>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className={styles.generateButton}
            >
              <Sparkles size={18} />
              {generateMutation.isPending ? 'Building Blueprints...' : 'Build Blueprints'}
            </Button>

            {generateMutation.error && (
              <div className={styles.error}>
                Error: {generateMutation.error.message}
              </div>
            )}
          </div>

          {(generateMutation.data?.meta || savedResults?.meta) && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Intelligence Context</h2>
              <div className={styles.metaInfo}>
                <p>
                  <strong>Examples Used:</strong> {(generateMutation.data?.meta || savedResults?.meta)?.examplesUsed}{' '}
                  high-performing posts
                </p>
                <p>
                  <strong>Competitor Angles:</strong>{' '}
                  {(generateMutation.data?.meta || savedResults?.meta)?.competitorAngles} insights
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.resultsPanel}>
          {!generateMutation.data && !savedResults && !generateMutation.isPending && (
            <div className={styles.emptyState}>
              <Sparkles size={48} className={styles.emptyIcon} />
              <h3>Ready to Build</h3>
              <p>Configure your preferences and hit "Build Blueprints" to create data-backed content strategies</p>
            </div>
          )}

          {generateMutation.isPending && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Building strategic blueprints...</p>
            </div>
          )}

          {(generateMutation.data?.variants || savedResults?.variants) && (
            <div className={styles.variantsGrid}>
              {(generateMutation.data?.variants || savedResults?.variants)?.map((variant: any, index: number) => (
                <div key={index} className={styles.variantCard}>
                  <div className={styles.variantHeader}>
                    <div className={styles.variantMeta}>
                      {editingTitleIndex === index ? (
                        <input
                          type="text"
                          value={blueprintTitles[index]}
                          onChange={(e) => handleTitleChange(index, e.target.value)}
                          onBlur={handleTitleBlur}
                          onKeyDown={(e) => handleTitleKeyDown(e, index)}
                          className={styles.titleInputInline}
                          autoFocus
                          maxLength={100}
                        />
                      ) : (
                        <span
                          className={styles.variantLabel}
                          onClick={() => setEditingTitleIndex(index)}
                          title="Click to edit"
                        >
                          {blueprintTitles[index]}
                          <Edit2 size={12} className={styles.editIconInline} />
                        </span>
                      )}
                      <span className={styles.scoreChip}>
                        Score: {variant.finalScore.toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.variantActions}>
                      <PlatformIcon platform={platform} size={24} />
                      <button
                        className={styles.copyButton}
                        onClick={() => handleCopy(variant.text, index)}
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check size={16} className={styles.checkIcon} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Reasoning Section */}
                  {variant.reasoning && (
                    <div className={styles.reasoningSection}>
                      <div className={styles.reasoningHeader}>
                        <Lightbulb size={16} className={styles.lightbulbIcon} />
                        <span className={styles.reasoningLabel}>Why This Works</span>
                      </div>
                      <p className={styles.reasoningText}>{variant.reasoning}</p>
                    </div>
                  )}

                  <div className={styles.variantContent}>
                    <p className={styles.postText}>{variant.text}</p>
                  </div>

                  <div className={styles.variantFooter}>
                    <div className={styles.scoreBreakdown}>
                      <span className={styles.scoreItem}>
                        Analytics: {variant.analyticsScore.toFixed(2)}
                      </span>
                      <span className={styles.scoreItem}>
                        Critic: {variant.criticScore.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleSaveBlueprint(index)}
                      disabled={saveBlueprintMutation.isPending || savedBlueprintIds[index] !== null}
                      className={styles.saveButton}
                    >
                      {savedBlueprintIds[index] ? (
                        <>
                          <Check size={16} />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          {saveBlueprintMutation.isPending ? 'Saving...' : 'Save Blueprint'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      ) : (
        /* Saved Blueprints Tab */
        <div className={styles.savedBlueprintsSection}>
          {/* Chip Filters */}
          <div className={styles.chipFilters}>
            <div className={styles.chipRow}>
              <ChipFilter
                options={platformOptions}
                selected={savedPlatformFilter}
                onSelect={setSavedPlatformFilter}
              />
            </div>
            <div className={styles.chipRow}>
              <ChipFilter
                options={actionOptions}
                selected={savedActionFilter}
                onSelect={setSavedActionFilter}
              />
            </div>
          </div>

          {/* Loading State */}
          {savedBlueprintsLoading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Loading saved blueprints...</p>
            </div>
          )}

          {/* Error State */}
          {savedBlueprintsError && (
            <div className={styles.errorState}>
              <h3>Error Loading Blueprints</h3>
              <p>{(savedBlueprintsError as any)?.message || String(savedBlueprintsError) || 'Failed to load saved blueprints'}</p>
              <p style={{ fontSize: '0.75rem', marginTop: '8px', opacity: 0.7 }}>
                Check console for details. Make sure API server is running.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!savedBlueprintsLoading && !savedBlueprintsError && (!savedBlueprintsData?.blueprints || savedBlueprintsData.blueprints.length === 0) && (
            <div className={styles.emptyState}>
              <Bookmark size={64} className={styles.emptyIcon} />
              <h3>No Saved Blueprints</h3>
              <p>Save blueprints from the "Generate New" tab to see them here</p>
            </div>
          )}

          {/* Blueprints Grid - New Card Design */}
          {!savedBlueprintsLoading && savedBlueprintsData?.blueprints && savedBlueprintsData.blueprints.length > 0 && (
            <div className={styles.blueprintGrid}>
              {savedBlueprintsData.blueprints.map((blueprint) => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  onClick={() => handleOpenModal(blueprint)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blueprint Detail Modal */}
      {selectedBlueprint && (
        <BlueprintDetailModal
          blueprint={selectedBlueprint}
          onClose={handleCloseModal}
          onCopy={handleCopyFromModal}
          isCopied={copiedSavedId === selectedBlueprint.id}
        />
      )}
    </div>
  );
}
