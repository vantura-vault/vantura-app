import { Linkedin, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './PlatformIntel.module.css';

const platforms = [
  {
    id: '1',
    name: 'LinkedIn',
    followers: 15420,
    icon: Linkedin,
    isConnected: true,
  },
  {
    id: '2',
    name: 'Twitter/X',
    followers: 8970,
    icon: Twitter,
    isConnected: true,
  },
  {
    id: '3',
    name: 'Instagram',
    followers: 12350,
    icon: Instagram,
    isConnected: true,
  },
  {
    id: '4',
    name: 'Facebook',
    followers: 28500,
    icon: Facebook,
    isConnected: true,
  },
  {
    id: '5',
    name: 'YouTube',
    followers: 45200,
    icon: Youtube,
    isConnected: true,
  },
];

export function PlatformIntel() {
  return (
    <Card className={styles.platformIntel}>
      <h3 className={styles.title}>Intelligence Network</h3>
      <p className={styles.subtitle}>Connected platforms</p>

      <div className={styles.platformList}>
        {platforms.map((platform) => (
          <div key={platform.id} className={styles.platformItem}>
            <div className={styles.platformInfo}>
              <div className={styles.iconWrapper}>
                <platform.icon size={18} />
              </div>
              <div className={styles.details}>
                <span className={styles.platformName}>{platform.name}</span>
                <span className={styles.followers}>
                  {platform.followers.toLocaleString()} followers
                </span>
              </div>
            </div>
            {platform.isConnected && (
              <div className={styles.status}>
                <span className={styles.checkmark}>✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
