// Post Suggestions API Types

export interface GenerateSuggestionsParams {
  companyId: string;
  platform: string;
  objective?: string;
  contentAngle?: string;
  topicTags?: string[];
  nVariants?: number;
  useDataChamber?: boolean;
  useYourTopPosts?: boolean;
  useCompetitorPosts?: boolean;
}

export interface PostVariant {
  text: string;
  analyticsScore: number;
  criticScore: number;
  finalScore: number;
}

export interface SuggestionBrief {
  platform: string;
  objective?: string;
  topicTags?: string[];
}

export interface SuggestionsMetadata {
  brief: SuggestionBrief;
  examplesUsed: any[];
  competitorAngles: any[];
}

export interface BlueprintData {
  title: string;
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
}

export interface SuggestionsData {
  variants: PostVariant[];
  blueprint?: BlueprintData;
  meta: SuggestionsMetadata;
}
