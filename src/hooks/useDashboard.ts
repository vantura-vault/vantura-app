import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface DashboardData {
  company: {
    id: string;
    name: string;
    industry: string | null;
    description: string | null;
  };
  overview: {
    totalFollowers: number;
    totalFollowerGrowth: {
      absolute: number;
      percentage: number;
    };
    avgEngagement: {
      rate: number;
      growth: number;
    };
    totalPosts: number;
    postsThisWeek: number;
    platformCount: number;
    averageGrowthRate: number;
    fastestGrowingPlatform: string | null;
    competitorsTracked: number;
  };
  platforms: any[];
  insights: any[];
  recentActivity: any[];
}

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.get<DashboardData>('/dashboard/me'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
