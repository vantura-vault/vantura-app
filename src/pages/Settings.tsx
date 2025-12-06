import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { useAuthStore } from '../store/authStore';
import styles from './Settings.module.css';

export function Settings() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleSignOut = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className={styles.settings}>
      <Card>
        <h2>Settings</h2>
        <p className={styles.subtitle}>Configure your account and preferences</p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Account</h3>
          <div className={styles.signOutSection}>
            <div>
              <p className={styles.signOutLabel}>Sign out of your account</p>
              <p className={styles.signOutDescription}>
                You will need to sign in again to access your dashboard
              </p>
            </div>
            <Button onClick={handleSignOut} variant="secondary">
              <LogOut size={18} />
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
