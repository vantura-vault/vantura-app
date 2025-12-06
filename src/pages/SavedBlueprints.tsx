import { useState } from 'react';
import { Bookmark, Copy, Trash2, Check, Edit2, Lightbulb, ChevronDown } from 'lucide-react';
import { useBlueprints, useDeleteBlueprint, useUpdateBlueprintTitle, useCompanyId } from '../hooks';
import styles from './SavedBlueprints.module.css';

type SortBy = 'createdAt' | 'vanturaScore' | 'title';

export function SavedBlueprints() {
  const companyId = useCompanyId();
  const [platform, setPlatform] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const { data, isLoading, error } = useBlueprints({
    companyId,
    platform: platform || undefined,
    sortBy,
    sortOrder,
    limit: 50,
    offset: 0,
  });

  const deleteMutation = useDeleteBlueprint();
  const updateTitleMutation = useUpdateBlueprintTitle();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blueprint?')) {
      await deleteMutation.mutateAsync({ id, companyId });
    }
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStartEditTitle = (id: string, currentTitle: string) => {
    setEditingTitleId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveTitle = async (id: string) => {
    if (editingTitle.trim()) {
      await updateTitleMutation.mutateAsync({ id, companyId, title: editingTitle.trim() });
    }
    setEditingTitleId(null);
  };

  const handleCancelEditTitle = () => {
    setEditingTitleId(null);
    setEditingTitle('');
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveTitle(id);
    } else if (e.key === 'Escape') {
      handleCancelEditTitle();
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading saved blueprints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>Error loading blueprints: {error.message}</p>
        </div>
      </div>
    );
  }

  const blueprints = data?.blueprints || [];
  const total = data?.total || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Bookmark size={32} className={styles.titleIcon} />
            Saved Blueprints
          </h1>
          <p className={styles.subtitle}>
            Your library of data-backed content strategies ({total} saved)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Platform</label>
          <select
            className={styles.select}
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">All Platforms</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sort By</label>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="createdAt">Recent</option>
            <option value="vanturaScore">Score</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Order</label>
          <select
            className={styles.select}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Blueprints Grid */}
      {blueprints.length === 0 ? (
        <div className={styles.emptyState}>
          <Bookmark size={64} className={styles.emptyIcon} />
          <h3>No Saved Blueprints</h3>
          <p>Save blueprints from the Blueprint Generator to see them here</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {blueprints.map((blueprint) => (
            <div key={blueprint.id} className={styles.card}>
              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.platformBadge}>{blueprint.platform}</span>
                  <span className={styles.scoreChip}>
                    {blueprint.vanturaScore?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.iconButton}
                    onClick={() => handleCopy(blueprint.context, blueprint.id)}
                    title="Copy text"
                  >
                    {copiedId === blueprint.id ? (
                      <Check size={16} className={styles.checkIcon} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={() => handleDelete(blueprint.id)}
                    title="Delete blueprint"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className={styles.titleSection}>
                {editingTitleId === blueprint.id ? (
                  <div className={styles.titleEditMode}>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleTitleKeyDown(e, blueprint.id)}
                      onBlur={() => handleSaveTitle(blueprint.id)}
                      className={styles.titleInput}
                      autoFocus
                      maxLength={100}
                    />
                  </div>
                ) : (
                  <div className={styles.titleDisplay}>
                    <h3 className={styles.cardTitle}>{blueprint.title}</h3>
                    <button
                      className={styles.editButton}
                      onClick={() => handleStartEditTitle(blueprint.id, blueprint.title)}
                      title="Edit title"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Reasoning */}
              {blueprint.reasoning && (
                <div className={styles.reasoningSection}>
                  <div className={styles.reasoningHeader}>
                    <Lightbulb size={14} className={styles.lightbulbIcon} />
                    <span className={styles.reasoningLabel}>Why This Works</span>
                  </div>
                  <p className={styles.reasoningText}>{blueprint.reasoning}</p>
                </div>
              )}

              {/* Hook Preview */}
              <div className={styles.hookPreview}>
                <p className={styles.hookText}>
                  {blueprint.hook || blueprint.context.substring(0, 150)}
                  {(blueprint.hook || blueprint.context).length > 150 ? '...' : ''}
                </p>
              </div>

              {/* Expandable Content */}
              {expandedId === blueprint.id && (
                <div className={styles.expandedContent}>
                  <div className={styles.fullText}>
                    <h4 className={styles.sectionTitle}>Full Content</h4>
                    <p className={styles.contentText}>{blueprint.context}</p>
                  </div>

                  {blueprint.hashtags && blueprint.hashtags.length > 0 && (
                    <div className={styles.hashtagsSection}>
                      <h4 className={styles.sectionTitle}>Hashtags</h4>
                      <div className={styles.hashtags}>
                        {(blueprint.hashtags as any[]).map((hashtag: any, idx: number) => (
                          <span key={idx} className={styles.hashtag}>
                            #{hashtag.tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.metadata}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Best Time:</span>
                      <span className={styles.metaValue}>{blueprint.bestTimeToPost || 'N/A'}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Format:</span>
                      <span className={styles.metaValue}>{blueprint.recommendedFormat || 'N/A'}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Created:</span>
                      <span className={styles.metaValue}>
                        {new Date(blueprint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Expand Toggle */}
              <button
                className={styles.expandButton}
                onClick={() => handleToggleExpand(blueprint.id)}
              >
                {expandedId === blueprint.id ? 'Show Less' : 'Show More'}
                <ChevronDown
                  size={16}
                  className={expandedId === blueprint.id ? styles.chevronUp : styles.chevronDown}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
