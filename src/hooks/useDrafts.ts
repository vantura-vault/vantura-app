import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createDraft,
  fetchDrafts,
  fetchDraft,
  fetchDraftByBlueprint,
  updateDraft,
  deleteDraft,
} from '../api/endpoints';
import type { CreateDraftParams, UpdateDraftParams } from '../types/draft';

// Fetch all drafts for the user's company
export const useDrafts = () => {
  return useQuery({
    queryKey: ['drafts'],
    queryFn: fetchDrafts,
    staleTime: 30 * 1000, // 30 seconds (drafts change frequently)
  });
};

// Fetch single draft by ID
export const useDraft = (id: string) => {
  return useQuery({
    queryKey: ['draft', id],
    queryFn: () => fetchDraft(id),
    enabled: !!id,
    staleTime: 10 * 1000, // 10 seconds
  });
};

// Fetch draft by blueprint ID (for resuming wizard)
export const useDraftByBlueprint = (blueprintId: string) => {
  return useQuery({
    queryKey: ['draft', 'by-blueprint', blueprintId],
    queryFn: () => fetchDraftByBlueprint(blueprintId),
    enabled: !!blueprintId,
    staleTime: 10 * 1000,
  });
};

// Create a new draft
export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateDraftParams) => createDraft(params),
    onSuccess: (data) => {
      // Add the new draft to the cache
      queryClient.setQueryData(['draft', data.id], data);
      // Invalidate drafts list
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });
};

// Update a draft (auto-save)
export const useUpdateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...params }: { id: string } & UpdateDraftParams) =>
      updateDraft(id, params),
    onSuccess: (data) => {
      // Update the draft in cache
      queryClient.setQueryData(['draft', data.id], data);
      // Also update in drafts list if it exists
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });
};

// Delete a draft
export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDraft(id),
    onSuccess: (_data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['draft', id] });
      // Invalidate drafts list
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });
};
