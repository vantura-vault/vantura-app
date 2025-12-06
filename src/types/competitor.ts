export interface CompetitorMetrics {
  totalFollowers: number;
  postCount: number;
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  platform: string;
  avatarUrl?: string;
  metrics: CompetitorMetrics;
}
