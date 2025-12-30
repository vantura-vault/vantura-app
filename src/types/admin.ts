// Admin Dashboard Types

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    industry: string | null;
  } | null;
}

export interface AdminCompany {
  id: string;
  name: string;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  _count: {
    users: number;
    platforms: number;
    blueprints: number;
    drafts: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalBlueprints: number;
  totalPosts: number;
  totalDrafts: number;
  apiCallsToday: number;
  apiCallsThisWeek: number;
  newUsersThisWeek: number;
  newCompaniesThisWeek: number;
}

export interface ApiUsageEndpoint {
  endpoint: string;
  method: string;
  count: number;
  avgResponseTime: number;
}

export interface ApiUsageTopUser {
  userId: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  count: number;
}

export interface ApiUsageData {
  range: string;
  totalCalls: number;
  errorCalls: number;
  errorRate: number;
  byEndpoint: ApiUsageEndpoint[];
  topUsers: ApiUsageTopUser[];
}

export interface BillingData {
  configured: boolean;
  message?: string;
  error?: string;
  mrr?: number;
  activeSubscriptions?: number;
  companiesWithStripe?: number;
  byStatus?: {
    trialing: number;
    active: number;
    canceled: number;
    pastDue: number;
  };
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminCompaniesResponse {
  companies: AdminCompany[];
  total: number;
  limit: number;
  offset: number;
}

export interface DeactivateUserResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  tempPassword: string;
  message: string;
}
