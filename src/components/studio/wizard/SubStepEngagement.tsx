import { useCallback } from 'react';
import { ArrowLeft, ArrowRight, Users, Lightbulb } from 'lucide-react';
import { WizardStepHeader } from './WizardStepHeader';
import type { DraftBlueprint } from '../../../types/draft';
import type { WhatToIncludeItem } from '../../../types/blueprint';
import styles from './SubStep.module.css';

interface SubStepEngagementProps {
  blueprint: DraftBlueprint;
  value: string;
  hookValue: string;
  bodyValue: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const ENGAGEMENT_CHAR_LIMIT = 200;

export function SubStepEngagement({
  blueprint,
  value,
  hookValue,
  bodyValue,
  onChange,
  onNext,
  onBack,
}: SubStepEngagementProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Parse whatToInclude for engagement guidance
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

  // Find engagement-related items
  const engagementItem = whatToInclude.find(item =>
    item.label.toLowerCase().includes('engagement') ||
    item.label.toLowerCase().includes('community') ||
    item.label.toLowerCase().includes('interaction')
  );

  const charCount = value.length;
  const isOverLimit = charCount > ENGAGEMENT_CHAR_LIMIT;
  const isNearLimit = charCount > ENGAGEMENT_CHAR_LIMIT * 0.8;

  return (
    <div className={styles.container}>
      <WizardStepHeader
        stepLabel="Step 3.3"
        title="Drive Engagement"
        description="Encourage your audience to interact with a question or prompt."
      />

      <div className={styles.columns}>
        {/* Left Column - Guidance */}
        <div className={styles.guidanceColumn}>
          <h3 className={styles.columnTitle}>Engagement Guide</h3>

          <div className={styles.guidanceSection}>
            <h4 className={styles.guidanceTitle}>
              <Users size={14} className={styles.guidanceIcon} />
              Purpose
            </h4>
            <p className={styles.guidanceText}>
              This section invites your audience to participate. Questions and prompts boost comments and shares.
            </p>
          </div>

          <div className={styles.guidanceSection}>
            <h4 className={styles.guidanceTitle}>
              <Lightbulb size={14} className={styles.tipIcon} />
              Tips
            </h4>
            <ul className={styles.tipsList}>
              <li>Ask an open-ended question</li>
              <li>Invite followers to share their experience</li>
              <li>Use "Tag someone who..." prompts</li>
              <li>Request opinions or preferences</li>
              <li>Create polls or "This or That" moments</li>
            </ul>
          </div>

          {engagementItem && (
            <div className={styles.guidanceSection}>
              <div className={styles.exampleCard}>
                <div className={styles.exampleLabel}>Blueprint Guidance</div>
                <p className={styles.exampleText}>{engagementItem.guidance}</p>
              </div>
            </div>
          )}
        </div>

        {/* Center Column - Editor */}
        <div className={styles.editorColumn}>
          <h3 className={styles.columnTitle}>Your Engagement Prompt</h3>

          <div className={styles.editorWrapper}>
            <textarea
              className={`${styles.textInput} ${styles.engagementInput} ${isOverLimit ? styles.textInputError : ''}`}
              placeholder="Ask a question or invite participation..."
              value={value}
              onChange={handleChange}
            />
            <div className={`${styles.charCount} ${isOverLimit ? styles.charCountError : isNearLimit ? styles.charCountWarning : ''}`}>
              {charCount} / {ENGAGEMENT_CHAR_LIMIT}
            </div>
          </div>

          {/* Preview */}
          {(hookValue || bodyValue) && (
            <div className={styles.previewSection}>
              <h4 className={styles.previewTitle}>Preview So Far</h4>
              <div className={styles.previewContent}>
                {hookValue && <span style={{ fontWeight: 600 }}>{hookValue}</span>}
                {bodyValue && (
                  <>
                    {'\n\n'}
                    {bodyValue}
                  </>
                )}
                {value && (
                  <>
                    {'\n\n'}
                    {value}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Body
        </button>
        <button
          className={styles.nextButton}
          onClick={onNext}
          disabled={isOverLimit}
        >
          Continue to CTA
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
