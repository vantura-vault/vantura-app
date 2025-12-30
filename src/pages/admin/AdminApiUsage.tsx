import { useState } from 'react';
import { Activity, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { useApiUsage } from '../../hooks/useAdmin';
import styles from './AdminApiUsage.module.css';

type Range = '24h' | '7d' | '30d';

export function AdminApiUsage() {
  const [range, setRange] = useState<Range>('7d');
  const { data, isLoading, error } = useApiUsage(range);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading API usage data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Failed to load API usage data.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>API Usage</h1>
          <p className={styles.subtitle}>Monitor API performance and usage patterns</p>
        </div>

        <div className={styles.rangeSelector}>
          {(['24h', '7d', '30d'] as Range[]).map((r) => (
            <button
              key={r}
              className={`${styles.rangeBtn} ${range === r ? styles.active : ''}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Activity size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{data?.totalCalls?.toLocaleString() ?? 0}</span>
            <span className={styles.statLabel}>Total Calls</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.errorIcon}`}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{data?.errorCalls ?? 0}</span>
            <span className={styles.statLabel}>Errors</span>
            <span className={styles.errorRate}>
              {data?.errorRate?.toFixed(1) ?? 0}% error rate
            </span>
          </div>
        </div>
      </div>

      {data?.byEndpoint && data.byEndpoint.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top Endpoints</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Calls</th>
                  <th>Avg Response Time</th>
                </tr>
              </thead>
              <tbody>
                {data.byEndpoint.slice(0, 15).map((endpoint, i) => (
                  <tr key={i}>
                    <td className={styles.endpoint}>{endpoint.endpoint}</td>
                    <td>
                      <span className={`${styles.method} ${styles[`method_${endpoint.method.toLowerCase()}`]}`}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td>{endpoint.count.toLocaleString()}</td>
                    <td>
                      <div className={styles.responseTime}>
                        <Clock size={14} />
                        {endpoint.avgResponseTime}ms
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.topUsers && data.topUsers.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top Users by API Calls</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Calls</th>
                </tr>
              </thead>
              <tbody>
                {data.topUsers.map((user, i) => (
                  <tr key={i}>
                    <td>{user.user?.name ?? 'Unknown'}</td>
                    <td className={styles.email}>{user.user?.email ?? user.userId}</td>
                    <td>
                      <div className={styles.callCount}>
                        <TrendingUp size={14} />
                        {user.count.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
