import { useEffect, useState } from 'react';
import vanturaLogo from '../assets/vantura-logo.svg';
import styles from './LoadingSplash.module.css';

interface LoadingSplashProps {
  onComplete: () => void;
  prefetchFn: () => Promise<void>;
}

export function LoadingSplash({ onComplete, prefetchFn }: LoadingSplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // Animate progress bar while prefetching
    const progressInterval = setInterval(() => {
      if (isMounted) {
        setProgress((prev) => {
          // Slow down as we approach 90% (wait for actual completion)
          if (prev < 90) {
            return prev + Math.random() * 15;
          }
          return prev;
        });
      }
    }, 200);

    // Start prefetching
    prefetchFn()
      .then(() => {
        if (isMounted) {
          // Complete the progress bar
          setProgress(100);
          // Small delay for visual feedback before transitioning
          setTimeout(() => {
            if (isMounted) {
              onComplete();
            }
          }, 300);
        }
      })
      .catch((err) => {
        console.error('Prefetch failed:', err);
        // Still complete even on error - data will load on demand
        if (isMounted) {
          setProgress(100);
          setTimeout(() => {
            if (isMounted) {
              onComplete();
            }
          }, 300);
        }
      });

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
    };
  }, [prefetchFn, onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={vanturaLogo} alt="Vantura" className={styles.logo} />

        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className={styles.loadingText}>Loading your dashboard...</p>
      </div>
    </div>
  );
}
