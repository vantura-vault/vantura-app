import type { WizardStep, CaptionSubStep } from '../../../types/draft';
import { WIZARD_STEP_LABELS, WIZARD_STEPS, CAPTION_SUB_STEP_LABELS } from '../../../types/draft';
import styles from './WizardProgress.module.css';

interface WizardProgressProps {
  currentStep: WizardStep;
  captionSubStep?: CaptionSubStep;
  onStepClick: (step: WizardStep) => void;
  onSubStepClick?: (subStep: CaptionSubStep) => void;
}

export function WizardProgress({
  currentStep,
  captionSubStep = 1,
  onStepClick,
  onSubStepClick,
}: WizardProgressProps) {
  const steps: WizardStep[] = [1, 2, 3, 4];
  const subSteps: CaptionSubStep[] = [1, 2, 3, 4];
  const isOnCaptionStep = currentStep === WIZARD_STEPS.CAPTION;

  return (
    <div className={styles.container}>
      <div className={styles.progressTrack}>
        {steps.map((step, index) => (
          <div key={step} className={styles.stepWrapper}>
            {/* Connector line (not for first step) */}
            {index > 0 && (
              <div
                className={`${styles.connector} ${
                  currentStep >= step ? styles.connectorActive : ''
                }`}
              />
            )}

            {/* Step dot */}
            <button
              className={`${styles.stepDot} ${
                currentStep === step ? styles.stepDotCurrent : ''
              } ${currentStep > step ? styles.stepDotCompleted : ''}`}
              onClick={() => onStepClick(step)}
              title={WIZARD_STEP_LABELS[step]}
            >
              {currentStep > step ? (
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className={styles.stepNumber}>{step}</span>
              )}
            </button>

            {/* Step label (below dot) */}
            <span
              className={`${styles.stepLabel} ${
                currentStep === step ? styles.stepLabelCurrent : ''
              }`}
            >
              {WIZARD_STEP_LABELS[step]}
            </span>

            {/* Sub-steps placeholder - always rendered to reserve space */}
            {step === WIZARD_STEPS.CAPTION && (
              <div className={`${styles.subStepsContainer} ${!isOnCaptionStep ? styles.subStepsHidden : ''}`}>
                {subSteps.map((subStep) => (
                  <button
                    key={subStep}
                    className={`${styles.subStepDot} ${
                      captionSubStep === subStep ? styles.subStepDotCurrent : ''
                    } ${captionSubStep > subStep ? styles.subStepDotCompleted : ''}`}
                    onClick={() => onSubStepClick?.(subStep)}
                    title={`3.${subStep} ${CAPTION_SUB_STEP_LABELS[subStep]}`}
                    disabled={!isOnCaptionStep}
                  >
                    {captionSubStep > subStep ? (
                      <svg
                        className={styles.subCheckIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className={styles.subStepNumber}>3.{subStep}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
