import { apiClient } from './client';
import { User, ApiResponse } from '../types';

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
  user: User;
  token: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),

  refreshToken: () =>
    apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh'),

  verifyEmail: (token: string) =>
    apiClient.post<ApiResponse<null>>('/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post<ApiResponse<null>>('/auth/reset-password', { token, password }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<ApiResponse<null>>('/auth/change-password', {
      currentPassword,
      newPassword,
    }),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/auth/profile'),
};
