import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  saveBlueprint,
  fetchBlueprints,
  fetchBlueprintById,
  updateBlueprintTitle,
  deleteBlueprint,
  type FetchBlueprintsParams,
} from '../api/endpoints';
import type { CreateBlueprintParams } from '../types/blueprint';

// Fetch all blueprints
export const useBlueprints = (params: FetchBlueprintsParams) => {
  return useQuery({
    queryKey: ['blueprints', params],
    queryFn: () => fetchBlueprints(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch single blueprint by ID
export const useBlueprint = (id: string, companyId: string) => {
  return useQuery({
    queryKey: ['blueprint', id],
    queryFn: () => fetchBlueprintById(id, companyId),
    enabled: !!id && !!companyId,
    staleTime: 5 * 60 * 1000,
  });
};

// Save a new blueprint
export const useSaveBlueprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateBlueprintParams) => saveBlueprint(params),
    onSuccess: () => {
      // Invalidate blueprints list to refetch
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
    },
  });
};

// Update blueprint title
export const useUpdateBlueprintTitle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, companyId, title }: { id: string; companyId: string; title: string }) =>
      updateBlueprintTitle(id, companyId, title),
    onSuccess: (data) => {
      // Invalidate the specific blueprint and the list
      queryClient.invalidateQueries({ queryKey: ['blueprint', data.id] });
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
    },
  });
};

// Delete a blueprint
export const useDeleteBlueprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, companyId }: { id: string; companyId: string }) =>
      deleteBlueprint(id, companyId),
    onSuccess: () => {
      // Invalidate blueprints list to refetch
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
    },
  });
};
