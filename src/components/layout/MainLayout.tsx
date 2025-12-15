import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { WebSocketProvider } from '../../providers/WebSocketProvider';
import { ToastContainer } from '../shared/Toast';
import appBg from '../../assets/main.jpeg';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <WebSocketProvider>
      <div className={styles.layout}>
        <div
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${appBg})` }}
        />
        <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className={`${styles.mainContent} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
          <TopBar isSidebarCollapsed={isSidebarCollapsed} />
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
      <ToastContainer />
    </WebSocketProvider>
  );
}
