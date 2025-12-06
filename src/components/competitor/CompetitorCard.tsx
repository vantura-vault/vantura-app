import { Users, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Competitor } from '../../types/competitor';
import { Card } from '../shared/Card';
import styles from './CompetitorCard.module.css';

interface CompetitorCardProps {
  competitor: Competitor;
  onDelete?: (competitorId: string) => void;
}

export function CompetitorCard({ competitor, onDelete }: CompetitorCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/competitor-vault/${competitor.id}`);
  };

  return (
    <Card className={styles.competitorCard} hoverable onClick={handleClick}>
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
        {onDelete && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Remove ${competitor.name} from your competitors?`)) {
                onDelete(competitor.id);
              }
            }}
            aria-label="Delete competitor"
            title="Remove competitor"
          >
            <Trash2 size={16} />
          </button>
        )}
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
            <FileText size={16} className={styles.icon} />
            <span className={styles.metricLabel}>Posts Tracked</span>
          </div>
          <div className={styles.metricValue}>
            {competitor.metrics.postCount}
          </div>
        </div>
      </div>
    </Card>
  );
}
