import type { ReactNode } from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'trending' | 'optimal' | 'opportunity' | 'high-impact' | 'timing-critical' | 'competitive-edge' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'optimal', className = '' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
