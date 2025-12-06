import { Users, Heart, Calendar, TrendingUp } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { useDashboard } from '../../hooks';
import styles from './MetricsGrid.module.css';

export function MetricsGrid() {
  const { data: dashboard, isLoading } = useDashboard();

  if (isLoading) {
    return <div className={styles.grid}>Loading metrics...</div>;
  }

  const overview = dashboard?.overview;

  const metrics = [
    {
      id: '1',
      label: 'Total Followers',
      value: overview?.totalFollowers || 0,
      icon: Users,
      trend: overview?.totalFollowerGrowth?.percentage
        ? {
            direction: overview.totalFollowerGrowth.percentage >= 0 ? ('up' as const) : ('down' as const),
            value: Math.abs(overview.totalFollowerGrowth.percentage)
          }
        : undefined,
    },
    {
      id: '2',
      label: 'Avg Engagement',
      value: overview?.avgEngagement?.rate ? `${overview.avgEngagement.rate.toFixed(1)}%` : '0%',
      icon: Heart,
      trend: overview?.avgEngagement?.growth
        ? {
            direction: overview.avgEngagement.growth >= 0 ? ('up' as const) : ('down' as const),
            value: Math.abs(overview.avgEngagement.growth)
          }
        : undefined,
    },
    {
      id: '3',
      label: 'Posts This Week',
      value: overview?.postsThisWeek || 0,
      icon: Calendar,
    },
    {
      id: '4',
      label: 'Competitors Tracked',
      value: overview?.competitorsTracked || 0,
      icon: TrendingUp,
    },
  ];

  return (
    <div className={styles.grid}>
      {metrics.map((metric) => (
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
