// Post Suggestions API Types

export interface GenerateSuggestionsParams {
  companyId: string;
  platform: string;
  objective?: string;
  topicTags?: string[];
  nVariants?: number;
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

export interface SuggestionsData {
  variants: PostVariant[];
  meta: SuggestionsMetadata;
}
