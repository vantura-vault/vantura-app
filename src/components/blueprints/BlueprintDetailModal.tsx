import { useEffect, useCallback, useState } from 'react';
import { X, Sparkles, Lightbulb, Clock, FileText, Copy, Check, RefreshCw, Share2, Save, DollarSign, AlertTriangle, CheckCircle, ArrowRight, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { PlatformIcon } from '../shared/PlatformIcon';
import type { Blueprint, Reference, Hashtag, Mention, ContentFramework, WhatToIncludeItem, WhatNotToDoItem } from '../../types/blueprint';
import styles from './BlueprintDetailModal.module.css';

interface BlueprintDetailModalProps {
  blueprint: Blueprint;
  onClose: () => void;
  onCopy?: () => void;
  onSave?: () => void;
  onSendToStudio?: () => void;
  onRegenerate?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  isCopied?: boolean;
  isSaved?: boolean;
  isSendingToStudio?: boolean;
}

export function BlueprintDetailModal({
  blueprint,
  onClose,
  onCopy,
  onSave,
  onSendToStudio,
  onRegenerate,
  onShare,
  onExport,
  isCopied = false,
  isSaved = false,
  isSendingToStudio = false,
}: BlueprintDetailModalProps) {
  // Collapsible section states
  const [isWhatToIncludeOpen, setIsWhatToIncludeOpen] = useState(false);
  const [isWhatNotToDoOpen, setIsWhatNotToDoOpen] = useState(false);

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

  // Parse content framework
  const contentFramework: ContentFramework | null = (() => {
    if (!blueprint.contentFramework) return null;
    if (typeof blueprint.contentFramework === 'string') {
      try {
        return JSON.parse(blueprint.contentFramework);
      } catch {
        return null;
      }
    }
    return blueprint.contentFramework;
  })();

  // Parse whatToInclude
  const whatToInclude: WhatToIncludeItem[] = (() => {
    if (!blueprint.whatToInclude) return [];
    if (typeof blueprint.whatToInclude === 'string') {
      try {
        return JSON.parse(blueprint.whatToInclude);
      } catch {
        return [];
      }
    }
    return Array.isArray(blueprint.whatToInclude) ? blueprint.whatToInclude : [];
  })();

  // Parse whatNotToDo
  const whatNotToDo: WhatNotToDoItem[] = (() => {
    if (!blueprint.whatNotToDo) return [];
    if (typeof blueprint.whatNotToDo === 'string') {
      try {
        return JSON.parse(blueprint.whatNotToDo);
      } catch {
        return [];
      }
    }
    return Array.isArray(blueprint.whatNotToDo) ? blueprint.whatNotToDo : [];
  })();

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
            {/* Content Framework */}
            {contentFramework && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Content Framework</h3>
                <div className={styles.structureFlow}>
                  <ArrowRight size={14} className={styles.structureIcon} />
                  <span className={styles.structureText}>{contentFramework.structure}</span>
                </div>
                {contentFramework.toneGuidance && contentFramework.toneGuidance.length > 0 && (
                  <div className={styles.toneGuidance}>
                    <span className={styles.toneLabel}>Tone Guidance:</span>
                    <ul className={styles.toneList}>
                      {contentFramework.toneGuidance.map((tone, idx) => (
                        <li key={idx}>{tone}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Guidance Summary */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Guidance Summary</h3>

              <div className={styles.copySection}>
                <div className={styles.copyLabel}>
                  <Sparkles size={14} className={styles.sparkleIcon} />
                  <span>Hook Approach:</span>
                </div>
                <p className={styles.hookText}>{blueprint.hook}</p>
              </div>

              <div className={styles.copySection}>
                <div className={styles.copyLabel}>
                  <Lightbulb size={14} className={styles.lightbulbIcon} />
                  <span>Body Direction:</span>
                </div>
                <p className={styles.contextText}>{blueprint.context}</p>
              </div>
            </section>

            {/* What to Include - Collapsible */}
            {whatToInclude.length > 0 && (
              <section className={styles.section}>
                <button
                  className={styles.collapsibleHeader}
                  onClick={() => setIsWhatToIncludeOpen(!isWhatToIncludeOpen)}
                >
                  <div className={styles.collapsibleTitle}>
                    <CheckCircle size={16} className={styles.checklistIcon} />
                    <h3 className={styles.sectionTitle}>What to Include</h3>
                    <span className={styles.collapsibleCount}>{whatToInclude.length} items</span>
                  </div>
                  {isWhatToIncludeOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isWhatToIncludeOpen && (
                  <div className={styles.checklistContainer}>
                    {whatToInclude.map((item, idx) => (
                      <div key={idx} className={styles.checklistItem}>
                        <div className={styles.checklistHeader}>
                          <CheckCircle size={16} className={styles.checklistIcon} />
                          <span className={styles.checklistLabel}>{item.label}</span>
                        </div>
                        <p className={styles.checklistGuidance}>{item.guidance}</p>
                        {item.competitorInsight && (
                          <p className={styles.competitorInsight}>
                            <Lightbulb size={12} />
                            {item.competitorInsight}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* What NOT to Do - Collapsible */}
            {whatNotToDo.length > 0 && (
              <section className={styles.section}>
                <button
                  className={styles.collapsibleHeader}
                  onClick={() => setIsWhatNotToDoOpen(!isWhatNotToDoOpen)}
                >
                  <div className={styles.collapsibleTitle}>
                    <AlertTriangle size={16} className={styles.antiPatternIcon} />
                    <h3 className={styles.sectionTitle}>What NOT to Do</h3>
                    <span className={styles.collapsibleCount}>{whatNotToDo.length} items</span>
                  </div>
                  {isWhatNotToDoOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isWhatNotToDoOpen && (
                  <div className={styles.antiPatternsContainer}>
                    {whatNotToDo.map((item, idx) => (
                      <div key={idx} className={styles.antiPatternItem}>
                        <div className={styles.antiPatternHeader}>
                          <AlertTriangle size={16} className={styles.antiPatternIcon} />
                          <span className={styles.antiPatternText}>{item.antiPattern}</span>
                        </div>
                        <p className={styles.antiPatternReason}>{item.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Distribution Strategy - moved from right */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Distribution Strategy</h3>

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

              {hashtags.length > 0 && (
                <div className={styles.strategySubsection}>
                  <span className={styles.infoLabel}># Hashtags</span>
                  <div className={styles.tagsContainer}>
                    {hashtags.map((hashtag, idx) => {
                      const tag = hashtag.tag.startsWith('#') ? hashtag.tag.slice(1) : hashtag.tag;
                      return (
                        <span key={idx} className={styles.hashtagChip}>
                          #{tag} · {hashtag.engagement}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {mentions.length > 0 && (
                <div className={styles.strategySubsection}>
                  <span className={styles.infoLabel}>@ Mentions</span>
                  <div className={styles.tagsContainer}>
                    {mentions.map((mention, idx) => {
                      const handle = mention.handle.startsWith('@') ? mention.handle.slice(1) : mention.handle;
                      return (
                        <span key={idx} className={styles.mentionChip}>
                          @{handle} · {mention.engagement}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {blueprint.postingInsight && (
                <p className={styles.insightText}>
                  Insight: {blueprint.postingInsight}
                </p>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Suggested Spend */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Suggested Spend</h3>
              <div className={styles.comingSoonContainer}>
                <DollarSign size={32} className={styles.comingSoonIcon} />
                <span className={styles.comingSoonBadge}>Coming Soon</span>
                <p className={styles.comingSoonText}>
                  AI-powered budget recommendations will appear here.
                </p>
              </div>
            </section>

            {/* Visual Recommendation */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Visual Recommendation</h3>
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
            {onSendToStudio && (
              <button
                className={styles.primaryButton}
                onClick={onSendToStudio}
                disabled={isSendingToStudio}
              >
                <Send size={16} />
                {isSendingToStudio ? 'Sending...' : 'Send to Studio'}
              </button>
            )}
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
