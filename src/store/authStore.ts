import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '../providers/QueryProvider';

interface User {
  id: string;
  name: string;
  email: string;
  companyId?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
        // Clear all React Query cache to prevent showing old user's data
        queryClient.clear();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        // After rehydrating from localStorage, set isAuthenticated based on whether we have a token
        if (state && state.token && state.user) {
          state.isAuthenticated = true;
        }
      },
    }
  )
);
