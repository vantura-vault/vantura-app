import { NavLink } from 'react-router-dom';
import { Home, Database, FileText, Users, Settings as SettingsIcon, ChevronLeft } from 'lucide-react';
import styles from './Sidebar.module.css';
import venturaLogo from '../../assets/vantura-logo.svg';
import favicon from '../../assets/favicon.svg';

const menuItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/data-chamber', label: 'Data Chamber', icon: Database },
  { path: '/competitor-vault', label: 'Competitor Vault', icon: Users },
  { path: '/blueprint', label: 'Blueprints', icon: FileText },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <img
          src={isCollapsed ? favicon : venturaLogo}
          alt="Vantura"
          className={styles.logoImage}
        />
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
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
