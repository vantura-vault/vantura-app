export type RecommendationBadge = 'trending' | 'optimal' | 'opportunity' | 'high-impact' | 'timing-critical' | 'competitive-edge';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  badge: RecommendationBadge;
  icon: string;
  metadata?: {
    engagementPotential?: string;
    estimatedReach?: string;
  };
  actionLabel: string;
  actionType: 'create' | 'schedule' | 'engage';
}

export interface StrategicMovesData {
  recommendations: Recommendation[];
  lastUpdated: Date;
}
