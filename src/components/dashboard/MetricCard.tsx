import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down';
    value: number;
  };
}

export function MetricCard({ label, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className={styles.metricCard}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Icon size={20} className={styles.icon} />
        </div>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {trend && (
        <div className={`${styles.trend} ${trend.direction === 'up' ? styles.trendUp : styles.trendDown}`}>
          {trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend.value}%</span>
        </div>
      )}
    </Card>
  );
}
