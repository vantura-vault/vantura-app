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
  CompetitorDetailsParams,
  CompetitorDetails,
} from '../types/vault';
import type {
  DataChamberSettings,
  UpdateDataChamberSettings,
  DataHealthResult,
} from '../types/dataChamber';
import type {
  LoginResponse,
} from '../types/auth';
import type {
  Blueprint,
  CreateBlueprintParams,
} from '../types/blueprint';

// Authentication
export interface RegisterParams {
  email: string;
  name: string;
  password: string;
  companyName: string;
  companyIndustry?: string;
  linkedInUrl: string;
  linkedInType: 'company' | 'profile';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    companyId: string | null;
    role: string;
  };
  token: string;
  expiresAt: string;
  isNewCompany: boolean;
}

export interface CheckLinkedInResponse {
  exists: boolean;
  companyName?: string;
  message: string;
}

export const register = async (params: RegisterParams): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('/auth/register', params);
};

export const checkLinkedIn = async (linkedInUrl: string): Promise<CheckLinkedInResponse> => {
  return apiClient.post<CheckLinkedInResponse>('/auth/check-linkedin', { linkedInUrl });
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
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>('/auth/login', { email, password });
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

export const fetchCompetitorDetails = async (
  params: CompetitorDetailsParams
): Promise<CompetitorDetails> => {
  const queryParams = new URLSearchParams({
    companyId: params.companyId,
  });
  return apiClient.get<CompetitorDetails>(`/vault/competitors/${params.id}?${queryParams}`);
};

export const deleteCompetitor = async (competitorId: string, companyId: string): Promise<void> => {
  return apiClient.delete<void>(`/vault/competitors/${competitorId}`, { companyId });
};

// Data Chamber
export const fetchDataChamberSettings = async (companyId: string): Promise<DataChamberSettings> => {
  const queryParams = new URLSearchParams({ companyId });
  return apiClient.get<DataChamberSettings>(`/data-chamber/settings?${queryParams}`);
};

export const updateDataChamberSettings = async (
  companyId: string,
  settings: UpdateDataChamberSettings
): Promise<DataChamberSettings> => {
  const queryParams = new URLSearchParams({ companyId });
  return apiClient.put<DataChamberSettings>(`/data-chamber/settings?${queryParams}`, settings);
};

export const syncLinkedInProfile = async (
  companyId: string,
  url: string,
  type: 'profile' | 'company'
): Promise<{ profilePictureUrl?: string; name?: string; followers?: number }> => {
  return apiClient.post<{ profilePictureUrl?: string; name?: string; followers?: number }>(
    '/data-chamber/sync-linkedin',
    { companyId, url, type }
  );
};

export const fetchDataHealth = async (companyId: string): Promise<DataHealthResult> => {
  const queryParams = new URLSearchParams({ companyId });
  return apiClient.get<DataHealthResult>(`/data-chamber/health?${queryParams}`);
};

// Blueprints
export const saveBlueprint = async (params: CreateBlueprintParams): Promise<Blueprint> => {
  return apiClient.post<Blueprint>('/blueprints', params);
};

export interface FetchBlueprintsParams {
  companyId: string;
  platform?: string;
  actionType?: string;
  sortBy?: 'createdAt' | 'vanturaScore' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface FetchBlueprintsResponse {
  blueprints: Blueprint[];
  total: number;
  limit: number;
  offset: number;
}

export const fetchBlueprints = async (params: FetchBlueprintsParams): Promise<FetchBlueprintsResponse> => {
  const queryParams = new URLSearchParams({ companyId: params.companyId });
  if (params.platform) queryParams.append('platform', params.platform);
  if (params.actionType) queryParams.append('actionType', params.actionType);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());

  return apiClient.get<FetchBlueprintsResponse>(`/blueprints?${queryParams}`);
};

export const fetchBlueprintById = async (id: string, companyId: string): Promise<Blueprint> => {
  const queryParams = new URLSearchParams({ companyId });
  return apiClient.get<Blueprint>(`/blueprints/${id}?${queryParams}`);
};

export const updateBlueprintTitle = async (id: string, companyId: string, title: string): Promise<Blueprint> => {
  return apiClient.patch<Blueprint>(`/blueprints/${id}`, { companyId, title });
};

export const deleteBlueprint = async (id: string, companyId: string): Promise<{ message: string }> => {
  const queryParams = new URLSearchParams({ companyId });
  return apiClient.delete<{ message: string }>(`/blueprints/${id}?${queryParams}`);
};
