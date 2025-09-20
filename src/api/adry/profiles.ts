import { apiClient } from '../client';
import { EmployeeProfile, EmployerProfile, AdryApiResponse, SearchFilters } from '../../types/adry';

export const adryProfileAPI = {
  // Employee Profile
  getEmployeeProfile: (userId: string) =>
    apiClient.get<AdryApiResponse<EmployeeProfile>>(`/profiles/employee/${userId}`),

  createEmployeeProfile: (data: Partial<EmployeeProfile>) =>
    apiClient.post<AdryApiResponse<EmployeeProfile>>('/profiles/employee', data),

  updateEmployeeProfile: (id: string, data: Partial<EmployeeProfile>) =>
    apiClient.put<AdryApiResponse<EmployeeProfile>>(`/profiles/employee/${id}`, data),

  uploadProfilePhoto: (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return apiClient.upload<AdryApiResponse<{ profilePhotoUrl: string }>>(
      `/profiles/employee/${userId}/photo`,
      formData
    );
  },

  // Employer Profile
  getEmployerProfile: (userId: string) =>
    apiClient.get<AdryApiResponse<EmployerProfile>>(`/profiles/employer/${userId}`),

  createEmployerProfile: (data: Partial<EmployerProfile>) =>
    apiClient.post<AdryApiResponse<EmployerProfile>>('/profiles/employer', data),

  updateEmployerProfile: (id: string, data: Partial<EmployerProfile>) =>
    apiClient.put<AdryApiResponse<EmployerProfile>>(`/profiles/employer/${id}`, data),

  // Search Employee Profiles (Public)
  searchEmployeeProfiles: (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: SearchFilters;
  }) =>
    apiClient.get<AdryApiResponse<{ data: EmployeeProfile[]; pagination: any }>>(
      '/profiles/employee/search',
      { params }
    ),

  // Get Public Profile (for guests)
  getPublicProfile: (profileId: string) =>
    apiClient.get<AdryApiResponse<EmployeeProfile>>(`/profiles/employee/public/${profileId}`),

  // Toggle Profile Visibility
  toggleProfileVisibility: (profileId: string, isPublic: boolean) =>
    apiClient.patch<AdryApiResponse<{ isPublic: boolean }>>(
      `/profiles/employee/${profileId}/visibility`,
      { isPublic }
    ),
};
