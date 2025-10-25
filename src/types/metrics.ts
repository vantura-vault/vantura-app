export interface Metric {
  id: string;
  label: string;
  value: number | string;
  icon: string;
  trend?: {
    direction: 'up' | 'down';
    value: number;
  };
}

export interface MetricsData {
  totalFollowers: number;
  avgEngagement: number;
  postsThisWeek: number;
  competitorsTracked: number;
}
