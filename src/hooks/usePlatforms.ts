import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPlatforms, connectPlatform, disconnectPlatform } from '../api/endpoints';

export const usePlatforms = () => {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: fetchPlatforms,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useConnectPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ platformName, authCode }: { platformName: string; authCode: string }) =>
      connectPlatform(platformName, authCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });
};

export const useDisconnectPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (platformId: string) => disconnectPlatform(platformId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });
};
