import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import type { Competitor } from '../types/competitor';
import { CompetitorCard } from '../components/competitor/CompetitorCard';
import { CompetitorListItem } from '../components/competitor/CompetitorListItem';
import { AddCompetitorModal } from '../components/competitor/AddCompetitorModal';
import { Button } from '../components/shared/Button';
import { useCompetitors, useCompanyId, useDeleteCompetitor } from '../hooks';
import styles from './CompetitorVault.module.css';

export function CompetitorVault() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const companyId = useCompanyId();

  // Fetch real competitors from API
  const { data: competitorsData, isLoading } = useCompetitors({ companyId });

  // Delete mutation
  const deleteCompetitorMutation = useDeleteCompetitor();

  // Transform API data to match component format
  const competitors = useMemo<Competitor[]>(() => {
    if (!competitorsData || !competitorsData.items) {
      return [];
    }

    return competitorsData.items.map((comp: any) => ({
      id: comp.id,
      name: comp.name,
      handle: comp.platforms?.[0]?.url?.split('/').pop() || 'unknown',
      platform: comp.platforms?.[0]?.platform || 'LinkedIn',
      avatarUrl: comp.logoUrl,
      metrics: {
        totalFollowers: comp.totalFollowers || 0,
        averageEngagement: 0, // Backend doesn't provide this yet
      },
    }));
  }, [competitorsData]);

  const handleAddCompetitor = () => {
    setIsModalOpen(true);
  };

  const handleDeleteCompetitor = (competitorId: string) => {
    console.log('Deleting competitor:', { competitorId, companyId });
    deleteCompetitorMutation.mutate(
      { competitorId, companyId },
      {
        onSuccess: () => {
          console.log('Successfully deleted competitor');
        },
        onError: (error) => {
          console.error('Failed to delete competitor:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            competitorId,
            companyId
          });
          alert(`Failed to delete competitor: ${error.message}`);
        },
      }
    );
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
                <CompetitorCard
                  key={competitor.id}
                  competitor={competitor}
                  onDelete={handleDeleteCompetitor}
                />
              ))
            : competitors.map((competitor) => (
                <CompetitorListItem
                  key={competitor.id}
                  competitor={competitor}
                  onDelete={handleDeleteCompetitor}
                />
              ))}
        </div>
      )}

      <AddCompetitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
