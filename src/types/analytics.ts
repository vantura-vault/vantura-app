// Analytics API Types

export interface HistoricalMetricsParams {
  companyId: string;
  platform?: string;
  range?: '1M' | '6M' | '1Y' | 'ALL';
  ma?: number;
}

export interface HistoricalMetricsData {
  platform: string;
  range: string;
  dates: string[];
  followers: number[];
  engagement: number[];
}

export interface PostPerformance {
  postId: string;
  platform: string;
  content: string;
  postedAt: string;
  impressions: number;
  engagement: number;
  engagementRate: number;
  ctr: number;
  summary: string;
}

export interface RecentPostsParams {
  companyId: string;
  platform?: string;
  limit?: number;
}

export interface RecentPostsData {
  items: PostPerformance[];
}
