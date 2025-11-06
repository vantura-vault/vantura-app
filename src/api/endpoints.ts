import { apiClient } from './client';
import type { MetricsData } from '../types/metrics';
import type { Platform, PlatformStats } from '../types/platforms';
import type { StrategicMovesData } from '../types/recommendations';
import type {
  HistoricalMetricsParams,
  HistoricalMetricsData,
  RecentPostsParams,
  RecentPostsData,
  AnalyticsSummaryParams,
  AnalyticsSummaryData,
} from '../types/analytics';
import type {
  GenerateSuggestionsParams,
  SuggestionsData,
} from '../types/suggestions';
import type {
  CompetitorsListParams,
  CompetitorsListData,
  AddCompetitorParams,
  AddCompetitorData,
  BrightDataCompetitorParams,
  CompetitorDetailsParams,
  CompetitorCard,
} from '../types/vault';

// Authentication
export interface RegisterParams {
  email: string;
  name: string;
  password: string;
  companyName: string;
  companyIndustry: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    companyId: string | null;
  };
  token: string;
  expiresAt: string;
}

export const register = async (params: RegisterParams): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('/auth/register', params);
};

// Metrics
export const fetchMetrics = async (): Promise<MetricsData> => {
  return apiClient.get<MetricsData>('/metrics');
};

// Platforms
export const fetchPlatforms = async (): Promise<Platform[]> => {
  return apiClient.get<Platform[]>('/platforms');
};

export const fetchPlatformStats = async (platformId: string): Promise<PlatformStats> => {
  return apiClient.get<PlatformStats>(`/platforms/${platformId}/stats`);
};

export const connectPlatform = async (platformName: string, authCode: string) => {
  return apiClient.post('/platforms/connect', { platformName, authCode });
};

export const disconnectPlatform = async (platformId: string) => {
  return apiClient.delete(`/platforms/${platformId}`);
};

// Recommendations
export const fetchRecommendations = async (): Promise<StrategicMovesData> => {
  return apiClient.get<StrategicMovesData>('/recommendations');
};

// Authentication
export const login = async (email: string, password: string) => {
  return apiClient.post('/auth/login', { email, password });
};

export const logout = async () => {
  return apiClient.post('/auth/logout');
};

export const refreshToken = async () => {
  return apiClient.post('/auth/refresh');
};

// Analytics
export const fetchHistoricalMetrics = async (
  params: HistoricalMetricsParams
): Promise<HistoricalMetricsData> => {
  const queryParams = new URLSearchParams({
    companyId: params.companyId,
    ...(params.platform && { platform: params.platform }),
    ...(params.range && { range: params.range }),
    ...(params.ma && { ma: params.ma.toString() }),
    ...(params.comparisonMode && { comparisonMode: params.comparisonMode }),
  });
  return apiClient.get<HistoricalMetricsData>(`/analytics/historical?${queryParams}`);
};

export const fetchRecentPosts = async (
  params: RecentPostsParams
): Promise<RecentPostsData> => {
  const queryParams = new URLSearchParams({
    companyId: params.companyId,
    ...(params.platform && { platform: params.platform }),
    ...(params.limit && { limit: params.limit.toString() }),
  });
  return apiClient.get<RecentPostsData>(`/analytics/recent?${queryParams}`);
};

export const fetchAnalyticsSummary = async (
  params: AnalyticsSummaryParams
): Promise<AnalyticsSummaryData> => {
  const queryParams = new URLSearchParams({
    companyId: params.companyId,
    ...(params.range && { range: params.range }),
  });
  return apiClient.get<AnalyticsSummaryData>(`/analytics/summary?${queryParams}`);
};

// Post Suggestions
export const generateSuggestions = async (
  params: GenerateSuggestionsParams
): Promise<SuggestionsData> => {
  return apiClient.post<SuggestionsData>('/suggestions', params);
};

// Competitor Vault
export const fetchCompetitors = async (
  params: CompetitorsListParams
): Promise<CompetitorsListData> => {
  const queryParams = new URLSearchParams({
    companyId: params.companyId,
  });
  return apiClient.get<CompetitorsListData>(`/vault/competitors?${queryParams}`);
};

export const addCompetitor = async (
  params: AddCompetitorParams
): Promise<AddCompetitorData> => {
  return apiClient.post<AddCompetitorData>('/vault/competitors', params);
};

export const addCompetitorViaBrightData = async (
  params: BrightDataCompetitorParams
): Promise<AddCompetitorData> => {
  return apiClient.post<AddCompetitorData>('/vault/competitors/brightdata', params);
};

export const fetchCompetitorDetails = async (
  params: CompetitorDetailsParams
): Promise<CompetitorCard> => {
  return apiClient.get<CompetitorCard>(`/vault/competitors/${params.id}`);
};

export const deleteCompetitor = async (competitorId: string, companyId: string): Promise<void> => {
  return apiClient.delete<void>(`/vault/competitors/${competitorId}`, { companyId });
};
