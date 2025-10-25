import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchCompetitors,
  addCompetitor,
  addCompetitorViaBrightData,
  fetchCompetitorDetails,
} from '../api/endpoints';
import type {
  CompetitorsListParams,
  CompetitorsListData,
  AddCompetitorParams,
  AddCompetitorData,
  BrightDataCompetitorParams,
  CompetitorDetailsParams,
  CompetitorCard,
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
    queryFn: () => fetchCompetitors(params),
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
  return useQuery<CompetitorCard, Error>({
    queryKey: ['vault', 'competitor', params.id],
    queryFn: () => fetchCompetitorDetails(params),
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
 * Hook to add a competitor via BrightData webhook
 * @returns Mutation result with invalidation on success
 */
export const useAddCompetitorViaBrightData = () => {
  const queryClient = useQueryClient();

  return useMutation<AddCompetitorData, Error, BrightDataCompetitorParams>({
    mutationFn: (params: BrightDataCompetitorParams) =>
      addCompetitorViaBrightData(params),
    onSuccess: (_, variables) => {
      // Invalidate competitors list to refetch
      queryClient.invalidateQueries({
        queryKey: ['vault', 'competitors', variables.companyId],
      });
    },
  });
};
