// Blueprint API Types

export type ActionType = 'post' | 'comment' | 'repost' | 'story' | 'video';

export interface Hashtag {
  tag: string;
  engagement: string;
}

export interface Mention {
  handle: string;
  engagement: string;
}

export interface Reference {
  name: string;
  handle?: string;
  reason: string;
}

export interface Blueprint {
  id: string;
  companyId: string;
  title: string;
  platform: string;
  actionType?: ActionType;

  // Generation inputs
  objective: string;
  topicTags: string[];
  contentAngle?: string;
  useDataChamber: boolean;
  useYourTopPosts: boolean;
  useCompetitorPosts: boolean;

  // AI Reasoning
  reasoning?: string;

  // Visual Description
  visualDescription: string;

  // References (industry leaders who inspired the content)
  references?: Reference[] | string;

  // Post Copy
  hook: string;
  context: string;

  // Hashtags & Mentions
  hashtags: Hashtag[];
  mentions?: Mention[];

  // Posting Intelligence
  bestTimeToPost?: string;
  recommendedFormat?: string;
  postingInsight?: string;

  // Data & Insights
  dataSources: string[];
  timeWindow?: string;
  confidence?: number;
  yourPerformanceScore?: number;
  competitorScore?: number;

  // Performance Forecast
  vanturaScore?: number;
  estimatedReachMin?: number;
  estimatedReachMax?: number;
  estimatedEngagementMin?: number;
  estimatedEngagementMax?: number;
  optimizationNote?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateBlueprintParams {
  companyId: string;
  title: string;
  platform: string;
  actionType?: ActionType;
  objective: string;
  topicTags: string[];
  contentAngle?: string;
  useDataChamber?: boolean;
  useYourTopPosts?: boolean;
  useCompetitorPosts?: boolean;
  reasoning?: string;
  visualDescription: string;
  references?: Reference[] | string;
  hook: string;
  context: string;
  hashtags: Hashtag[];
  mentions?: Mention[];
  bestTimeToPost?: string;
  recommendedFormat?: string;
  postingInsight?: string;
  dataSources: string[];
  timeWindow?: string;
  confidence?: number;
  yourPerformanceScore?: number;
  competitorScore?: number;
  vanturaScore?: number;
  estimatedReachMin?: number;
  estimatedReachMax?: number;
  estimatedEngagementMin?: number;
  estimatedEngagementMax?: number;
  optimizationNote?: string;
}
