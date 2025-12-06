import { Edit2 } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  name: string;
  avatarUrl?: string;
  title: string;
  onAvatarClick?: () => void;
}

export function ProfileCard({ name, avatarUrl, title, onAvatarClick }: ProfileCardProps) {
  return (
    <Card className={styles.profileCard}>
      <div
        className={styles.avatarContainer}
        onClick={onAvatarClick}
        role={onAvatarClick ? "button" : undefined}
        tabIndex={onAvatarClick ? 0 : undefined}
        onKeyDown={onAvatarClick ? (e) => e.key === 'Enter' && onAvatarClick() : undefined}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
        )}
        {onAvatarClick && (
          <div className={styles.editOverlay}>
            <Edit2 size={20} />
            <span className={styles.editText}>Edit</span>
          </div>
        )}
      </div>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.title}>{title}</p>
    </Card>
  );
}
