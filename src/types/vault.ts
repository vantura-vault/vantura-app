// Competitor Vault API Types

export interface CompetitorPlatformAccount {
  platform: string;
  handle: string;
  profileUrl?: string;
}

export interface CompetitorCard {
  id: string;
  name: string;
  industry?: string;
  region?: string;
  logoUrl?: string;
  platforms: CompetitorPlatformAccount[];
  totalFollowers: number;
  avgEngagement: number;
  createdAt: string;
}

export interface CompetitorsListParams {
  companyId: string;
}

export interface CompetitorsListData {
  items: CompetitorCard[];
}

export interface AddCompetitorAccount {
  platform: string;
  handle: string;
  displayName?: string;
  profileUrl?: string;
}

export interface AddCompetitorParams {
  companyId: string;
  competitor: {
    name: string;
    industry?: string;
    region?: string;
    logoUrl?: string;
    accounts: AddCompetitorAccount[];
  };
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
}
