import styles from './WelcomeHeader.module.css';

interface WelcomeHeaderProps {
  username: string;
}

export function WelcomeHeader({ username }: WelcomeHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.greeting}>Your next move, {username}</h2>
      <p className={styles.subtitle}>Strategic intelligence briefing for today's landscape.</p>
    </div>
  );
}
