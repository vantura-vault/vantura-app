import { DollarSign, CreditCard, Users, AlertCircle } from 'lucide-react';
import { useBilling } from '../../hooks/useAdmin';
import styles from './AdminBilling.module.css';

export function AdminBilling() {
  const { data, isLoading, error } = useBilling();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading billing data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <AlertCircle size={24} />
        <p>Failed to load billing data.</p>
      </div>
    );
  }

  if (!data?.configured) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Billing</h1>
        <p className={styles.subtitle}>Stripe integration status</p>

        <div className={styles.notConfigured}>
          <AlertCircle size={48} />
          <h2>Stripe Not Configured</h2>
          <p>{data?.message || 'Set STRIPE_SECRET_KEY in your environment to enable billing features.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Billing</h1>
      <p className={styles.subtitle}>Revenue and subscription metrics</p>

      {data.error && (
        <div className={styles.warning}>
          <AlertCircle size={18} />
          <span>{data.error}</span>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>
              ${data.mrr?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}
            </span>
            <span className={styles.statLabel}>Monthly Recurring Revenue</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CreditCard size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{data.activeSubscriptions ?? 0}</span>
            <span className={styles.statLabel}>Active Subscriptions</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{data.companiesWithStripe ?? 0}</span>
            <span className={styles.statLabel}>Companies with Stripe</span>
          </div>
        </div>
      </div>

      {data.byStatus && (
        <div className={styles.statusSection}>
          <h2 className={styles.sectionTitle}>Subscription Status Breakdown</h2>
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <span className={styles.statusValue}>{data.byStatus.active}</span>
              <span className={`${styles.statusLabel} ${styles.active}`}>Active</span>
            </div>
            <div className={styles.statusCard}>
              <span className={styles.statusValue}>{data.byStatus.trialing}</span>
              <span className={`${styles.statusLabel} ${styles.trialing}`}>Trialing</span>
            </div>
            <div className={styles.statusCard}>
              <span className={styles.statusValue}>{data.byStatus.canceled}</span>
              <span className={`${styles.statusLabel} ${styles.canceled}`}>Canceled</span>
            </div>
            <div className={styles.statusCard}>
              <span className={styles.statusValue}>{data.byStatus.pastDue}</span>
              <span className={`${styles.statusLabel} ${styles.pastDue}`}>Past Due</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
