import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

/**
 * WebSocket event payloads
 */
export interface ScrapeScheduledPayload {
  jobId: string;
  targetId: string;
  targetName: string;
  delaySeconds: number;
}

export interface ScrapeStartedPayload {
  jobId: string;
  targetId: string;
  targetName: string;
}

export interface ScrapeProgressPayload {
  jobId: string;
  progress: number;
  message: string;
}

export interface ScrapeCompletedPayload {
  jobId: string;
  targetId: string;
  postsScraped: number;
}

export interface ScrapeFailedPayload {
  jobId: string;
  targetId: string;
  error: string;
}

// Competitor sync events
export interface CompetitorAddedPayload {
  competitorId: string;
  name: string;
  syncing: boolean;
}

export interface CompetitorProfileReadyPayload {
  competitorId: string;
  name: string;
  profilePictureUrl: string | null;
  followers: number;
}

export interface CompetitorSyncFailedPayload {
  competitorId: string;
  name: string;
  error: string;
}

type ScrapeEventCallback<T> = (payload: T) => void;

interface UseWebSocketOptions {
  onScrapeScheduled?: ScrapeEventCallback<ScrapeScheduledPayload>;
  onScrapeStarted?: ScrapeEventCallback<ScrapeStartedPayload>;
  onScrapeProgress?: ScrapeEventCallback<ScrapeProgressPayload>;
  onScrapeCompleted?: ScrapeEventCallback<ScrapeCompletedPayload>;
  onScrapeFailed?: ScrapeEventCallback<ScrapeFailedPayload>;
  onCompetitorAdded?: ScrapeEventCallback<CompetitorAddedPayload>;
  onCompetitorProfileReady?: ScrapeEventCallback<CompetitorProfileReadyPayload>;
  onCompetitorSyncFailed?: ScrapeEventCallback<CompetitorSyncFailedPayload>;
}

/**
 * Hook to connect to the WebSocket server and listen for scrape events
 * Automatically connects when authenticated and disconnects on unmount
 */
