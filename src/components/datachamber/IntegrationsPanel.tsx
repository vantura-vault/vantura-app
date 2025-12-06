import { useState } from 'react';
import { Linkedin, ChevronDown, ChevronUp, RefreshCw, Building2, User } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './IntegrationsPanel.module.css';

interface LinkedInConfig {
  url: string;
  type: 'profile' | 'company';
  enabled: boolean;
}

interface IntegrationsPanelProps {
  linkedIn: LinkedInConfig;
  onLinkedInChange: (config: LinkedInConfig) => void;
  onSyncLinkedIn: (url: string, type: 'profile' | 'company') => Promise<void>;
  isSyncing?: boolean;
}

export function IntegrationsPanel({
  linkedIn,
  onLinkedInChange,
  onSyncLinkedIn,
  isSyncing = false,
}: IntegrationsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localUrl, setLocalUrl] = useState(linkedIn.url);

  const handleSync = async () => {
    if (!localUrl.trim()) return;

    // Save the URL first
    onLinkedInChange({ ...linkedIn, url: localUrl });

    // Then sync
    await onSyncLinkedIn(localUrl, linkedIn.type);
  };

  const handleTypeChange = (type: 'profile' | 'company') => {
    onLinkedInChange({ ...linkedIn, type });
  };

  const handleToggle = () => {
    onLinkedInChange({ ...linkedIn, enabled: !linkedIn.enabled });
  };

  return (
    <Card className={styles.integrationsPanel}>
      <h2 className={styles.title}>Integrations</h2>

      <div className={styles.integrationsList}>
        {/* LinkedIn Integration */}
        <div className={`${styles.integrationItem} ${isExpanded ? styles.expanded : ''}`}>
          <div
            className={styles.integrationHeader}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className={styles.integrationInfo}>
              <Linkedin className={styles.icon} />
              <span className={styles.name}>LinkedIn</span>
              {linkedIn.url && (
                <span className={styles.badge}>
                  {linkedIn.type === 'company' ? 'Company' : 'Profile'}
                </span>
              )}
            </div>
            <div className={styles.headerActions}>
              <button
                className={`${styles.toggle} ${linkedIn.enabled ? styles.toggleEnabled : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                aria-label="Toggle LinkedIn"
              >
                <span className={styles.toggleSlider} />
              </button>
              {isExpanded ? (
                <ChevronUp size={20} className={styles.chevron} />
              ) : (
                <ChevronDown size={20} className={styles.chevron} />
              )}
            </div>
          </div>

          {isExpanded && (
            <div className={styles.expandedContent}>
              {/* Type Selector */}
              <div className={styles.typeSelector}>
                <button
                  className={`${styles.typeButton} ${linkedIn.type === 'profile' ? styles.typeActive : ''}`}
                  onClick={() => handleTypeChange('profile')}
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button
                  className={`${styles.typeButton} ${linkedIn.type === 'company' ? styles.typeActive : ''}`}
                  onClick={() => handleTypeChange('company')}
                >
                  <Building2 size={16} />
                  <span>Company</span>
                </button>
              </div>

              {/* URL Input */}
              <div className={styles.urlInputGroup}>
                <input
                  type="url"
                  className={styles.urlInput}
                  placeholder={linkedIn.type === 'company'
                    ? 'https://linkedin.com/company/your-company'
                    : 'https://linkedin.com/in/your-profile'
                  }
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                />
                <button
                  className={styles.syncButton}
                  onClick={handleSync}
                  disabled={!localUrl.trim() || isSyncing}
                >
                  <RefreshCw size={16} className={isSyncing ? styles.spinning : ''} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                </button>
              </div>

              <p className={styles.hint}>
                {linkedIn.type === 'company'
                  ? 'Enter your company LinkedIn page URL to sync logo and info'
                  : 'Enter your personal LinkedIn profile URL to sync avatar and info'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
