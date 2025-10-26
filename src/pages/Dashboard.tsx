import { WelcomeHeader } from '../components/dashboard/WelcomeHeader';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { PlatformIntel } from '../components/dashboard/PlatformIntel';
import { useAuthStore } from '../store/authStore';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);

  // Get company name from user's company or use default
  // TODO: Fetch actual company details from API when companyId is available
  const companyName = user?.companyId === 'demo-company-1'
    ? 'Poppi'
    : user?.name || 'Poppi';

  return (
    <div className={styles.dashboard}>
      <div className={styles.mainColumn}>
        <WelcomeHeader companyName={companyName} />
        <MetricsGrid />
      </div>
      <div className={styles.sideColumn}>
        <PlatformIntel />
      </div>
    </div>
  );
}
