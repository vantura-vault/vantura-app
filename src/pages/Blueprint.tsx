import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Check, Save, Edit2, Lightbulb, Bookmark, PlusCircle, HelpCircle, Calendar, Send, ChevronRight } from 'lucide-react';
import { useGenerateSuggestions, useCompanyId, useSaveBlueprint, useBlueprints, useCreateDraft } from '../hooks';
import { FileAttachmentSection } from '../components/blueprints/FileAttachmentSection';
import { Button } from '../components/shared/Button';
import { ChipFilter, type ChipOption } from '../components/shared/ChipFilter';
import { PageHeader } from '../components/shared/PageHeader';
import { BlueprintDetailModal } from '../components/blueprints';
import { PlatformIcon } from '../components/shared/PlatformIcon';
import type { Blueprint as BlueprintType } from '../types/blueprint';
import styles from './Blueprint.module.css';

// Local storage keys for persisting state
const BLUEPRINT_STORAGE_KEY = 'vantura_blueprint_results';
const SAVED_STATE_KEY = 'vantura_saved_blueprint_ids';
const CONFIG_WIDTH_KEY = 'vantura_blueprint_config_width';

type Tab = 'create' | 'saved';
type CreateMode = 'post' | 'campaign' | null;
type TimeSpan = '1w' | '2w' | '1m' | '3m' | 'custom';
type CampaignType = 'preplanned' | 'agile';

