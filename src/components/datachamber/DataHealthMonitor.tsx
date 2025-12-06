import { CheckCircle2, Circle, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../shared/Card';
import { useDataHealth } from '../../hooks';
import styles from './DataHealthMonitor.module.css';

interface DataHealthMonitorProps {
  companyId: string | undefined;
}

export function DataHealthMonitor({ companyId }: DataHealthMonitorProps) {
  const { data: health, isLoading } = useDataHealth(companyId);

  const score = health?.score ?? 0;
  const status = health?.status ?? 'needs_attention';
  const components = health?.components ?? [];

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const statusColors = {
    excellent: 'var(--color-success)',
    good: 'var(--color-success)',
    fair: '#f59e0b',
    needs_attention: '#ef4444',
  };

  const statusLabels = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    needs_attention: 'Needs Attention',
  };

  const progressColor = statusColors[status];

  if (isLoading) {
    return (
      <Card className={styles.dataHealthMonitor}>
        <h2 className={styles.title}>Data Health Monitor</h2>
        <div className={styles.loadingContainer}>
          <Loader2 size={32} className={styles.spinner} />
          <span className={styles.loadingText}>Analyzing data health...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={styles.dataHealthMonitor}>
      <h2 className={styles.title}>Data Health Monitor</h2>

      <div className={styles.progressContainer}>
        <svg className={styles.progressRing} width="200" height="200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--color-bg-tertiary)"
            strokeWidth="20"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={styles.progressCircle}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className={styles.progressText}>
          <div className={styles.percentage}>{score}%</div>
          <div className={styles.label}>{statusLabels[status]}</div>
        </div>
      </div>

      <div className={styles.componentsSection}>
        <div className={styles.componentsList}>
          {components.map((component) => (
            <div key={component.name} className={styles.componentItem}>
              <div className={styles.componentHeader}>
                {component.complete ? (
                  <CheckCircle2 size={16} className={styles.iconComplete} />
                ) : (
                  <Circle size={16} className={styles.iconIncomplete} />
                )}
                <span className={styles.componentName}>{component.name}</span>
                <span className={styles.componentWeight}>{component.weight}%</span>
              </div>
              {component.details && (
                <div className={styles.componentDetails}>
                  <AlertCircle size={12} />
                  <span>{component.details}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
