import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import styles from './AdminLayout.module.css';

const adminMenuItems = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/companies', label: 'Companies', icon: Building2 },
  { path: '/admin/billing', label: 'Billing', icon: CreditCard },
  { path: '/admin/api-usage', label: 'API Usage', icon: Activity },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            <span>Back to App</span>
          </button>
          <h1 className={styles.title}>Admin</h1>
        </div>

        <nav className={styles.nav}>
          {adminMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
