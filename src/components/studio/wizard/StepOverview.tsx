import { Sparkles, Lightbulb, Clock, FileText, CheckCircle, AlertTriangle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { PlatformIcon } from '../../shared/PlatformIcon';
import { WizardStepHeader } from './WizardStepHeader';
import type { DraftBlueprint } from '../../../types/draft';
import type { Hashtag, ContentFramework, WhatToIncludeItem, WhatNotToDoItem } from '../../../types/blueprint';
import styles from './StepOverview.module.css';

interface StepOverviewProps {
  blueprint: DraftBlueprint;
  onNext: () => void;
}

export function StepOverview({ blueprint, onNext }: StepOverviewProps) {
  const [isWhatToIncludeOpen, setIsWhatToIncludeOpen] = useState(false);
  const [isWhatNotToDoOpen, setIsWhatNotToDoOpen] = useState(false);

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

  // Parse hashtags
  const hashtags: Hashtag[] = Array.isArray(blueprint.hashtags) ? blueprint.hashtags : [];

  return (
    <div className={styles.container}>
      {/* Standardized Header */}
      <WizardStepHeader
        stepLabel="Step 1"
        title="Overview"
        description="Review your content blueprint before creating"
      />

      {/* Blueprint Info */}
      <div className={styles.blueprintInfo}>
        <PlatformIcon platform={blueprint.platform} size={28} />
        <div>
          <h3 className={styles.blueprintTitle}>{blueprint.title}</h3>
          <span className={styles.objective}>Objective: {blueprint.objective}</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className={styles.columns}>
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
                    {contentFramework.toneGuidance.map((tone: string, idx: number) => (
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
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Visual Recommendation */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Visual Recommendation</h3>
            <p className={styles.visualDescription}>{blueprint.visualDescription}</p>
          </section>

          {/* Distribution Strategy */}
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
              <div className={styles.hashtagsSection}>
                <span className={styles.infoLabel}># Suggested Hashtags</span>
                <div className={styles.tagsContainer}>
                  {hashtags.map((hashtag, idx) => {
                    const tag = hashtag.tag.startsWith('#') ? hashtag.tag.slice(1) : hashtag.tag;
                    return (
                      <span key={idx} className={styles.hashtagChip}>
                        #{tag}
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
      </div>

      {/* Next Button */}
      <div className={styles.footer}>
        <button className={styles.nextButton} onClick={onNext}>
          Continue to Visual Builder
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
