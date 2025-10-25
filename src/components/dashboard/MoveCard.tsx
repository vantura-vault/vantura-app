import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import type { RecommendationBadge } from '../../types/recommendations';
import styles from './MoveCard.module.css';

interface MoveCardProps {
  title: string;
  description: string;
  badge: RecommendationBadge;
  icon: LucideIcon;
  metadata?: {
    engagementPotential?: string;
    estimatedReach?: string;
  };
  actionLabel: string;
  onAction: () => void;
}

export function MoveCard({
  title,
  description,
  badge,
  icon: Icon,
  metadata,
  actionLabel,
  onAction,
}: MoveCardProps) {
  return (
    <Card hoverable className={styles.moveCard}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Icon size={20} />
        </div>
        <div className={styles.titleRow}>
          <h4 className={styles.title}>{title}</h4>
          <Badge variant={badge}>{badge.replace('-', ' ')}</Badge>
        </div>
      </div>

      <p className={styles.description}>{description}</p>

      {metadata && (
        <div className={styles.metadata}>
          {metadata.engagementPotential && (
            <span className={styles.metaItem}>🎯 {metadata.engagementPotential}</span>
          )}
          {metadata.estimatedReach && (
            <span className={styles.metaItem}>📊 {metadata.estimatedReach}</span>
          )}
        </div>
      )}

      <Button variant="primary" onClick={onAction} className={styles.actionBtn}>
        {actionLabel}
        <ArrowRight size={16} />
      </Button>
    </Card>
  );
}
