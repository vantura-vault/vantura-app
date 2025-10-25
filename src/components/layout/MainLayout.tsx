import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className={`${styles.mainContent} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
