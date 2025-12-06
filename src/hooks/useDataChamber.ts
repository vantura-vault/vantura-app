import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchDataChamberSettings,
  updateDataChamberSettings,
  fetchDataHealth,
} from '../api/endpoints';
import type { UpdateDataChamberSettings } from '../types/dataChamber';

/**
 * Hook to fetch data chamber settings for a company
 */
export const useDataChamberSettings = (companyId: string | null | undefined) => {
  return useQuery({
    queryKey: ['dataChamber', 'settings', companyId],
    queryFn: () => fetchDataChamberSettings(companyId!),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update data chamber settings
 */
export const useUpdateDataChamberSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      settings,
    }: {
      companyId: string;
      settings: UpdateDataChamberSettings;
    }) => updateDataChamberSettings(companyId, settings),
    onMutate: async ({ companyId, settings }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['dataChamber', 'settings', companyId],
      });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData(['dataChamber', 'settings', companyId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['dataChamber', 'settings', companyId], (old: any) => {
        if (!old) return settings;
        return { ...old, ...settings };
      });

      // Return a context object with the snapshotted value
      return { previousSettings };
    },
    onError: (_err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSettings) {
        queryClient.setQueryData(
          ['dataChamber', 'settings', variables.companyId],
          context.previousSettings
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({
        queryKey: ['dataChamber', 'settings', variables.companyId],
      });
      // Also invalidate data health since settings affect it
      queryClient.invalidateQueries({
        queryKey: ['dataChamber', 'health', variables.companyId],
      });
    },
  });
};

/**
 * Hook to fetch data health score and breakdown
 */
export const useDataHealth = (companyId: string | null | undefined) => {
  return useQuery({
    queryKey: ['dataChamber', 'health', companyId],
    queryFn: () => fetchDataHealth(companyId!),
    enabled: !!companyId,
    staleTime: 2 * 60 * 1000, // 2 minutes - refresh more often as data changes
  });
};
