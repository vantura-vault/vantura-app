import { Zap } from 'lucide-react';
import styles from './Signals.module.css';

export function Signals() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Zap size={48} />
        </div>
        <h1 className={styles.title}>Signals</h1>
        <p className={styles.subtitle}>Coming Soon</p>
        <p className={styles.description}>
          Real-time competitor intelligence and market signals.
          Stay tuned for updates.
        </p>
      </div>
    </div>
  );
}
