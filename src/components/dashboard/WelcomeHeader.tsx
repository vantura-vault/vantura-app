import styles from './WelcomeHeader.module.css';

interface WelcomeHeaderProps {
  companyName: string;
  logoUrl?: string;
}

export function WelcomeHeader({ companyName, logoUrl }: WelcomeHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.greeting}>
        Your next move,{' '}
        {logoUrl && (
          <img src={logoUrl} alt={companyName} className={styles.companyLogo} />
        )}
        {companyName}
      </h2>
      <p className={styles.subtitle}>Strategic intelligence briefing for today's landscape.</p>
    </div>
  );
}
