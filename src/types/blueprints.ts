export interface Blueprint {
  id: string;
  companyId: string;
  title: string;
  platform: string;
  objective: string;
  topicTags: string[];
  contentAngle?: string;
  useDataChamber: boolean;
  useYourTopPosts: boolean;
  useCompetitorPosts: boolean;
  reasoning?: string;
  visualDescription: string;
  references?: string;
  hook: string;
  context: string;
  hashtags: Array<{ tag: string; engagement: string }>;
  mentions?: Array<{ handle: string; engagement: string }>;
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
  createdAt: string;
  updatedAt: string;
}

export interface SaveBlueprintInput {
  companyId: string;
  title: string;
  platform: string;
  objective: string;
  topicTags: string[];
  contentAngle?: string;
  useDataChamber?: boolean;
  useYourTopPosts?: boolean;
  useCompetitorPosts?: boolean;
  reasoning?: string;
  visualDescription: string;
  hook: string;
  context: string;
  hashtags: Array<{ tag: string; engagement: string }>;
  mentions?: Array<{ handle: string; engagement: string }>;
  bestTimeToPost?: string;
  recommendedFormat?: string;
  postingInsight?: string;
  dataSources?: string[];
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

export interface GetBlueprintsParams {
  companyId: string;
  platform?: string;
  sortBy?: 'createdAt' | 'vanturaScore' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface GetBlueprintsResponse {
  blueprints: Blueprint[];
  total: number;
  limit: number;
  offset: number;
}
