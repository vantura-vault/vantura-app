import { Trophy } from 'lucide-react';
import { Card } from '../shared/Card';
import type { LeaderboardEntry } from '../../hooks/useDashboard';
import styles from './EngagementLeaderboard.module.css';

interface EngagementLeaderboardProps {
  entries: LeaderboardEntry[];
}

export function EngagementLeaderboard({ entries }: EngagementLeaderboardProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.iconHeader}>
          <span className={styles.vaultIcon}>
            <Trophy size={28} />
          </span>
          <div>
            <h3 className={styles.title}>Engagement Leaderboard</h3>
            <p className={styles.subtitle}>Average engagement rate across last 5 posts</p>
          </div>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.leaderboard}>
          {entries.map((entry) => (
            <div
              key={entry.companyId}
              className={`${styles.row} ${entry.isYou ? styles.youRow : ''}`}
            >
              <div className={styles.rankSection}>
                {entry.rank === 1 ? (
                  <span className={styles.trophy}>
                    <Trophy size={18} />
                  </span>
                ) : (
                  <span className={styles.rank}>{entry.rank}</span>
                )}
              </div>

              <div className={styles.nameSection}>
                <span className={styles.name}>{entry.name}</span>
              </div>

              <div className={styles.rateSection}>
                <span className={styles.rate}>{entry.engagementRate.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
