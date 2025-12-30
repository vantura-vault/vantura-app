import { MessageSquare } from 'lucide-react';
import styles from './AIAssistantPanel.module.css';

export function AIAssistantPanel() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>AI Assistant</h3>

      <div className={styles.comingSoonCard}>
        <MessageSquare size={32} className={styles.comingSoonIcon} />
        <span className={styles.comingSoonBadge}>Coming Soon</span>
        <p className={styles.comingSoonText}>
          Get real-time writing suggestions, grammar checks, and engagement optimization tips.
        </p>
      </div>
    </div>
  );
}
