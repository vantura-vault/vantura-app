import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCompanyFiles,
  uploadCompanyFiles,
  deleteCompanyFile,
  type CompanyFile,
} from '../api/endpoints';

// Fetch all files for a company
export const useFiles = (companyId: string | undefined) => {
  return useQuery({
    queryKey: ['files', companyId],
    queryFn: () => fetchCompanyFiles(companyId!),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Upload files mutation
export const useUploadFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, files }: { companyId: string; files: File[] }) =>
      uploadCompanyFiles(companyId, files),
    onSuccess: (_, variables) => {
      // Invalidate files list to refetch
      queryClient.invalidateQueries({ queryKey: ['files', variables.companyId] });
    },
  });
};

// Delete file mutation
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId }: { fileId: string; companyId: string }) =>
      deleteCompanyFile(fileId),
    onSuccess: (_, variables) => {
      // Invalidate files list to refetch
      queryClient.invalidateQueries({ queryKey: ['files', variables.companyId] });
    },
  });
};

// Re-export type for convenience
export type { CompanyFile };
