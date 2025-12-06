import { useEffect, useCallback } from 'react';
import { X, Sparkles, Lightbulb, Clock, FileText, Copy, Check, RefreshCw, Share2, Save } from 'lucide-react';
import { PlatformIcon } from '../shared/PlatformIcon';
import type { Blueprint, Reference, Hashtag, Mention } from '../../types/blueprint';
import styles from './BlueprintDetailModal.module.css';

interface BlueprintDetailModalProps {
  blueprint: Blueprint;
  onClose: () => void;
  onCopy?: () => void;
  onSave?: () => void;
  onRegenerate?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  isCopied?: boolean;
  isSaved?: boolean;
}

export function BlueprintDetailModal({
  blueprint,
  onClose,
  onCopy,
  onSave,
  onRegenerate,
  onShare,
  onExport,
  isCopied = false,
  isSaved = false,
}: BlueprintDetailModalProps) {
  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  // Parse references if it's a string
  const references: Reference[] = (() => {
    if (!blueprint.references) return [];
    if (typeof blueprint.references === 'string') {
      try {
        return JSON.parse(blueprint.references);
      } catch {
        return [];
      }
    }
    return blueprint.references;
  })();

  // Parse hashtags
  const hashtags: Hashtag[] = Array.isArray(blueprint.hashtags)
    ? blueprint.hashtags
    : [];

  // Parse mentions
  const mentions: Mention[] = Array.isArray(blueprint.mentions)
    ? blueprint.mentions
    : [];

  const score = blueprint.vanturaScore ? Math.round(blueprint.vanturaScore) : 0;
  // Confidence is returned as 0-100 from LLM, not 0-1
  const confidence = blueprint.confidence ? Math.round(blueprint.confidence) : 0;
  const yourScore = blueprint.yourPerformanceScore ? Math.round(blueprint.yourPerformanceScore) : 0;
  const competitorScore = blueprint.competitorScore ? Math.round(blueprint.competitorScore) : 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{blueprint.title}</h2>
          <div className={styles.headerActions}>
            <PlatformIcon platform={blueprint.platform} size={28} />
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Visual Description */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Visual Description</h3>
              <p className={styles.description}>{blueprint.visualDescription}</p>

              {references.length > 0 && (
                <div className={styles.references}>
                  <div className={styles.avatars}>
                    {references.slice(0, 3).map((ref, idx) => (
                      <div key={idx} className={styles.avatar}>
                        {ref.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className={styles.referencesText}>
                    Inspired by top {references.length} industry leaders.
                  </span>
                  <button className={styles.seeReferencesButton}>See References</button>
                </div>
              )}
            </section>

            {/* Post Copy */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Post Copy</h3>

              <div className={styles.copySection}>
                <div className={styles.copyLabel}>
                  <Sparkles size={14} className={styles.sparkleIcon} />
                  <span>Hook:</span>
                </div>
                <p className={styles.hookText}>{blueprint.hook}</p>
              </div>

              <div className={styles.copySection}>
                <div className={styles.copyLabel}>
                  <Lightbulb size={14} className={styles.lightbulbIcon} />
                  <span>Context:</span>
                </div>
                <p className={styles.contextText}>{blueprint.context}</p>
              </div>
            </section>

            {/* Hashtags & Mentions */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Hashtags & Mentions</h3>
              <div className={styles.tagsContainer}>
                {hashtags.map((hashtag, idx) => {
                  // Remove leading # if LLM included it
                  const tag = hashtag.tag.startsWith('#') ? hashtag.tag.slice(1) : hashtag.tag;
                  return (
                    <span key={idx} className={styles.hashtagChip}>
                      #{tag} · {hashtag.engagement}
                    </span>
                  );
                })}
                {mentions.map((mention, idx) => {
                  // Remove leading @ if LLM included it
                  const handle = mention.handle.startsWith('@') ? mention.handle.slice(1) : mention.handle;
                  return (
                    <span key={idx} className={styles.mentionChip}>
                      @{handle} · {mention.engagement}
                    </span>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Posting Intelligence */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Posting Intelligence</h3>

              <div className={styles.infoRow}>
                <Clock size={14} />
                <span className={styles.infoLabel}>Best Time to Post:</span>
                <span className={styles.infoBadge}>{blueprint.bestTimeToPost || 'N/A'}</span>
              </div>

              <div className={styles.infoRow}>
                <FileText size={14} />
                <span className={styles.infoLabel}>Recommended Format:</span>
                <span className={styles.infoBadge}>{blueprint.recommendedFormat || 'N/A'}</span>
              </div>

              {blueprint.postingInsight && (
                <p className={styles.insightText}>
                  Insight: {blueprint.postingInsight}
                </p>
              )}
            </section>

            {/* Data & Insights */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Data & Insights</h3>

              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Data Sources:</span>
                <span className={styles.dataValue}>
                  {blueprint.dataSources?.join(', ') || 'N/A'}
                </span>
              </div>

              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Time Window:</span>
                <span className={styles.dataValue}>{blueprint.timeWindow || 'N/A'}</span>
              </div>

              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Confidence:</span>
                <span className={styles.dataValue}>
                  {confidence > 0 ? `High (${confidence}%)` : 'N/A'}
                </span>
              </div>

              <div className={styles.performanceBars}>
                <div className={styles.barContainer}>
                  <span className={styles.barLabel}>You:</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFillYou}
                      style={{ width: `${yourScore}%` }}
                    />
                  </div>
                </div>
                <div className={styles.barContainer}>
                  <span className={styles.barLabel}>Competitors:</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFillCompetitor}
                      style={{ width: `${competitorScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Performance Forecast */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Performance Forecast</h3>

              <div className={styles.scoreContainer}>
                <span className={styles.scoreLabel}>Vantura Score:</span>
                <div className={styles.scoreTrack}>
                  <div
                    className={styles.scoreFill}
                    style={{ width: `${score}%` }}
                  />
                  <div
                    className={styles.scoreHandle}
                    style={{ left: `${score}%` }}
                  />
                </div>
                <span className={styles.scoreValue}>{score}%</span>
              </div>

              <div className={styles.forecastRow}>
                <div className={styles.forecastItem}>
                  <span className={styles.forecastLabel}>Est. Reach:</span>
                  <span className={styles.forecastValue}>
                    {blueprint.estimatedReachMin?.toLocaleString() || '0'} -{' '}
                    {blueprint.estimatedReachMax?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className={styles.forecastItem}>
                  <span className={styles.forecastLabel}>Est. Engagement:</span>
                  <span className={styles.forecastValue}>
                    {blueprint.estimatedEngagementMin || 0}% -{' '}
                    {blueprint.estimatedEngagementMax || 0}%
                  </span>
                </div>
              </div>

              {blueprint.optimizationNote && (
                <p className={styles.optimizationNote}>{blueprint.optimizationNote}</p>
              )}
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            {onSave && (
              <button className={styles.outlineButton} onClick={onSave} disabled={isSaved}>
                <Save size={16} />
                {isSaved ? 'Saved' : 'Save as Draft'}
              </button>
            )}
            {onCopy && (
              <button className={styles.outlineButton} onClick={onCopy}>
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                {isCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            )}
            {onExport && (
              <button className={styles.primaryButton} onClick={onExport}>
                <PlatformIcon platform={blueprint.platform} size={16} />
                Export to {blueprint.platform}
              </button>
            )}
          </div>
          <div className={styles.footerRight}>
            {onRegenerate && (
              <button className={styles.outlineButton} onClick={onRegenerate}>
                <RefreshCw size={16} />
                Regenerate
              </button>
            )}
            {onShare && (
              <button className={styles.outlineButton} onClick={onShare}>
                <Share2 size={16} />
                Share with Team
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
