import { useQuery } from '@tanstack/react-query';
import { fetchHistoricalMetrics, fetchRecentPosts } from '../api/endpoints';
import type {
  HistoricalMetricsParams,
  HistoricalMetricsData,
  RecentPostsParams,
  RecentPostsData,
} from '../types/analytics';

/**
 * Hook to fetch historical metrics with time-series data
 * @param params - Query parameters including companyId, platform, range, and moving average window
 * @param options - React Query options
 */
export const useHistoricalMetrics = (
  params: HistoricalMetricsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<HistoricalMetricsData, Error>({
    queryKey: ['analytics', 'historical', params],
    queryFn: () => fetchHistoricalMetrics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  });
};

/**
 * Hook to fetch recent post performance data
 * @param params - Query parameters including companyId, platform, and limit
 * @param options - React Query options
 */
export const useRecentPosts = (
  params: RecentPostsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<RecentPostsData, Error>({
    queryKey: ['analytics', 'recent', params],
    queryFn: () => fetchRecentPosts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: options?.enabled !== false,
  });
};
