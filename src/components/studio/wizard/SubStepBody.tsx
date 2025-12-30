import { useCallback } from 'react';
import { ArrowLeft, ArrowRight, FileText, Lightbulb } from 'lucide-react';
import { WizardStepHeader } from './WizardStepHeader';
import type { DraftBlueprint } from '../../../types/draft';
import type { WhatToIncludeItem } from '../../../types/blueprint';
import styles from './SubStep.module.css';

interface SubStepBodyProps {
  blueprint: DraftBlueprint;
  value: string;
  hookValue: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const BODY_CHAR_LIMIT = 500;

export function SubStepBody({
  blueprint,
  value,
  hookValue,
  onChange,
  onNext,
  onBack,
}: SubStepBodyProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Parse whatToInclude for guidance
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

  // Filter for body-relevant items (product announcement, flavor description, etc.)
  const bodyItems = whatToInclude.filter(item =>
    ['Product Announcement', 'Flavor Description', 'Key Message', 'Value Proposition'].some(
      label => item.label.toLowerCase().includes(label.toLowerCase())
    ) || whatToInclude.indexOf(item) < 3 // First 3 items are typically body content
  );

  const charCount = value.length;
  const isOverLimit = charCount > BODY_CHAR_LIMIT;
  const isNearLimit = charCount > BODY_CHAR_LIMIT * 0.8;

  return (
    <div className={styles.container}>
      <WizardStepHeader
        stepLabel="Step 3.2"
        title="Write Your Body"
        description="Expand on your hook with the main message and key details."
      />

      <div className={styles.columns}>
        {/* Left Column - Guidance */}
        <div className={styles.guidanceColumn}>
          <h3 className={styles.columnTitle}>Body Guide</h3>

          <div className={styles.guidanceSection}>
            <h4 className={styles.guidanceTitle}>
              <FileText size={14} className={styles.guidanceIcon} />
              Purpose
            </h4>
            <p className={styles.guidanceText}>
              This is where you deliver your main message. Explain the value, share details, and build on your hook.
            </p>
          </div>

          <div className={styles.guidanceSection}>
            <h4 className={styles.guidanceTitle}>
              <Lightbulb size={14} className={styles.tipIcon} />
              Tips
            </h4>
            <ul className={styles.tipsList}>
              <li>Keep sentences short and punchy</li>
              <li>Focus on benefits, not just features</li>
              <li>Use line breaks for readability</li>
              <li>Include specific details that add credibility</li>
            </ul>
          </div>

          {bodyItems.length > 0 && (
            <div className={styles.guidanceSection}>
              <h4 className={styles.guidanceTitle}>Include</h4>
              <ul className={styles.tipsList}>
                {bodyItems.slice(0, 3).map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.label}:</strong> {item.guidance}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Center Column - Editor */}
        <div className={styles.editorColumn}>
          <h3 className={styles.columnTitle}>Your Body Content</h3>

          <div className={styles.editorWrapper}>
            <textarea
              className={`${styles.textInput} ${styles.bodyInput} ${isOverLimit ? styles.textInputError : ''}`}
              placeholder="Expand on your hook with the main message..."
              value={value}
              onChange={handleChange}
            />
            <div className={`${styles.charCount} ${isOverLimit ? styles.charCountError : isNearLimit ? styles.charCountWarning : ''}`}>
              {charCount} / {BODY_CHAR_LIMIT}
            </div>
          </div>

          {/* Preview of hook + body */}
          {hookValue && (
            <div className={styles.previewSection}>
              <h4 className={styles.previewTitle}>Preview So Far</h4>
              <div className={styles.previewContent}>
                <span style={{ fontWeight: 600 }}>{hookValue}</span>
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
          Back to Hook
        </button>
        <button
          className={styles.nextButton}
          onClick={onNext}
          disabled={isOverLimit}
        >
          Continue to Engagement
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
