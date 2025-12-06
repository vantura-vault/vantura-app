import { useState, useMemo } from 'react';
import { TimeframeSelector, type Timeframe } from '../components/analytics/TimeframeSelector';
import { FollowerGrowthChart } from '../components/analytics/FollowerGrowthChart';
import { PostEngagementChart } from '../components/analytics/PostEngagementChart';
import { PostPerformanceList } from '../components/analytics/PostPerformanceList';
import { useHistoricalMetrics, useRecentPosts, useAnalyticsSummary, useCompanyId } from '../hooks';
import { formatNumber } from '../utils/formatters';
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

const generateEngagementData = (timeframe: Timeframe) => {
  const dataPoints: { [key in Timeframe]: number } = {
    month: 30,
    '6months': 180,
    year: 365,
    all: 730,
  };

  const days = dataPoints[timeframe];
  const data = [];

  for (let i = 0; i < Math.min(days, 20); i++) {
    const dayLabel = timeframe === 'month'
      ? `Day ${i + 1}`
      : timeframe === '6months'
      ? `Week ${i + 1}`
      : `Month ${i + 1}`;

    data.push({
      date: dayLabel,
      likes: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 100) + 10,
    });
  }

  return data;
};

const mockPosts = [
  {
    id: 1,
    platform: 'LinkedIn',
    caption: 'Just launched our new AI-powered analytics dashboard. The future of data visualization is here!',
    postedAt: '2 days ago',
    likes: 1245,
    comments: 87,
    engagement: 8.5,
    trend: 'up' as const,
  },
  {
    id: 2,
    platform: 'X',
    caption: 'Strategic insight: Companies that invest in real-time analytics see 3x growth. Time to level up.',
    postedAt: '3 days ago',
    likes: 892,
    comments: 45,
    engagement: 6.2,
    trend: 'up' as const,
  },
  {
    id: 3,
    platform: 'LinkedIn',
    caption: 'Our team just hit 10K followers! Thank you for being part of this journey.',
    postedAt: '5 days ago',
    likes: 2134,
    comments: 156,
    engagement: 12.3,
    trend: 'up' as const,
  },
  {
    id: 4,
    platform: 'X',
    caption: 'Hot take: Traditional marketing metrics are dead. Here\'s what actually matters in 2025...',
    postedAt: '1 week ago',
    likes: 567,
    comments: 23,
    engagement: 4.1,
    trend: 'neutral' as const,
  },
  {
    id: 5,
    platform: 'LinkedIn',
    caption: 'Webinar reminder: "Data-Driven Strategy" starts in 1 hour. Join us to learn tactical insights.',
    postedAt: '1 week ago',
    likes: 312,
    comments: 12,
    engagement: 2.8,
    trend: 'down' as const,
  },
];

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

  const { data: summaryData } = useAnalyticsSummary({
    companyId,
    range: TIMEFRAME_MAP[timeframe],
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

  const engagementData = useMemo(() => {
    if (!historicalData) return generateEngagementData(timeframe);

    const samplingRate = timeframe === 'month' ? 3 : timeframe === '6months' ? 7 : timeframe === 'year' ? 14 : 30;

    return historicalData.dates
      .map((date, i) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        likes: Math.floor(historicalData.engagement[i] * 0.7),
        comments: Math.floor(historicalData.engagement[i] * 0.3),
        index: i,
      }))
      .filter((_, i) => i % samplingRate === 0 || i === historicalData.dates.length - 1);
  }, [historicalData, timeframe]);

  // Transform recent posts data
  const posts = useMemo(() => {
    if (!recentPostsData) return mockPosts;

    return recentPostsData.items.map((post, index) => ({
      id: index + 1,
      platform: post.platform,
      caption: post.content,
      postedAt: new Date(post.postedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      likes: post.engagement,
      comments: Math.floor(post.engagement * 0.2),
      engagement: post.engagementRate,
      trend: (post.engagementRate > 5 ? 'up' : post.engagementRate > 3 ? 'neutral' : 'down') as 'up' | 'neutral' | 'down',
    }));
  }, [recentPostsData]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Analytics Dashboard</h1>
          <p className={styles.subtitle}>
            Performance Overview & Insights
          </p>
        </div>
      </div>

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
