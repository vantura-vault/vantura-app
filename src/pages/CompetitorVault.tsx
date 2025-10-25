import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import type { Competitor } from '../types/competitor';
import { CompetitorCard } from '../components/competitor/CompetitorCard';
import { CompetitorListItem } from '../components/competitor/CompetitorListItem';
import { Button } from '../components/shared/Button';
import { useCompetitors } from '../hooks';
import styles from './CompetitorVault.module.css';

export function CompetitorVault() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const companyId = 'demo-company-1';

  // Fetch real competitors from API
  const { data: competitorsData, isLoading } = useCompetitors({ companyId });

  // Transform API data to match component format
  const competitors = useMemo<Competitor[]>(() => {
    if (!competitorsData) return [];

    return competitorsData.items.map((comp) => ({
      id: comp.id,
      name: comp.name,
      handle: comp.platforms[0]?.handle || 'unknown',
      platform: comp.platforms[0]?.platform || 'LinkedIn',
      avatarUrl: comp.logoUrl,
      metrics: {
        totalFollowers: comp.totalFollowers,
        averageEngagement: comp.avgEngagement,
      },
    }));
  }, [competitorsData]);

  const handleAddCompetitor = () => {
    // TODO: Implement add competitor functionality
    console.log('Add competitor clicked');
  };

  return (
    <div className={styles.competitorVault}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Intelligence Network</h1>
          <p className={styles.subtitle}>
            {isLoading
              ? 'Loading competitor intelligence...'
              : `Tracking ${competitors.length} competitor${competitors.length !== 1 ? 's' : ''} across strategic channels`}
          </p>
        </div>
        <div className={styles.actions}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleButton} ${viewMode === 'card' ? styles.active : ''}`}
              onClick={() => setViewMode('card')}
              aria-label="Card view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
          <Button onClick={handleAddCompetitor}>
            <Plus size={18} />
            Add Competitor
          </Button>
        </div>
      </div>

      {competitors.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No competitors tracked yet. Add your first competitor to begin intelligence gathering.</p>
        </div>
      ) : (
        <div className={viewMode === 'card' ? styles.cardGrid : styles.listView}>
          {viewMode === 'card'
            ? competitors.map((competitor) => (
                <CompetitorCard key={competitor.id} competitor={competitor} />
              ))
            : competitors.map((competitor) => (
                <CompetitorListItem key={competitor.id} competitor={competitor} />
              ))}
        </div>
      )}
    </div>
  );
}
