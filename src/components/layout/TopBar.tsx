import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import venturaLogo from '../../assets/vantura-logo.svg';
import favicon from '../../assets/favicon.svg';
import styles from './TopBar.module.css';

interface TopBarProps {
  isSidebarCollapsed: boolean;
}

export function TopBar({ isSidebarCollapsed }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <header className={styles.topbar}>
      <div className={`${styles.logoSection} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <img
          src={isSidebarCollapsed ? favicon : venturaLogo}
          alt="Vantura"
          className={styles.logoImage}
        />
      </div>
      <div className={styles.userMenuContainer} ref={menuRef}>
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
    </header>
  );
}
