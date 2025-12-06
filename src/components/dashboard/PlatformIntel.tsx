import { Linkedin } from 'lucide-react';
import { Card } from '../shared/Card';
import { useDashboard } from '../../hooks';
import styles from './PlatformIntel.module.css';

const allPlatforms = [
  { name: 'LinkedIn', icon: Linkedin },
];

export function PlatformIntel() {
  const { data: dashboard } = useDashboard();

  // Get connected platform names from API
  const connectedPlatformNames = new Set(
    dashboard?.platforms?.map(p => p.name) || []
  );

  return (
    <Card className={styles.platformIntel}>
      <h3 className={styles.title}>Intelligence Network</h3>
      <p className={styles.subtitle}>Connected platforms</p>

      <div className={styles.platformList}>
        {allPlatforms.map((platform, idx) => {
          const isConnected = connectedPlatformNames.has(platform.name);
          const connectedPlatform = dashboard?.platforms?.find(p => p.name === platform.name);
          const followers = connectedPlatform?.current?.followers || 0;

          return (
            <div key={idx} className={styles.platformItem}>
              <div className={styles.platformInfo}>
                <div className={styles.iconWrapper}>
                  <platform.icon size={18} />
                </div>
                <div className={styles.details}>
                  <span className={styles.platformName}>{platform.name}</span>
                  <span className={styles.followers}>
                    {followers.toLocaleString()} followers
                  </span>
                </div>
              </div>
              {isConnected && (
                <div className={styles.status}>
                  <span className={styles.checkmark}>✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
