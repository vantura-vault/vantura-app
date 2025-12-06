import { Card } from '../shared/Card';
import styles from './ActivityTimeline.module.css';

interface Activity {
  id: string;
  type: 'sync' | 'edit' | 'upload' | 'other';
  message: string;
  timestamp: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card className={styles.activityTimeline}>
      <h2 className={styles.title}>Activity Timeline</h2>
      <div className={styles.timeline}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityDot} />
            <div className={styles.activityContent}>
              <div className={styles.activityMessage}>{activity.message}</div>
              <div className={styles.activityTimestamp}>{activity.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
