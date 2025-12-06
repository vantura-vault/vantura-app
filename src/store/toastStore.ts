import { create } from 'zustand';

export type ToastType = 'info' | 'success' | 'error' | 'progress';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  progress?: number; // 0-100 for progress toasts
  duration?: number; // Auto-dismiss duration in ms (0 = manual dismiss)
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  updateToast: (id: string, updates: Partial<Omit<Toast, 'id'>>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastIdCounter = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${++toastIdCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto-dismiss if duration is set and not a progress toast
    if (toast.duration && toast.duration > 0 && toast.type !== 'progress') {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration);
    }

    return id;
  },

  updateToast: (id, updates) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

/**
 * Helper functions for common toast operations
 */
export const toast = {
  info: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'info', title, message, duration: 5000 }),

  success: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'success', title, message, duration: 5000 }),

  error: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'error', title, message, duration: 8000 }),

  progress: (title: string, progress: number = 0) =>
    useToastStore.getState().addToast({ type: 'progress', title, progress, duration: 0 }),

  update: (id: string, updates: Partial<Omit<Toast, 'id'>>) =>
    useToastStore.getState().updateToast(id, updates),

  remove: (id: string) =>
    useToastStore.getState().removeToast(id),
};
