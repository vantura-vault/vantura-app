import { useState, useMemo } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { TimeframeSelector, type Timeframe } from '../components/analytics/TimeframeSelector';
import { FollowerGrowthChart } from '../components/analytics/FollowerGrowthChart';
import { useHistoricalMetrics, useRecentPosts, useCompanyId } from '../hooks';
import type { ComparisonMode } from '../types/analytics';
import styles from './Analytics.module.css';

const TIMEFRAME_MAP: { [key in Timeframe]: '1M' | '6M' | '1Y' | 'ALL' } = {
  month: '1M',
  '6months': '6M',
  year: '1Y',
  all: 'ALL',
};

// Fallback mock data generator for development
const generateFollowerData = (timeframe: Timeframe) => {
  const dataPoints: { [key in Timeframe]: number } = {
    month: 30,
    '6months': 180,
    year: 365,
    all: 730,
  };

  const days = dataPoints[timeframe];
  const data = [];
  const baseFollowers = 1000;
  const increment = 100;

  for (let i = 0; i < Math.min(days, 20); i++) {
    const dayLabel = timeframe === 'month'
      ? `Day ${i + 1}`
      : timeframe === '6months'
      ? `Week ${i + 1}`
      : `Month ${i + 1}`;

    data.push({
      date: dayLabel,
      followers: baseFollowers + (increment * i) + Math.random() * 50,
    });
  }

  return data;
};

export function Analytics() {
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('top');
  const companyId = useCompanyId();

  // Fetch real data from API
  const { data: historicalData } = useHistoricalMetrics({
    companyId,
    platform: 'LinkedIn',
    range: TIMEFRAME_MAP[timeframe],
    ma: 7, // 7-day moving average
    comparisonMode,
  });

  const { data: recentPostsData } = useRecentPosts({
    companyId,
    limit: 10,
  });

  // Transform API data to chart format with sampling
  const followerData = useMemo(() => {
    if (!historicalData) return generateFollowerData(timeframe);

    // Sample data points based on timeframe to reduce clutter
    const samplingRate = timeframe === 'month' ? 3 : timeframe === '6months' ? 7 : timeframe === 'year' ? 14 : 30;

    return historicalData.dates
      .map((date, i) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        followers: historicalData.followers[i],
        competitor: historicalData.competitorFollowers?.[i],
        index: i,
      }))
      .filter((_, i) => i % samplingRate === 0 || i === historicalData.dates.length - 1); // Keep first, every Nth, and last
  }, [historicalData, timeframe]);

  // Keep recentPostsData used to avoid lint warning (data fetched for future use)
  void recentPostsData;

  return (
    <div className={styles.container}>
      <PageHeader
        title="Analytics"
        subtitle="Performance overview and insights"
      />

      <div className={styles.filterBar}>
        <TimeframeSelector selected={timeframe} onChange={setTimeframe} />
        <select
          className={styles.filterSelect}
          value={comparisonMode}
          onChange={(e) => setComparisonMode(e.target.value as ComparisonMode)}
        >
          <option value="top">Top Competitor Average</option>
          <option value="all">All Competitors</option>
          <option value="industry">Industry Average</option>
          <option value="none">No Comparison</option>
        </select>
      </div>

      <div className={styles.performanceSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Performance Comparison</h2>
        </div>
        <div className={styles.chartsGrid}>
          <FollowerGrowthChart
            data={followerData}
            title="Total Follower Growth (LinkedIn, 7-day MA)"
            showCompetitor={comparisonMode !== 'none'}
          />
        </div>
      </div>
    </div>
  );
}
