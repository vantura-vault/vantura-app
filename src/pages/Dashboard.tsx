import { WelcomeHeader } from '../components/dashboard/WelcomeHeader';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { PlatformIntel } from '../components/dashboard/PlatformIntel';
import styles from './Dashboard.module.css';

export function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.mainColumn}>
        <WelcomeHeader username="theethanfang" />
        <MetricsGrid />
      </div>
      <div className={styles.sideColumn}>
        <PlatformIntel />
      </div>
    </div>
  );
}
