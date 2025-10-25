export type PlatformName = 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'tiktok';

export interface Platform {
  id: string;
  name: PlatformName;
  displayName: string;
  followers: number;
  isConnected: boolean;
  icon: string;
}

export interface PlatformStats {
  platformId: string;
  reach: number;
  engagement: number;
  posts: number;
}
