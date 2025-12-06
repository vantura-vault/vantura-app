import { queryClient } from '../providers/QueryProvider';
import {
  fetchHistoricalMetrics,
  fetchRecentPosts,
  fetchAnalyticsSummary,
  fetchCompetitors,
} from '../api/endpoints';
import { apiClient } from '../api/client';

interface PrefetchDataParams {
  companyId: string;
}

/**
 * Prefetch all data needed for the application on login
 * This ensures instant page loads when navigating between pages
 */
export async function prefetchAllData({ companyId }: PrefetchDataParams) {
  const prefetchPromises: Promise<void>[] = [];

  // Dashboard data
  prefetchPromises.push(
    queryClient.prefetchQuery({
      queryKey: ['dashboard'],
      queryFn: () => apiClient.get('/dashboard/me'),
      staleTime: 5 * 60 * 1000,
    })
  );

  // Analytics: Historical metrics for common timeframes
  const timeframes = ['1M', '6M', '1Y'] as const;
  const comparisonModes = ['none', 'top'] as const;

  timeframes.forEach((range) => {
    comparisonModes.forEach((comparisonMode) => {
      prefetchPromises.push(
        queryClient.prefetchQuery({
          queryKey: [
            'analytics',
            'historical',
            {
              companyId,
              platform: 'LinkedIn',
              range,
              ma: 7,
              comparisonMode,
            },
          ],
          queryFn: () =>
            fetchHistoricalMetrics({
              companyId,
              platform: 'LinkedIn',
              range,
              ma: 7,
              comparisonMode,
            }),
          staleTime: 5 * 60 * 1000,
        })
      );
    });
  });

  // Analytics: Summary metrics for common timeframes
  timeframes.forEach((range) => {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ['analytics', 'summary', { companyId, range }],
        queryFn: () => fetchAnalyticsSummary({ companyId, range }),
        staleTime: 5 * 60 * 1000,
      })
    );
  });

  // Analytics: Recent posts
  prefetchPromises.push(
    queryClient.prefetchQuery({
      queryKey: ['analytics', 'recent', { companyId, limit: 10 }],
      queryFn: () => fetchRecentPosts({ companyId, limit: 10 }),
      staleTime: 2 * 60 * 1000,
    })
  );

  // Competitor Vault
  prefetchPromises.push(
    queryClient.prefetchQuery({
      queryKey: ['vault', 'competitors', companyId],
      queryFn: () => fetchCompetitors({ companyId }),
      staleTime: 10 * 60 * 1000,
    })
  );

  // Execute all prefetch operations in parallel
  await Promise.allSettled(prefetchPromises);
}
