import { Calendar } from 'lucide-react';
import styles from './Scheduler.module.css';

export function Scheduler() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Calendar size={48} />
        </div>
        <h1 className={styles.title}>Scheduler</h1>
        <p className={styles.subtitle}>Coming Soon</p>
        <p className={styles.description}>
          Schedule and automate your social media posts.
          Stay tuned for updates.
        </p>
      </div>
    </div>
  );
}
