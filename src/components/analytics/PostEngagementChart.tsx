import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import styles from './PostEngagementChart.module.css';

interface DataPoint {
  date: string;
  likes: number;
  comments: number;
}

interface PostEngagementChartProps {
  data: DataPoint[];
  title: string;
}

export function PostEngagementChart({ data, title }: PostEngagementChartProps) {
  return (
    <Card>
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
              <XAxis
                dataKey="date"
                stroke="var(--color-text-muted)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="var(--color-text-muted)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-metallic)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                }}
                labelStyle={{ color: 'var(--color-text-secondary)' }}
              />
              <Legend
                wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}
              />
              <Bar dataKey="likes" fill="var(--color-accent-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
