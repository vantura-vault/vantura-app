import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminCompanies,
  fetchApiUsage,
  fetchBillingData,
  deactivateUser,
  resetUserPassword,
} from '../api/endpoints';

// Stats hook
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchAdminStats,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Users hook
export const useAdminUsers = (params?: {
  limit?: number;
  offset?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => fetchAdminUsers(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Companies hook
export const useAdminCompanies = (params?: {
  limit?: number;
  offset?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'companies', params],
    queryFn: () => fetchAdminCompanies(params),
    staleTime: 30 * 1000,
  });
};

// API Usage hook
export const useApiUsage = (range?: '24h' | '7d' | '30d') => {
  return useQuery({
    queryKey: ['admin', 'api-usage', range],
    queryFn: () => fetchApiUsage(range),
    staleTime: 60 * 1000,
  });
};

// Billing hook
export const useBilling = () => {
  return useQuery({
    queryKey: ['admin', 'billing'],
    queryFn: fetchBillingData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Deactivate user mutation
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetUserPassword,
  });
};
