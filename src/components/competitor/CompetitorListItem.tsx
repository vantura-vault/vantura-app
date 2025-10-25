import { Users, TrendingUp } from 'lucide-react';
import type { Competitor } from '../../types/competitor';
import styles from './CompetitorListItem.module.css';

interface CompetitorListItemProps {
  competitor: Competitor;
}

export function CompetitorListItem({ competitor }: CompetitorListItemProps) {
  return (
    <div className={styles.listItem}>
      <div className={styles.competitorInfo}>
        {competitor.avatarUrl ? (
          <img src={competitor.avatarUrl} alt={competitor.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {competitor.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.details}>
          <h4 className={styles.name}>{competitor.name}</h4>
          <span className={styles.handle}>@{competitor.handle}</span>
        </div>
        <span className={styles.platform}>{competitor.platform}</span>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <Users size={14} className={styles.icon} />
          <span className={styles.metricValue}>
            {competitor.metrics.totalFollowers.toLocaleString()}
          </span>
          <span className={styles.metricLabel}>followers</span>
        </div>

        <div className={styles.metric}>
          <TrendingUp size={14} className={styles.icon} />
          <span className={styles.metricValue}>
            {competitor.metrics.averageEngagement.toFixed(2)}%
          </span>
          <span className={styles.metricLabel}>engagement</span>
        </div>
      </div>
    </div>
  );
}
