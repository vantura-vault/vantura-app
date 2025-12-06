import { Users, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Competitor } from '../../types/competitor';
import styles from './CompetitorListItem.module.css';

interface CompetitorListItemProps {
  competitor: Competitor;
  onDelete?: (competitorId: string) => void;
}

export function CompetitorListItem({ competitor, onDelete }: CompetitorListItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/competitor-vault/${competitor.id}`);
  };

  return (
    <div className={styles.listItem} onClick={handleClick}>
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
          <FileText size={14} className={styles.icon} />
          <span className={styles.metricValue}>
            {competitor.metrics.postCount}
          </span>
          <span className={styles.metricLabel}>posts</span>
        </div>
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
  );
}
