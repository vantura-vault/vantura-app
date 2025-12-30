import { useState } from 'react';
import { Search, Users, FileText, Layers } from 'lucide-react';
import { useAdminCompanies } from '../../hooks/useAdmin';
import styles from './AdminCompanies.module.css';

export function AdminCompanies() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading, error } = useAdminCompanies({
    limit,
    offset: page * limit,
    search: search || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    const statusClass = styles[`status_${status.replace('_', '')}`] || styles.status_default;
    return (
      <span className={`${styles.status} ${statusClass}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Companies</h1>
      <p className={styles.subtitle}>All registered companies and their stats</p>

      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by company name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className={styles.searchInput}
        />
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading companies...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>Failed to load companies.</p>
        </div>
      )}

      {data && (
        <>
          <div className={styles.grid}>
            {data.companies.map((company) => (
              <div key={company.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.companyName}>{company.name}</h3>
                  {getStatusBadge(company.subscriptionStatus)}
                </div>

                {company.industry && (
                  <p className={styles.industry}>{company.industry}</p>
                )}

                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <Users size={16} />
                    <span>{company._count.users} users</span>
                  </div>
                  <div className={styles.stat}>
                    <FileText size={16} />
                    <span>{company._count.blueprints} blueprints</span>
                  </div>
                  <div className={styles.stat}>
                    <Layers size={16} />
                    <span>{company._count.platforms} platforms</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.date}>
                    Joined {new Date(company.createdAt).toLocaleDateString()}
                  </span>
                  {company.stripeCustomerId && (
                    <span className={styles.stripeBadge}>Stripe</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <span className={styles.pageInfo}>
              Showing {data.offset + 1}–{Math.min(data.offset + data.companies.length, data.total)} of {data.total}
            </span>
            <div className={styles.pageButtons}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className={styles.pageBtn}
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className={styles.pageBtn}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
