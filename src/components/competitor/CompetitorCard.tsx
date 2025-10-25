import { Users, TrendingUp } from 'lucide-react';
import type { Competitor } from '../../types/competitor';
import { Card } from '../shared/Card';
import styles from './CompetitorCard.module.css';

interface CompetitorCardProps {
  competitor: Competitor;
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <Card className={styles.competitorCard} hoverable>
      <div className={styles.header}>
        {competitor.avatarUrl ? (
          <img src={competitor.avatarUrl} alt={competitor.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {competitor.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.info}>
          <h3 className={styles.name}>{competitor.name}</h3>
          <p className={styles.handle}>@{competitor.handle}</p>
          <span className={styles.platform}>{competitor.platform}</span>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricHeader}>
            <Users size={16} className={styles.icon} />
            <span className={styles.metricLabel}>Total Followers</span>
          </div>
          <div className={styles.metricValue}>
            {competitor.metrics.totalFollowers.toLocaleString()}
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricHeader}>
            <TrendingUp size={16} className={styles.icon} />
            <span className={styles.metricLabel}>Avg. Engagement</span>
          </div>
          <div className={styles.metricValue}>
            {competitor.metrics.averageEngagement.toFixed(2)}%
          </div>
        </div>
      </div>
    </Card>
  );
}
