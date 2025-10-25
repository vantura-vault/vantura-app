import { Bell, User } from 'lucide-react';
import styles from './TopBar.module.css';

interface TopBarProps {
  pageTitle: string;
  isSidebarCollapsed: boolean;
}

export function TopBar({ pageTitle, isSidebarCollapsed }: TopBarProps) {
  return (
    <header className={`${styles.topbar} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
      <h1 className={styles.pageTitle}>{pageTitle}</h1>

      <div className={styles.actions}>
        <button className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <button className={styles.userButton} aria-label="User menu">
          <div className={styles.avatar}>
            <User size={18} />
          </div>
        </button>
      </div>
    </header>
  );
}
