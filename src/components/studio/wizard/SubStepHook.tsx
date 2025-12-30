import { useCallback } from 'react';
import { ArrowLeft, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { WizardStepHeader } from './WizardStepHeader';
import type { DraftBlueprint } from '../../../types/draft';
import styles from './SubStep.module.css';

interface SubStepHookProps {
  blueprint: DraftBlueprint;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const HOOK_CHAR_LIMIT = 150;

export function SubStepHook({
  blueprint,
  value,
  onChange,
  onNext,
  onBack,
}: SubStepHookProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const charCount = value.length;
  const isOverLimit = charCount > HOOK_CHAR_LIMIT;
  const isNearLimit = charCount > HOOK_CHAR_LIMIT * 0.8;

  return (
    <div className={styles.container}>
      <WizardStepHeader
        stepLabel="Step 3.1"
        title="Write Your Hook"
        description="Grab attention with a powerful opening line that stops the scroll."
      />

      <div className={styles.columns}>
        {/* Left Column - Guidance */}
        <div className={styles.guidanceColumn}>
          <h3 className={styles.columnTitle}>Hook Guide</h3>

          <div className={styles.guidanceSection}>
            <h4 className={styles.guidanceTitle}>
              <Target size={14} className={styles.guidanceIcon} />
              Purpose
            </h4>
            <p className={styles.guidanceText}>
              Your hook is the first thing people see. Make it impossible to scroll past.
            </p>
          </div>

          <div className={styles.guidanceSection}>
            <h4 className={styles.guidanceTitle}>
              <Lightbulb size={14} className={styles.tipIcon} />
              Tips
            </h4>
            <ul className={styles.tipsList}>
              <li>Start with a bold statement or question</li>
              <li>Create curiosity or urgency</li>
              <li>Speak directly to your audience's pain point</li>
              <li>Avoid generic openings like "We're excited to..."</li>
            </ul>
          </div>

          {blueprint.hook && (
            <div className={styles.guidanceSection}>
              <div className={styles.exampleCard}>
                <div className={styles.exampleLabel}>Blueprint Suggestion</div>
                <p className={styles.exampleText}>"{blueprint.hook}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Center Column - Editor */}
        <div className={styles.editorColumn}>
          <h3 className={styles.columnTitle}>Your Hook</h3>

          <div className={styles.editorWrapper}>
            <textarea
              className={`${styles.textInput} ${styles.hookInput} ${isOverLimit ? styles.textInputError : ''}`}
              placeholder="Start with something that grabs attention..."
              value={value}
              onChange={handleChange}
            />
            <div className={`${styles.charCount} ${isOverLimit ? styles.charCountError : isNearLimit ? styles.charCountWarning : ''}`}>
              {charCount} / {HOOK_CHAR_LIMIT}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Visual
        </button>
        <button
          className={styles.nextButton}
          onClick={onNext}
          disabled={isOverLimit}
        >
          Continue to Body
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
