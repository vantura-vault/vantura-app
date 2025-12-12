import { WelcomeHeader } from '../components/dashboard/WelcomeHeader';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { PlatformIntel } from '../components/dashboard/PlatformIntel';
import { EngagementLeaderboard } from '../components/dashboard/EngagementLeaderboard';
import { RecentBlueprints } from '../components/dashboard/RecentBlueprints';
import { useDashboard } from '../hooks';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { data: dashboard, isLoading } = useDashboard();

  // Get company name from API, fallback to 'Vantura Strategist' if loading
  const companyName = dashboard?.company?.name || (isLoading ? 'Vantura Strategist' : 'there');

  return (
    <div className={styles.dashboard}>
      <div className={styles.mainColumn}>
        <WelcomeHeader companyName={companyName} />
        <MetricsGrid />
        {dashboard?.engagementLeaderboard && (
          <EngagementLeaderboard entries={dashboard.engagementLeaderboard} />
        )}
        <RecentBlueprints />
      </div>
      <div className={styles.sideColumn}>
        <PlatformIntel />
      </div>
    </div>
  );
}
