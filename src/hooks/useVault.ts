import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchCompetitors,
  addCompetitor,
  fetchCompetitorDetails,
  deleteCompetitor,
  refreshAllCompetitors,
  type RefreshAllCompetitorsResult,
} from '../api/endpoints';
import { toast } from '../store/toastStore';
import type {
  CompetitorsListParams,
  CompetitorsListData,
  AddCompetitorParams,
  AddCompetitorData,
  CompetitorDetailsParams,
  CompetitorDetails,
} from '../types/vault';

/**
 * Hook to fetch all competitors for a company
 * @param params - Query parameters including companyId
 * @param options - React Query options
 */
export const useCompetitors = (
  params: CompetitorsListParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<CompetitorsListData, Error>({
    queryKey: ['vault', 'competitors', params.companyId],
    queryFn: async () => {
      console.log('%c[useCompetitors] 📥 Fetching competitors...', 'color: #00aaff');
      const data = await fetchCompetitors(params);
      console.log('%c[useCompetitors] ✅ Received competitors:', 'color: #00ff00', {
        count: data.items?.length || 0,
        items: data.items?.map((c: any) => ({ id: c.id, name: c.name, followers: c.totalFollowers })),
      });
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled !== false,
  });
};

/**
 * Hook to fetch details for a single competitor
 * @param params - Query parameters including competitor id
 * @param options - React Query options
 */
export const useCompetitorDetails = (
  params: CompetitorDetailsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<CompetitorDetails, Error>({
    queryKey: ['vault', 'competitor', params.id, params.companyId],
    queryFn: async () => {
      console.log('%c[useCompetitorDetails] 📥 Fetching competitor details...', 'color: #00aaff', { id: params.id });
      const data = await fetchCompetitorDetails(params);
      console.log('%c[useCompetitorDetails] ✅ Received details:', 'color: #00ff00', {
        name: data.name,
        platforms: data.platforms?.length || 0,
        posts: data.posts?.length || 0,
        postsPreview: data.posts?.slice(0, 3).map((p: any) => ({
          id: p.id,
          likes: p.likes,
          engagement: p.engagement,
        })),
      });
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled !== false,
  });
};

/**
 * Hook to manually add a competitor
 * @returns Mutation result with invalidation on success
 */
export const useAddCompetitor = () => {
  const queryClient = useQueryClient();

  return useMutation<AddCompetitorData, Error, AddCompetitorParams>({
    mutationFn: (params: AddCompetitorParams) => addCompetitor(params),
    onSuccess: (_, variables) => {
      // Invalidate competitors list to refetch
      queryClient.invalidateQueries({
        queryKey: ['vault', 'competitors', variables.companyId],
      });
    },
  });
};

/**
 * Hook to delete a competitor
 * @returns Mutation result with cache updates on success
 */
export const useDeleteCompetitor = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { competitorId: string; companyId: string }>({
    mutationFn: ({ competitorId, companyId }) => deleteCompetitor(competitorId, companyId),
    onSuccess: (_, variables) => {
      const queryKey = ['vault', 'competitors', variables.companyId];

      // Update the cache directly to remove the deleted competitor
      queryClient.setQueryData<CompetitorsListData>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          items: oldData.items.filter((item: any) => item.id !== variables.competitorId),
        };
      });

      // Also invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey,
        refetchType: 'active',
      });
    },
  });
};

/**
 * Hook to refresh all competitors (scrape for new posts)
 * @returns Mutation result with toast notifications
 */
export const useRefreshAllCompetitors = () => {
  const queryClient = useQueryClient();

  return useMutation<RefreshAllCompetitorsResult, Error, string>({
    mutationFn: (companyId: string) => refreshAllCompetitors(companyId),
    onSuccess: (data, companyId) => {
      if (data.inProgress) {
        toast.info('A scrape is already in progress. Please wait.');
      } else if (data.queued > 0) {
        toast.success(`Refreshing ${data.queued} competitor${data.queued > 1 ? 's' : ''}...`);
        if (data.skipped > 0) {
          toast.info(`${data.skipped} competitor${data.skipped > 1 ? 's' : ''} skipped (refreshed within last hour)`);
        }
      } else {
        toast.info('All competitors were refreshed recently. Try again in an hour.');
      }

      // Invalidate competitors list to refetch when scrapes complete
      queryClient.invalidateQueries({
        queryKey: ['vault', 'competitors', companyId],
      });
    },
    onError: () => {
      toast.error('Failed to refresh competitors');
    },
  });
};
