import { useState } from 'react';
import { Search, UserX, KeyRound } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { useAdminUsers, useDeactivateUser, useResetPassword } from '../../hooks/useAdmin';
import styles from './AdminUsers.module.css';

export function AdminUsers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading, error } = useAdminUsers({
    limit,
    offset: page * limit,
    search: search || undefined,
  });

  const deactivateMutation = useDeactivateUser();
  const resetPasswordMutation = useResetPassword();

  const handleDeactivate = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to deactivate ${userName}? This will log them out of all sessions.`)) {
      deactivateMutation.mutate(userId, {
        onSuccess: (data) => {
          alert(data.message);
        },
        onError: (error) => {
          alert(`Failed: ${error.message}`);
        },
      });
    }
  };

  const handleResetPassword = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to reset ${userName}'s password?`)) {
      resetPasswordMutation.mutate(userId, {
        onSuccess: (data) => {
          alert(`Temporary password for ${userName}: ${data.tempPassword}\n\nPlease share this securely with the user.`);
        },
        onError: (error) => {
          alert(`Failed: ${error.message}`);
        },
      });
    }
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className={styles.container}>
      <PageHeader
        title="Users"
        subtitle="Manage platform users"
      />

      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by name or email..."
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
          <p>Loading users...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>Failed to load users.</p>
        </div>
      )}

      {data && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td className={styles.email}>{user.email}</td>
                    <td>
                      <span className={`${styles.role} ${styles[`role_${user.role}`]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.company?.name || '—'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleResetPassword(user.id, user.name)}
                          disabled={resetPasswordMutation.isPending}
                          title="Reset password"
                        >
                          <KeyRound size={16} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => handleDeactivate(user.id, user.name)}
                          disabled={deactivateMutation.isPending || user.role === 'super_admin'}
                          title="Deactivate user"
                        >
                          <UserX size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <span className={styles.pageInfo}>
              Showing {data.offset + 1}–{Math.min(data.offset + data.users.length, data.total)} of {data.total}
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
