// Competitor Vault API Types

export interface CompetitorPlatformAccount {
  platform: string;
  url: string;
  followers: number;
}

export interface CompetitorCard {
  id: string;
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  platforms: CompetitorPlatformAccount[];
  totalFollowers: number;
  averageEngagement: number;
}

export interface CompetitorsListParams {
  companyId: string;
}

export interface CompetitorsListData {
  items: CompetitorCard[];
}

export interface AddCompetitorPlatform {
  platform: string;
  url: string;
  type: 'company' | 'profile';
}

export interface AddCompetitorParams {
  companyId: string;
  name: string;
  website?: string;
  platforms?: AddCompetitorPlatform[];
}

export interface AddCompetitorData {
  competitorId: string;
  name: string;
}

export interface BrightDataCompetitorParams {
  companyId: string;
  brightDataPayload: {
    name: string;
    industry?: string;
    region?: string;
    logoUrl?: string;
    accounts: Array<{
      platform: string;
      handle: string;
      displayName?: string;
      profileUrl?: string;
      followers?: number;
      avgEngagement?: number;
    }>;
  };
}

export interface CompetitorDetailsParams {
  id: string;
  companyId: string;
}

export interface CompetitorSnapshot {
  date: string;
  followers: number;
  posts: number;
}

export interface CompetitorPlatform {
  platform: string;
  profileUrl: string;
  currentFollowers: number;
  snapshots: CompetitorSnapshot[];
}

export interface CompetitorPost {
  id: string;
  platform: string;
  content: string;
  postedAt: string;
  impressions: number;
  likes: number;
  comments: number;
  engagement: number;
  engagementRate: string;
}

export interface CompetitorDetails {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  industry: string | null;
  platforms: CompetitorPlatform[];
  posts: CompetitorPost[];
}
