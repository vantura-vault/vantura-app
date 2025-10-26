import { useAuthStore } from '../store/authStore';

/**
 * Hook to get the current user's company ID
 * Falls back to demo company if user is not authenticated or has no company
 */
export function useCompanyId(): string {
  const user = useAuthStore((state) => state.user);

  // Return user's company ID if available, otherwise demo company
  return user?.companyId || 'demo-company-1';
}
