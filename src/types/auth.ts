export interface User {
  id: string;
  email: string;
  name: string;
  companyId?: string | null;
  avatar?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface SignupResponse {
  user: User;
  token: string;
  expiresAt: string;
}
