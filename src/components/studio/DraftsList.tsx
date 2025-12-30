import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Clock, Edit3 } from 'lucide-react';
import { useDrafts, useDeleteDraft } from '../../hooks/useDrafts';
import { PlatformIcon } from '../shared/PlatformIcon';
import type { Draft } from '../../types/draft';
import styles from './DraftsList.module.css';

interface DraftsListProps {
  onSelectDraft?: (draft: Draft) => void;
}

export function DraftsList({ onSelectDraft }: DraftsListProps) {
  const navigate = useNavigate();
  const { data: drafts, isLoading, error } = useDrafts();
  const deleteMutation = useDeleteDraft();

  const handleResume = (draft: Draft) => {
    if (onSelectDraft) {
      onSelectDraft(draft);
    } else {
      navigate(`/studio/create/${draft.blueprintId}?draftId=${draft.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, draftId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this draft?')) {
      deleteMutation.mutate(draftId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={styles.emptyState}>
        <p>Loading drafts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.emptyState}>
        <p>Failed to load drafts</p>
      </div>
    );
  }

  if (!drafts || drafts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FileText size={48} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>No drafts yet</h3>
        <p className={styles.emptyText}>
          Your post drafts will appear here. Start by selecting a blueprint and creating a post.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className={styles.draftCard}
            onClick={() => handleResume(draft)}
          >
            {/* Thumbnail */}
            <div className={styles.thumbnail}>
              {draft.imageUrl ? (
                <img src={draft.imageUrl} alt="" className={styles.thumbnailImage} />
              ) : (
                <div className={styles.thumbnailPlaceholder}>
                  <FileText size={24} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={styles.content}>
              <div className={styles.header}>
                <PlatformIcon platform={draft.platform} size={16} />
                <span className={styles.blueprintTitle}>
                  {draft.blueprint.title}
                </span>
              </div>

              <p className={styles.captionPreview}>
                {draft.caption
                  ? draft.caption.substring(0, 100) + (draft.caption.length > 100 ? '...' : '')
                  : 'No caption yet...'}
              </p>

              <div className={styles.footer}>
                <div className={styles.meta}>
                  <span className={`${styles.statusBadge} ${draft.status === 'ready_to_publish' ? styles.statusReady : styles.statusProgress}`}>
                    {draft.status === 'ready_to_publish' ? 'Ready' : 'In Progress'}
                  </span>
                  <span className={styles.stepInfo}>
                    Step {draft.currentStep}/4
                  </span>
                </div>
                <div className={styles.timestamp}>
                  <Clock size={12} />
                  {formatDate(draft.updatedAt)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={styles.resumeButton}
                onClick={() => handleResume(draft)}
              >
                <Edit3 size={14} />
                Resume
              </button>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDelete(e, draft.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
