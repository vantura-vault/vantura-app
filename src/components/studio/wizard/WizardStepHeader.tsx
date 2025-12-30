import styles from './WizardStepHeader.module.css';

interface WizardStepHeaderProps {
  stepLabel: string;
  title: string;
  description: string;
}

export function WizardStepHeader({ stepLabel, title, description }: WizardStepHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.stepIndicator}>
        <span className={styles.stepBadge}>{stepLabel}</span>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
