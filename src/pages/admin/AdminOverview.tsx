import { Users, Building2, FileText, Activity, TrendingUp } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { useAdminStats } from '../../hooks/useAdmin';
import styles from './AdminOverview.module.css';

export function AdminOverview() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Failed to load stats. Make sure you have super admin access.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and key metrics"
      />

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats?.totalUsers ?? 0}</span>
            <span className={styles.statLabel}>Total Users</span>
            <span className={styles.statChange}>
              <TrendingUp size={14} />
              +{stats?.newUsersThisWeek ?? 0} this week
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building2 size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats?.totalCompanies ?? 0}</span>
            <span className={styles.statLabel}>Companies</span>
            <span className={styles.statChange}>
              <TrendingUp size={14} />
              +{stats?.newCompaniesThisWeek ?? 0} this week
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats?.totalBlueprints ?? 0}</span>
            <span className={styles.statLabel}>Blueprints</span>
            <span className={styles.statMeta}>{stats?.totalDrafts ?? 0} drafts</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Activity size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats?.apiCallsToday ?? 0}</span>
            <span className={styles.statLabel}>API Calls Today</span>
            <span className={styles.statMeta}>{stats?.apiCallsThisWeek ?? 0} this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