export function Blueprint() {
  const [activeTab, setActiveTab] = useState<Tab>('create');

  // Create mode state (Post vs Campaign)
  const [createMode, setCreateMode] = useState<CreateMode>(null);

  // Campaign-specific state
  const [timeSpan, setTimeSpan] = useState<TimeSpan>('1m');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [campaignType, setCampaignType] = useState<CampaignType>('preplanned');
  const [showCampaignTypeTooltip, setShowCampaignTypeTooltip] = useState(false);

  const [platform, setPlatform] = useState<'LinkedIn'>('LinkedIn');
  const [objective, setObjective] = useState('engagement');
  const [customObjective, setCustomObjective] = useState('');
  const [prompt, setPrompt] = useState('');
  const [attachedDocuments, setAttachedDocuments] = useState<Array<{ fileId: string; fileName: string; description: string }>>([]);
  const [savedResults, setSavedResults] = useState<any>(null);

  // Blueprint title (editable) - now single blueprint
  const [blueprintTitle, setBlueprintTitle] = useState<string>('Blueprint');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [savedBlueprintId, setSavedBlueprintId] = useState<string | null>(null);

  // Saved blueprints tab state
  const [savedPlatformFilter, setSavedPlatformFilter] = useState<string>('');
  const [savedActionFilter, setSavedActionFilter] = useState<string>('');
  const [copiedSavedId, setCopiedSavedId] = useState<string | null>(null);
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintType | null>(null);

  // Resizable panel state
  const [configWidth, setConfigWidth] = useState(() => {
    const saved = localStorage.getItem(CONFIG_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : 600; // Default to max width
  });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const createDraftMutation = useCreateDraft();
  const location = useLocation();
  const navigate = useNavigate();

  // Send to Studio state
  const [isSendingToStudio, setIsSendingToStudio] = useState(false);

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

  // Handle navigation state from dashboard (open specific blueprint)
  useEffect(() => {
    const state = location.state as { tab?: Tab | 'generate'; openBlueprintId?: string } | null;
    if (state?.tab) {
      // Map old 'generate' tab to new 'create' tab with 'post' mode
      if (state.tab === 'generate') {
        setActiveTab('create');
        setCreateMode('post');
      } else {
        setActiveTab(state.tab as Tab);
      }
    }
    if (state?.openBlueprintId && savedBlueprintsData?.blueprints) {
      const blueprint = savedBlueprintsData.blueprints.find(
        (b) => b.id === state.openBlueprintId
      );
      if (blueprint) {
        setSelectedBlueprint(blueprint);
      }
    }
  }, [location.state, savedBlueprintsData?.blueprints]);

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
        const parsedResults = JSON.parse(saved);
        setSavedResults(parsedResults);

        // Extract title: prioritize embedded _editedTitle, fall back to generated title
        if (parsedResults._editedTitle) {
          setBlueprintTitle(parsedResults._editedTitle);
        } else {
          const generatedTitle = parsedResults.blueprint?.title || 'Blueprint';
          setBlueprintTitle(generatedTitle);
        }
      } catch (e) {
        console.error('Failed to parse saved blueprint results:', e);
      }
    }

    const savedState = localStorage.getItem(SAVED_STATE_KEY);
    if (savedState) {
      try {
        setSavedBlueprintId(JSON.parse(savedState));
      } catch (e) {
        console.error('Failed to parse saved blueprint ID:', e);
      }
    }
  }, []);

  // Save results to localStorage whenever generateMutation data changes
  useEffect(() => {
    if (generateMutation.data) {
      // Set title from the generated blueprint
      const generatedTitle = generateMutation.data.blueprint?.title || 'Blueprint';
      setBlueprintTitle(generatedTitle);

      // Embed title in results and save to localStorage
      const resultsWithTitle = { ...generateMutation.data, _editedTitle: generatedTitle };
      setSavedResults(resultsWithTitle);
      localStorage.setItem(BLUEPRINT_STORAGE_KEY, JSON.stringify(resultsWithTitle));
    }
  }, [generateMutation.data]);

  // Save savedBlueprintId to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SAVED_STATE_KEY, JSON.stringify(savedBlueprintId));
  }, [savedBlueprintId]);

  const handleGenerate = () => {
    // Reset saved state when generating new blueprint
    setSavedBlueprintId(null);
    setBlueprintTitle('Blueprint');
    localStorage.removeItem(SAVED_STATE_KEY);

    // Clear previous results (title is embedded, so cleared together)
    setSavedResults(null);
    localStorage.removeItem(BLUEPRINT_STORAGE_KEY);

    generateMutation.mutate({
      companyId,
      platform,
      objective,
      customObjective: objective === 'other' ? customObjective : undefined,
      prompt: prompt || undefined,
      attachedDocuments: attachedDocuments.length > 0
        ? attachedDocuments.map(doc => ({ fileId: doc.fileId, description: doc.description }))
        : undefined,
    });
  };

  const handleSaveBlueprint = async () => {
    const blueprint = generateMutation.data?.blueprint || savedResults?.blueprint;

    if (!blueprint) return;

    try {
      const result = await saveBlueprintMutation.mutateAsync({
        companyId,
        title: blueprintTitle,
        platform,
        objective: objective === 'other' ? customObjective : objective,
        topicTags: blueprint.topicTags || [],
        reasoning: blueprint.reasoning,
        visualDescription: blueprint.visualDescription || '',
        hook: blueprint.hook || '',
        context: blueprint.context || '',
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
        vanturaScore: blueprint.vanturaScore,
        estimatedReachMin: blueprint.estimatedReachMin,
        estimatedReachMax: blueprint.estimatedReachMax,
        estimatedEngagementMin: blueprint.estimatedEngagementMin,
        estimatedEngagementMax: blueprint.estimatedEngagementMax,
        optimizationNote: blueprint.optimizationNote,
        // New guidance fields
        contentFramework: blueprint.contentFramework,
        whatToInclude: blueprint.whatToInclude,
        whatNotToDo: blueprint.whatNotToDo,
      });

      // Update saved blueprint ID
      setSavedBlueprintId(result.id);
    } catch (error) {
      console.error('Failed to save blueprint:', error);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setBlueprintTitle(newTitle);

    // Update savedResults with new title and persist to localStorage
    if (savedResults) {
      const updatedResults = { ...savedResults, _editedTitle: newTitle };
      setSavedResults(updatedResults);
      localStorage.setItem(BLUEPRINT_STORAGE_KEY, JSON.stringify(updatedResults));
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  const handleSendToStudio = async () => {
    if (!selectedBlueprint) return;

    setIsSendingToStudio(true);

    try {
      let blueprintId = selectedBlueprint.id;

      // If this is a newly generated blueprint (no id), save it first
      if (!blueprintId) {
        const blueprint = generateMutation.data?.blueprint || savedResults?.blueprint;
        if (!blueprint) return;

        const result = await saveBlueprintMutation.mutateAsync({
          companyId,
          title: blueprintTitle,
          platform,
          objective: objective === 'other' ? customObjective : objective,
          topicTags: blueprint.topicTags || [],
          reasoning: blueprint.reasoning,
          visualDescription: blueprint.visualDescription || '',
          hook: blueprint.hook || '',
          context: blueprint.context || '',
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
          vanturaScore: blueprint.vanturaScore,
          estimatedReachMin: blueprint.estimatedReachMin,
          estimatedReachMax: blueprint.estimatedReachMax,
          estimatedEngagementMin: blueprint.estimatedEngagementMin,
          estimatedEngagementMax: blueprint.estimatedEngagementMax,
          optimizationNote: blueprint.optimizationNote,
          contentFramework: blueprint.contentFramework,
          whatToInclude: blueprint.whatToInclude,
          whatNotToDo: blueprint.whatNotToDo,
        });
        blueprintId = result.id;
        setSavedBlueprintId(blueprintId);
      }

      // Create a draft for this blueprint
      const draft = await createDraftMutation.mutateAsync({ blueprintId });

      // Close modal and navigate to wizard with the draft
      setSelectedBlueprint(null);
      navigate(`/studio/create/${blueprintId}?draftId=${draft.id}`);
    } catch (error) {
      console.error('Failed to send to studio:', error);
    } finally {
      setIsSendingToStudio(false);
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

  // Resize handlers for draggable divider
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;

    // Constrain width between 300px and 600px
    const clampedWidth = Math.min(Math.max(newWidth, 300), 600);
    setConfigWidth(clampedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem(CONFIG_WIDTH_KEY, configWidth.toString());
    }
  }, [isDragging, configWidth]);

  // Attach mouse event listeners for resize
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={styles.container}>
      <PageHeader
        title="Data Backed Blueprints"
        subtitle="Create high-impact posts tailored to your brand voice and strategic objectives"
      />

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'create' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <PlusCircle size={18} />
          Create
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'saved' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={18} />
          Saved
          {savedBlueprintsData?.total ? ` (${savedBlueprintsData.total})` : ''}
        </button>
      </div>

      {activeTab === 'create' && (
        <div
          ref={containerRef}
          className={styles.content}
          style={{ gridTemplateColumns: `${configWidth}px 8px 1fr` }}
        >
          <div className={styles.controlPanel}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Configuration</h2>

              {/* Post/Campaign Toggle - First Form Group */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Type</label>
                <div className={styles.togglePillsInline}>
                  <button
                    className={`${styles.togglePillInline} ${createMode === 'post' ? styles.togglePillInlineActive : ''}`}
                    onClick={() => setCreateMode('post')}
                  >
                    <Sparkles size={16} />
                    Post
                  </button>
                  <button
                    className={`${styles.togglePillInline} ${createMode === 'campaign' ? styles.togglePillInlineActive : ''}`}
                    onClick={() => setCreateMode('campaign')}
                  >
                    <Calendar size={16} />
                    Campaign
                  </button>
                </div>
              </div>

              {/* Post-specific fields */}
              {createMode === 'post' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Platform</label>
              <select
                className={styles.select}
                value={platform}
                onChange={(e) => setPlatform(e.target.value as 'LinkedIn')}
              >
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Objective</label>
              <select
                className={styles.select}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              >
                <option value="engagement">Engagement (likes, comments, shares)</option>
                <option value="reach">Reach (impressions, visibility)</option>
                <option value="announcement">Announcement (news, updates)</option>
                <option value="other">Other</option>
              </select>
            </div>

            {objective === 'other' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Custom Objective</label>
                <input
                  type="text"
                  className={styles.input}
                  value={customObjective}
                  onChange={(e) => setCustomObjective(e.target.value)}
                  placeholder="Describe your objective..."
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>What would you like to post about?</label>
              <textarea
                className={styles.textarea}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to post about. For example: 'A thought leadership post about our new product launch and how it solves customer pain points' or 'Share insights from our recent industry report on AI adoption trends'"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Supporting Documents (Optional)</label>
              <p className={styles.labelHint}>Attach files from your Data Chamber to provide additional context</p>

              <FileAttachmentSection
                companyId={companyId}
                attachedDocuments={attachedDocuments}
                onAttach={(doc) => setAttachedDocuments([...attachedDocuments, doc])}
                onRemove={(fileId) => setAttachedDocuments(attachedDocuments.filter(d => d.fileId !== fileId))}
                onUpdateDescription={(fileId, description) => setAttachedDocuments(
                  attachedDocuments.map(d => d.fileId === fileId ? { ...d, description } : d)
                )}
              />
            </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={generateMutation.isPending || (objective === 'other' && !customObjective.trim())}
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
                </>
              )}

              {/* Campaign-specific fields */}
              {createMode === 'campaign' && (
                <>
                  {/* Platform - shared with Post */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Platform</label>
                    <select
                      className={styles.select}
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as 'LinkedIn')}
                    >
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                  </div>

                  {/* Objective - shared with Post */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Objective</label>
                    <select
                      className={styles.select}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                    >
                      <option value="engagement">Engagement (likes, comments, shares)</option>
                      <option value="reach">Reach (impressions, visibility)</option>
                      <option value="announcement">Announcement (news, updates)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {objective === 'other' && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Custom Objective</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={customObjective}
                        onChange={(e) => setCustomObjective(e.target.value)}
                        placeholder="Describe your objective..."
                      />
                    </div>
                  )}

                  {/* Time Span */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Time Span</label>
                    <div className={styles.timeSpanPills}>
                      {(['1w', '2w', '1m', '3m', 'custom'] as TimeSpan[]).map((span) => (
                        <button
                          key={span}
                          className={`${styles.timeSpanPill} ${timeSpan === span ? styles.timeSpanPillActive : ''}`}
                          onClick={() => setTimeSpan(span)}
                        >
                          {span === '1w' && '1 Week'}
                          {span === '2w' && '2 Weeks'}
                          {span === '1m' && '1 Month'}
                          {span === '3m' && '3 Months'}
                          {span === 'custom' && 'Custom'}
                        </button>
                      ))}
                    </div>

                    {/* Custom date picker */}
                    {timeSpan === 'custom' && (
                      <div className={styles.customDateRange}>
                        <div className={styles.dateField}>
                          <label className={styles.dateLabel}>Start Date</label>
                          <input
                            type="date"
                            className={styles.dateInput}
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                          />
                        </div>
                        <div className={styles.dateField}>
                          <label className={styles.dateLabel}>End Date</label>
                          <input
                            type="date"
                            className={styles.dateInput}
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Frequency */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Frequency</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="e.g., 3 posts per week"
                    />
                  </div>

                  {/* Campaign Type */}
                  <div className={styles.formGroup}>
                    <div className={styles.labelWithTooltip}>
                      <label className={styles.label}>Campaign Type</label>
                      <div
                        className={styles.tooltipWrapper}
                        onMouseEnter={() => setShowCampaignTypeTooltip(true)}
                        onMouseLeave={() => setShowCampaignTypeTooltip(false)}
                      >
                        <HelpCircle size={14} className={styles.helpIcon} />
                        {showCampaignTypeTooltip && (
                          <div className={styles.tooltip}>
                            <p><strong>Preplanned:</strong> All posts are scheduled upfront based on your content calendar.</p>
                            <p><strong>Agile:</strong> Posts are generated reactively based on real-time trends and events.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.campaignTypePills}>
                      <button
                        className={`${styles.campaignTypePill} ${campaignType === 'preplanned' ? styles.campaignTypePillActive : ''}`}
                        onClick={() => setCampaignType('preplanned')}
                      >
                        Preplanned
                      </button>
                      <button
                        className={`${styles.campaignTypePill} ${campaignType === 'agile' ? styles.campaignTypePillActive : ''}`}
                        onClick={() => setCampaignType('agile')}
                      >
                        Agile
                      </button>
                    </div>
                  </div>

                  {/* Campaign Theme/Topic - shared with Post */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>What is this campaign about?</label>
                    <textarea
                      className={styles.textarea}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your campaign theme or goals. For example: 'A month-long series highlighting our Q4 growth story and lessons learned' or 'Weekly thought leadership posts about AI trends in our industry'"
                      rows={4}
                    />
                  </div>

                  {/* Supporting Documents - shared with Post */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Supporting Documents (Optional)</label>
                    <p className={styles.labelHint}>Attach files from your Data Chamber to provide additional context</p>

                    <FileAttachmentSection
                      companyId={companyId}
                      attachedDocuments={attachedDocuments}
                      onAttach={(doc) => setAttachedDocuments([...attachedDocuments, doc])}
                      onRemove={(fileId) => setAttachedDocuments(attachedDocuments.filter(d => d.fileId !== fileId))}
                      onUpdateDescription={(fileId, description) => setAttachedDocuments(
                        attachedDocuments.map(d => d.fileId === fileId ? { ...d, description } : d)
                      )}
                    />
                  </div>

                  {/* Generate Campaign Button */}
                  <Button
                    disabled={true}
                    className={styles.generateButton}
                  >
                    <Calendar size={18} />
                    Build Campaign (Coming Soon)
                  </Button>
                </>
              )}
            </div>

            {/* Intelligence Context - Only for Post mode */}
            {createMode === 'post' && (generateMutation.data?.meta || savedResults?.meta) && (
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
                  {(generateMutation.data?.meta || savedResults?.meta)?.attachedDocsCount > 0 && (
                    <p>
                      <strong>Documents Used:</strong>{' '}
                      {(generateMutation.data?.meta || savedResults?.meta)?.attachedDocsCount} files
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

        {/* Draggable Divider */}
        <div
          className={`${styles.resizeDivider} ${isDragging ? styles.dragging : ''}`}
          onMouseDown={handleMouseDown}
        />

        <div className={styles.resultsPanel}>
          {/* No mode selected - prompt user */}
          {createMode === null && (
            <div className={styles.emptyState}>
              <PlusCircle size={48} className={styles.emptyIcon} />
              <h3>What would you like to create?</h3>
              <p>Select Post or Campaign from the configuration panel to get started</p>
            </div>
          )}

          {/* Campaign mode - coming soon */}
          {createMode === 'campaign' && (
            <div className={styles.emptyState}>
              <Calendar size={48} className={styles.emptyIcon} />
              <h3>Campaign Builder</h3>
              <p>Campaign generation is coming soon. Configure your campaign settings and stay tuned!</p>
            </div>
          )}

          {/* Post mode - empty state */}
          {createMode === 'post' && !generateMutation.data && !savedResults && !generateMutation.isPending && (
            <div className={styles.emptyState}>
              <Sparkles size={48} className={styles.emptyIcon} />
              <h3>Ready to Build</h3>
              <p>Configure your preferences and hit "Build Blueprints" to create data-backed content strategies</p>
            </div>
          )}

          {/* Post mode - loading */}
          {createMode === 'post' && generateMutation.isPending && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Building strategic blueprints...</p>
            </div>
          )}

          {/* Post mode - results (single blueprint) */}
          {createMode === 'post' && (generateMutation.data?.blueprint || savedResults?.blueprint) && (
            <div className={styles.singleBlueprintContainer}>
              {(() => {
                const blueprint = generateMutation.data?.blueprint || savedResults?.blueprint;
                return (
                  <div className={styles.blueprintResultCard}>
                    <div className={styles.blueprintResultHeader}>
                      <div className={styles.blueprintMeta}>
                        {isEditingTitle ? (
                          <input
                            type="text"
                            value={blueprintTitle}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleTitleKeyDown}
                            className={styles.titleInputInline}
                            autoFocus
                            maxLength={100}
                          />
                        ) : (
                          <span
                            className={styles.blueprintLabel}
                            onClick={() => setIsEditingTitle(true)}
                            title="Click to edit"
                          >
                            {blueprintTitle}
                            <Edit2 size={12} className={styles.editIconInline} />
                          </span>
                        )}
                      </div>
                      <div className={styles.blueprintActions}>
                        <PlatformIcon platform={platform} size={24} />
                      </div>
                    </div>

                    {/* Reasoning Section */}
                    {blueprint.reasoning && (
                      <div className={styles.reasoningSection}>
                        <div className={styles.reasoningHeader}>
                          <Lightbulb size={16} className={styles.lightbulbIcon} />
                          <span className={styles.reasoningLabel}>Why This Works</span>
                        </div>
                        <p className={styles.reasoningText}>{blueprint.reasoning}</p>
                      </div>
                    )}

                    {/* Content Framework Preview */}
                    {blueprint.contentFramework && (
                      <div className={styles.frameworkPreview}>
                        <div className={styles.frameworkLabel}>Content Structure:</div>
                        <div className={styles.frameworkStructure}>{blueprint.contentFramework.structure}</div>
                      </div>
                    )}

                    {/* What to Include Preview */}
                    {blueprint.whatToInclude && blueprint.whatToInclude.length > 0 && (
                      <div className={styles.includePreview}>
                        <div className={styles.includeLabel}>Guidance Points:</div>
                        <div className={styles.includeCount}>
                          {blueprint.whatToInclude.length} elements to include
                        </div>
                      </div>
                    )}

                    {/* View Full Blueprint Button */}
                    <div className={styles.blueprintResultFooter}>
                      <Button
                        onClick={() => setSelectedBlueprint(blueprint)}
                        className={styles.viewButton}
                      >
                        <Sparkles size={16} />
                        View Full Blueprint
                      </Button>

                      <Button
                        onClick={async () => {
                          setIsSendingToStudio(true);
                          try {
                            // Save blueprint if not already saved
                            let blueprintId = savedBlueprintId;
                            if (!blueprintId) {
                              const result = await saveBlueprintMutation.mutateAsync({
                                companyId,
                                title: blueprintTitle,
                                platform,
                                objective: objective === 'other' ? customObjective : objective,
                                topicTags: blueprint.topicTags || [],
                                reasoning: blueprint.reasoning,
                                visualDescription: blueprint.visualDescription || '',
                                hook: blueprint.hook || '',
                                context: blueprint.context || '',
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
                                vanturaScore: blueprint.vanturaScore,
                                estimatedReachMin: blueprint.estimatedReachMin,
                                estimatedReachMax: blueprint.estimatedReachMax,
                                estimatedEngagementMin: blueprint.estimatedEngagementMin,
                                estimatedEngagementMax: blueprint.estimatedEngagementMax,
                                optimizationNote: blueprint.optimizationNote,
                                contentFramework: blueprint.contentFramework,
                                whatToInclude: blueprint.whatToInclude,
                                whatNotToDo: blueprint.whatNotToDo,
                              });
                              blueprintId = result.id;
                              setSavedBlueprintId(blueprintId);
                            }
                            // Create a draft for this blueprint
                            const draft = await createDraftMutation.mutateAsync({ blueprintId });
                            // Navigate to wizard with draft
                            navigate(`/studio/create/${blueprintId}?draftId=${draft.id}`);
                          } catch (error) {
                            console.error('Failed to send to studio:', error);
                          } finally {
                            setIsSendingToStudio(false);
                          }
                        }}
                        disabled={isSendingToStudio}
                        className={styles.sendToStudioButton}
                      >
                        <Send size={16} />
                        {isSendingToStudio ? 'Sending...' : 'Send to Studio'}
                      </Button>

                      <Button
                        onClick={handleSaveBlueprint}
                        disabled={saveBlueprintMutation.isPending || savedBlueprintId !== null}
                        className={styles.saveButton}
                      >
                        {savedBlueprintId ? (
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
                );
              })()}
            </div>
          )}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
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
              <p>Save blueprints from the Create tab to see them here</p>
            </div>
          )}

          {/* Blueprints Grid - New Card Design */}
          {!savedBlueprintsLoading && savedBlueprintsData?.blueprints && savedBlueprintsData.blueprints.length > 0 && (
            <div className={styles.blueprintGrid}>
              {savedBlueprintsData.blueprints.map((blueprint) => (
                <div
                  key={blueprint.id}
                  className={styles.savedBlueprintCard}
                  onClick={() => handleOpenModal(blueprint)}
                >
                  <div className={styles.savedCardHeader}>
                    <PlatformIcon platform={blueprint.platform} size={18} className={styles.savedCardPlatformIcon} />
                    <span className={styles.savedCardPlatform}>{blueprint.platform}</span>
                  </div>
                  <h3 className={styles.savedCardTitle}>{blueprint.title}</h3>
                  <p className={styles.savedCardHook}>{blueprint.hook}</p>
                  <div className={styles.savedCardFooter}>
                    <span className={styles.savedCardDate}>
                      {new Date(blueprint.createdAt).toLocaleDateString()}
                    </span>
                    <ChevronRight size={16} className={styles.savedCardArrow} />
                  </div>
                </div>
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
          onSendToStudio={handleSendToStudio}
          onSave={!selectedBlueprint.id ? handleSaveBlueprint : undefined}
          isCopied={copiedSavedId === selectedBlueprint.id}
          isSaved={selectedBlueprint.id ? true : savedBlueprintId !== null}
          isSendingToStudio={isSendingToStudio}
        />
      )}
    </div>
  );
}