export function useWebSocket(options: UseWebSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { token, user } = useAuthStore();
  const companyId = user?.companyId;

  // Store callbacks in refs to avoid reconnection on callback changes
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const connect = useCallback(() => {
    if (!token || !companyId) {
      console.log('[WebSocket] Missing token or companyId, skipping connection');
      return;
    }

    if (socketRef.current?.connected) {
      console.log('[WebSocket] Already connected');
      return;
    }

    // Get base URL from environment, strip /api suffix if present
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiUrl.replace(/\/api$/, '');

    console.log(`[WebSocket] Connecting to ${baseUrl}`);

    const socket = io(baseUrl, {
      auth: { token, companyId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('%c[WebSocket] ✅ Connected', 'color: #00ff00; font-weight: bold', {
        socketId: socket.id,
        companyId,
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('%c[WebSocket] ❌ Disconnected', 'color: #ff0000; font-weight: bold', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('%c[WebSocket] ⚠️ Connection error', 'color: #ff6600; font-weight: bold', error.message);
    });

    // Scrape events
    socket.on('scrape:scheduled', (payload: ScrapeScheduledPayload) => {
      console.log('%c[WebSocket] 📅 Scrape SCHEDULED', 'color: #9966ff; font-weight: bold', {
        jobId: payload.jobId,
        targetId: payload.targetId,
        targetName: payload.targetName,
        delaySeconds: payload.delaySeconds,
      });
      optionsRef.current.onScrapeScheduled?.(payload);
    });

    socket.on('scrape:started', (payload: ScrapeStartedPayload) => {
      console.log('%c[WebSocket] 🚀 Scrape STARTED', 'color: #00aaff; font-weight: bold', {
        jobId: payload.jobId,
        targetId: payload.targetId,
        targetName: payload.targetName,
      });
      optionsRef.current.onScrapeStarted?.(payload);
    });

    socket.on('scrape:progress', (payload: ScrapeProgressPayload) => {
      console.log('%c[WebSocket] ⏳ Scrape PROGRESS', 'color: #ffaa00; font-weight: bold', {
        jobId: payload.jobId,
        progress: `${payload.progress}%`,
        message: payload.message,
      });
      optionsRef.current.onScrapeProgress?.(payload);
    });

    socket.on('scrape:completed', (payload: ScrapeCompletedPayload) => {
      console.log('%c[WebSocket] ✅ Scrape COMPLETED', 'color: #00ff00; font-weight: bold', {
        jobId: payload.jobId,
        targetId: payload.targetId,
        postsScraped: payload.postsScraped,
      });
      optionsRef.current.onScrapeCompleted?.(payload);

      // Invalidate vault queries to refresh competitor data
      console.log('[WebSocket] Invalidating queries for:', {
        competitorsList: ['vault', 'competitors', companyId],
        competitorDetail: ['vault', 'competitor', payload.targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ['vault', 'competitors', companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ['vault', 'competitor', payload.targetId],
      });
      console.log('[WebSocket] Queries invalidated - UI should refresh');
    });

    socket.on('scrape:failed', (payload: ScrapeFailedPayload) => {
      console.error('%c[WebSocket] ❌ Scrape FAILED', 'color: #ff0000; font-weight: bold', {
        jobId: payload.jobId,
        targetId: payload.targetId,
        error: payload.error,
      });
      optionsRef.current.onScrapeFailed?.(payload);
    });

    // Competitor sync events
    socket.on('competitor:added', (payload: CompetitorAddedPayload) => {
      console.log('%c[WebSocket] ➕ Competitor ADDED', 'color: #00ffaa; font-weight: bold', {
        competitorId: payload.competitorId,
        name: payload.name,
        syncing: payload.syncing,
      });
      optionsRef.current.onCompetitorAdded?.(payload);
    });

    socket.on('competitor:profileReady', (payload: CompetitorProfileReadyPayload) => {
      console.log('%c[WebSocket] 👤 Competitor PROFILE READY', 'color: #00ff00; font-weight: bold', {
        competitorId: payload.competitorId,
        name: payload.name,
        followers: payload.followers,
        hasAvatar: !!payload.profilePictureUrl,
      });
      optionsRef.current.onCompetitorProfileReady?.(payload);

      // Invalidate competitors list to show updated profile/followers
      console.log('[WebSocket] Invalidating competitors query for profile update');
      queryClient.invalidateQueries({
        queryKey: ['vault', 'competitors', companyId],
      });
    });

    socket.on('competitor:syncFailed', (payload: CompetitorSyncFailedPayload) => {
      console.error('%c[WebSocket] ⚠️ Competitor SYNC FAILED', 'color: #ff6600; font-weight: bold', {
        competitorId: payload.competitorId,
        name: payload.name,
        error: payload.error,
      });
      optionsRef.current.onCompetitorSyncFailed?.(payload);
    });

    socketRef.current = socket;
  }, [token, companyId, queryClient]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('[WebSocket] Disconnecting');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
    connect,
    disconnect,
  };
}

/**
 * Hook to track active scrape jobs
 * Use this in components that need to show scrape progress
 */
export function useScrapeJobTracking() {
  const { user } = useAuthStore();
  const companyId = user?.companyId;

  // Store active jobs in state (could be enhanced with Zustand if needed)
  const activeJobs = useRef<Map<string, ScrapeProgressPayload>>(new Map());

  const handleScrapeStarted = useCallback((payload: ScrapeStartedPayload) => {
    activeJobs.current.set(payload.jobId, {
      jobId: payload.jobId,
      progress: 0,
      message: `Starting scrape for ${payload.targetName}...`,
    });
  }, []);

  const handleScrapeProgress = useCallback((payload: ScrapeProgressPayload) => {
    activeJobs.current.set(payload.jobId, payload);
  }, []);

  const handleScrapeCompleted = useCallback((payload: ScrapeCompletedPayload) => {
    activeJobs.current.delete(payload.jobId);
  }, []);

  const handleScrapeFailed = useCallback((payload: ScrapeFailedPayload) => {
    activeJobs.current.delete(payload.jobId);
  }, []);

  useWebSocket({
    onScrapeStarted: handleScrapeStarted,
    onScrapeProgress: handleScrapeProgress,
    onScrapeCompleted: handleScrapeCompleted,
    onScrapeFailed: handleScrapeFailed,
  });

  return {
    activeJobs: activeJobs.current,
    companyId,
  };
}
