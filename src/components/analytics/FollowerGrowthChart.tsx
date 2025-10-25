import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import styles from './FollowerGrowthChart.module.css';

interface DataPoint {
  date: string;
  followers: number;
}

interface FollowerGrowthChartProps {
  data: DataPoint[];
  title: string;
}

export function FollowerGrowthChart({ data, title }: FollowerGrowthChartProps) {
  return (
    <Card>
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Line
                type="monotone"
                dataKey="followers"
                stroke="var(--color-accent-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent-primary)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
