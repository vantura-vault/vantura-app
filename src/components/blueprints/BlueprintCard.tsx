import { PlatformIcon } from '../shared/PlatformIcon';
import type { Blueprint } from '../../types/blueprint';
import styles from './BlueprintCard.module.css';

interface BlueprintCardProps {
  blueprint: Blueprint;
  onClick: () => void;
}

export function BlueprintCard({ blueprint, onClick }: BlueprintCardProps) {
  const score = blueprint.vanturaScore ? Math.round(blueprint.vanturaScore) : null;

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.content}>
        <h3 className={styles.title}>{blueprint.title}</h3>
        {score !== null && (
          <span className={styles.scoreBadge}>Score: {score}%</span>
        )}
      </div>
      <div className={styles.platformIcon}>
        <PlatformIcon platform={blueprint.platform} size={40} />
      </div>
    </div>
  );
}
