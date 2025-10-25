import { TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { MoveCard } from './MoveCard';
import styles from './StrategicMoves.module.css';

const mockRecommendations = [
  {
    id: '1',
    title: 'Strike while timing is optimal',
    description: '"AI marketing tools" content is performing 35% better this week. Deploy now for maximum impact.',
    badge: 'trending' as const,
    icon: TrendingUp,
    metadata: {
      engagementPotential: 'High engagement potential',
      estimatedReach: '+22% reach expected',
    },
    actionLabel: 'Create Post',
    actionType: 'create' as const,
  },
  {
    id: '2',
    title: 'Execute LinkedIn play',
    description: 'Audience most active right now. Post within 2 hours to maximize visibility.',
    badge: 'optimal' as const,
    icon: Clock,
    metadata: {
      estimatedReach: '+22% reach expected',
    },
    actionLabel: 'Schedule Now',
    actionType: 'schedule' as const,
  },
  {
    id: '3',
    title: 'Counter competitive move',
    description: '4 competitors just had viral posts — strategic response window open.',
    badge: 'competitive-edge' as const,
    icon: MessageCircle,
    actionLabel: 'Engage',
    actionType: 'engage' as const,
  },
];

export function StrategicMoves() {
  const handleAction = (id: string) => {
    console.log('Action triggered for recommendation:', id);
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.iconHeader}>
          <span className={styles.vaultIcon}>🎯</span>
          <div>
            <h3 className={styles.title}>Your Strategic Advantage</h3>
            <p className={styles.subtitle}>AI-powered intelligence for maximum impact</p>
          </div>
        </div>
      </div>

      <div className={styles.movesGrid}>
        {mockRecommendations.map((rec) => (
          <MoveCard
            key={rec.id}
            title={rec.title}
            description={rec.description}
            badge={rec.badge}
            icon={rec.icon}
            metadata={rec.metadata}
            actionLabel={rec.actionLabel}
            onAction={() => handleAction(rec.id)}
          />
        ))}
      </div>
    </section>
  );
}
