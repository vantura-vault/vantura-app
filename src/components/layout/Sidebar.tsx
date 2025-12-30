import { NavLink } from 'react-router-dom';
import { Home, Database, FileText, Users, ChevronLeft, Wand2, Zap, Calendar, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import styles from './Sidebar.module.css';

const menuItems = [
  { path: '/', label: 'Home', icon: Home, hasLiveIndicator: true },
  { path: '/data-chamber', label: 'Data Chamber', icon: Database },
  { path: '/competitor-vault', label: 'Competitor Vault', icon: Users },
  { path: '/signals', label: 'Signals', icon: Zap },
  { path: '/blueprint', label: 'Blueprints', icon: FileText },
  { path: '/studio', label: 'Studio', icon: Wand2 },
  { path: '/scheduler', label: 'Scheduler', icon: Calendar },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <div className={styles.iconWrapper}>
              <item.icon size={20} />
              {item.hasLiveIndicator && <span className={styles.liveIndicator} />}
            </div>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {isSuperAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${styles.navItem} ${styles.adminItem} ${isActive ? styles.active : ''}`
            }
          >
            <div className={styles.iconWrapper}>
              <Shield size={20} />
            </div>
            {!isCollapsed && <span>Admin</span>}
          </NavLink>
        )}
      </nav>

      <button
        className={styles.collapseBtn}
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          size={16}
          className={isCollapsed ? styles.chevronCollapsed : ''}
        />
        {!isCollapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
