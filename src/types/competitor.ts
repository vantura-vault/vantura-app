export interface CompetitorMetrics {
  totalFollowers: number;
  averageEngagement: number;
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  platform: string;
  avatarUrl?: string;
  metrics: CompetitorMetrics;
}
