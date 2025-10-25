import { Card } from '../components/shared/Card';
import styles from './Settings.module.css';

export function Settings() {
  return (
    <div className={styles.settings}>
      <Card>
        <h2>Settings</h2>
        <p className={styles.subtitle}>Configure your account and preferences</p>
        {/* Settings content will be added here */}
      </Card>
    </div>
  );
}
