// Analytics API Types

export type ComparisonMode = 'none' | 'top' | 'all' | 'industry';

export interface HistoricalMetricsParams {
  companyId: string;
  platform?: string;
  range?: '1M' | '6M' | '1Y' | 'ALL';
  ma?: number;
  comparisonMode?: ComparisonMode;
}

export interface HistoricalMetricsData {
  platform: string;
  range: string;
  dates: string[];
  followers: number[];
  engagement: number[];
  competitorFollowers?: number[];
  competitorEngagement?: number[];
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

export interface AnalyticsSummaryParams {
  companyId: string;
  range?: '1M' | '6M' | '1Y' | 'ALL';
}

export interface AnalyticsSummaryData {
  totalReach: number;
  totalReachChange: number;
  engagementRate: number;
  engagementRateChange: number;
  audienceGrowth: number;
  audienceGrowthChange: number;
}
