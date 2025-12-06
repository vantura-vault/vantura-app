import { useRef, useCallback, type ReactNode } from 'react';
import { useWebSocket, type ScrapeScheduledPayload, type ScrapeStartedPayload, type ScrapeProgressPayload, type ScrapeCompletedPayload, type ScrapeFailedPayload } from '../hooks/useWebSocket';
import { toast } from '../store/toastStore';

interface WebSocketProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages WebSocket connection and shows toast notifications
 * for scrape events. Add this component near the root of your authenticated app.
 */
export function WebSocketProvider({ children }: WebSocketProviderProps) {
  // Track toast IDs for progress updates
  const scrapeToastsRef = useRef<Map<string, string>>(new Map());

  const handleScrapeScheduled = useCallback((payload: ScrapeScheduledPayload) => {
    toast.info(
      `Posts scrape scheduled`,
      `Fetching posts for ${payload.targetName} in ${payload.delaySeconds}s...`
    );
  }, []);

  const handleScrapeStarted = useCallback((payload: ScrapeStartedPayload) => {
    const toastId = toast.progress(`Scraping ${payload.targetName}`, 0);
    scrapeToastsRef.current.set(payload.jobId, toastId);
  }, []);

  const handleScrapeProgress = useCallback((payload: ScrapeProgressPayload) => {
    const toastId = scrapeToastsRef.current.get(payload.jobId);
    if (toastId) {
      toast.update(toastId, {
        title: payload.message,
        progress: payload.progress,
      });
    }
  }, []);

  const handleScrapeCompleted = useCallback((payload: ScrapeCompletedPayload) => {
    const toastId = scrapeToastsRef.current.get(payload.jobId);
    if (toastId) {
      toast.remove(toastId);
      scrapeToastsRef.current.delete(payload.jobId);
    }
    toast.success(
      'Scrape completed',
      `Successfully imported ${payload.postsScraped} posts`
    );
  }, []);

  const handleScrapeFailed = useCallback((payload: ScrapeFailedPayload) => {
    const toastId = scrapeToastsRef.current.get(payload.jobId);
    if (toastId) {
      toast.remove(toastId);
      scrapeToastsRef.current.delete(payload.jobId);
    }
    toast.error('Scrape failed', payload.error);
  }, []);

  // Initialize WebSocket connection with event handlers
  useWebSocket({
    onScrapeScheduled: handleScrapeScheduled,
    onScrapeStarted: handleScrapeStarted,
    onScrapeProgress: handleScrapeProgress,
    onScrapeCompleted: handleScrapeCompleted,
    onScrapeFailed: handleScrapeFailed,
  });

  return <>{children}</>;
}
