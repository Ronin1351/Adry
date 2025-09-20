import { apiClient } from '../client';
import { AdryUser, AdryApiResponse } from '../../types/adry';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: 'EMPLOYEE' | 'EMPLOYER';
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

interface AuthResponse {
  user: AdryUser;
  token: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export const adryAuthAPI = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AdryApiResponse<AuthResponse>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    apiClient.post<AdryApiResponse<AuthResponse>>('/auth/register', data),

  logout: () =>
    apiClient.post<AdryApiResponse<null>>('/auth/logout'),

  refreshToken: () =>
    apiClient.post<AdryApiResponse<RefreshTokenResponse>>('/auth/refresh'),

  verifyEmail: (token: string) =>
    apiClient.post<AdryApiResponse<null>>('/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    apiClient.post<AdryApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post<AdryApiResponse<null>>('/auth/reset-password', { token, password }),

  getProfile: () =>
    apiClient.get<AdryApiResponse<AdryUser>>('/auth/profile'),
};
