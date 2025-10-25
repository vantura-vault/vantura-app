import { Users, Heart, Calendar, TrendingUp } from 'lucide-react';
import { MetricCard } from './MetricCard';
import styles from './MetricsGrid.module.css';

const mockMetrics = [
  {
    id: '1',
    label: 'Total Followers',
    value: 84230,
    icon: Users,
    trend: { direction: 'up' as const, value: 12 },
  },
  {
    id: '2',
    label: 'Avg Engagement',
    value: '4.8%',
    icon: Heart,
    trend: { direction: 'up' as const, value: 8 },
  },
  {
    id: '3',
    label: 'Posts This Week',
    value: 7,
    icon: Calendar,
  },
  {
    id: '4',
    label: 'Competitors Tracked',
    value: 30,
    icon: TrendingUp,
  },
];

export function MetricsGrid() {
  return (
    <div className={styles.grid}>
      {mockMetrics.map((metric) => (
        <MetricCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          icon={metric.icon}
          trend={metric.trend}
        />
      ))}
    </div>
  );
}
