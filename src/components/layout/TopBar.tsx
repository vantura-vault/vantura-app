import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Search, Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import styles from './TopBar.module.css';

interface TopBarProps {
  pageTitle: string;
  isSidebarCollapsed: boolean;
}

export function TopBar({ isSidebarCollapsed }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New competitor added: Acme Corp', time: '5m ago', unread: true },
    { id: 2, text: 'Your post reached 10K impressions', time: '1h ago', unread: true },
    { id: 3, text: 'Weekly analytics report ready', time: '3h ago', unread: true },
  ];

  return (
    <header className={`${styles.topbar} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search VANTURA..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.iconButton}
          aria-label="Search"
          onClick={() => document.querySelector<HTMLInputElement>(`.${styles.searchInput}`)?.focus()}
        >
          <Search size={20} />
        </button>

        <div className={styles.notificationContainer}>
          <button
            className={styles.iconButton}
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className={styles.badge}>{notifications.filter(n => n.unread).length}</span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h3>Notifications</h3>
                <button className={styles.markAllRead}>Mark all read</button>
              </div>
              <div className={styles.notificationList}>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${notification.unread ? styles.unread : ''}`}
                  >
                    <div className={styles.notificationText}>{notification.text}</div>
                    <div className={styles.notificationTime}>{notification.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userMenuContainer}>
          <button
            className={styles.userButton}
            aria-label="User menu"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.avatar}>
              <User size={18} />
            </div>
          </button>

          {showUserMenu && (
            <div className={styles.userMenu}>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user?.name}</div>
                <div className={styles.userEmail}>{user?.email}</div>
              </div>
              <div className={styles.menuDivider} />
              <button
                className={styles.menuItem}
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
              >
                <SettingsIcon size={16} />
                <span>Settings</span>
              </button>
              <button className={styles.menuItem} onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
