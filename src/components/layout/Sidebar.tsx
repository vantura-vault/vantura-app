import { NavLink } from 'react-router-dom';
import { Home, Database, FileText, Users, ChevronLeft } from 'lucide-react';
import styles from './Sidebar.module.css';

const menuItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/data-chamber', label: 'Data Chamber', icon: Database },
  { path: '/competitor-vault', label: 'Competitor Vault', icon: Users },
  { path: '/blueprint', label: 'Blueprints', icon: FileText },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
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
