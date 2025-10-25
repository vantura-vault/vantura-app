import { useQuery } from '@tanstack/react-query';
import { fetchRecommendations } from '../api/endpoints';

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000, // Auto-refetch every 10 minutes
  });
};
