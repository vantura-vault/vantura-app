import styles from './WelcomeHeader.module.css';

interface WelcomeHeaderProps {
  companyName: string;
}

export function WelcomeHeader({ companyName }: WelcomeHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.greeting}>Your next move, {companyName}</h2>
      <p className={styles.subtitle}>Strategic intelligence briefing for today's landscape.</p>
    </div>
  );
}
