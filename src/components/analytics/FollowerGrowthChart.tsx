import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../shared/Card';
import styles from './FollowerGrowthChart.module.css';

interface DataPoint {
  date: string;
  followers: number;
  competitor?: number;
}

interface FollowerGrowthChartProps {
  data: DataPoint[];
  title: string;
  showCompetitor?: boolean;
}

export function FollowerGrowthChart({ data, showCompetitor = false }: FollowerGrowthChartProps) {
  const chartData = data;

  return (
    <Card>
      <div className={styles.container}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--color-text-muted)"
                style={{ fontSize: '13px', fontWeight: 400 }}
                tickLine={false}
              />
              <YAxis
                stroke="var(--color-text-muted)"
                style={{ fontSize: '13px', fontWeight: 400 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => Math.round(value).toLocaleString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-metallic)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                }}
                labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}
                formatter={(value: number) => Math.round(value).toLocaleString()}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="line"
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              />
              <Line
                type="monotone"
                dataKey="followers"
                name="Your Performance"
                stroke="#e91e63"
                strokeWidth={3}
                dot={{ fill: '#e91e63', r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
              {showCompetitor && (
                <Line
                  type="monotone"
                  dataKey="competitor"
                  name="Competitor Average"
                  stroke="#f06292"
                  strokeWidth={3}
                  dot={{ fill: '#f06292', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
