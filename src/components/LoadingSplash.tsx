import { useEffect, useState, useMemo } from 'react';
import loadingGif from '../assets/vantura-loading.gif';
import loginBg from '../assets/dashboard-bg.png';
import styles from './LoadingSplash.module.css';

const LOADING_MESSAGES = [
  'Obtaining your unfair advantage',
  'Seeking alpha',
  'Finding the secret formula',
];

interface LoadingSplashProps {
  onComplete: () => void;
  prefetchFn: () => Promise<void>;
}

export function LoadingSplash({ onComplete, prefetchFn }: LoadingSplashProps) {
  const [progress, setProgress] = useState(0);

  // Pick a random message once on mount
  const loadingMessage = useMemo(
    () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
    []
  );

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
          setProgress(100);
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
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className={styles.content}>
        <img src={loadingGif} alt="Loading..." className={styles.loadingGif} />

        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className={styles.loadingText}>{loadingMessage}</p>
      </div>
    </div>
  );
}
