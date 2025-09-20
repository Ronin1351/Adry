import { apiClient } from './client';
import { EmployeeProfile, EmployerProfile, ApiResponse } from '../types';

export const profileAPI = {
  // Employee Profile
  getEmployeeProfile: (userId: string) =>
    apiClient.get<ApiResponse<EmployeeProfile>>(`/profiles/employee/${userId}`),

  createEmployeeProfile: (data: Partial<EmployeeProfile>) =>
    apiClient.post<ApiResponse<EmployeeProfile>>('/profiles/employee', data),

  updateEmployeeProfile: (id: string, data: Partial<EmployeeProfile>) =>
    apiClient.put<ApiResponse<EmployeeProfile>>(`/profiles/employee/${id}`, data),

  uploadProfilePhoto: (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return apiClient.upload<ApiResponse<{ profilePhotoUrl: string }>>(
      `/profiles/employee/${userId}/photo`,
      formData
    );
  },

  // Employer Profile
  getEmployerProfile: (userId: string) =>
    apiClient.get<ApiResponse<EmployerProfile>>(`/profiles/employer/${userId}`),

  createEmployerProfile: (data: Partial<EmployerProfile>) =>
    apiClient.post<ApiResponse<EmployerProfile>>('/profiles/employer', data),

  updateEmployerProfile: (id: string, data: Partial<EmployerProfile>) =>
    apiClient.put<ApiResponse<EmployerProfile>>(`/profiles/employer/${id}`, data),

  uploadCompanyLogo: (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return apiClient.upload<ApiResponse<{ companyLogoUrl: string }>>(
      `/profiles/employer/${userId}/logo`,
      formData
    );
  },

  // Search Profiles
  searchEmployeeProfiles: (params: {
    page?: number;
    limit?: number;
    query?: string;
    location?: string;
    skills?: string[];
    experience?: string;
  }) =>
    apiClient.get<ApiResponse<{ data: EmployeeProfile[]; pagination: any }>>(
      '/profiles/employee/search',
      { params }
    ),

  searchEmployerProfiles: (params: {
    page?: number;
    limit?: number;
    query?: string;
    location?: string;
    industry?: string;
    companySize?: string;
  }) =>
    apiClient.get<ApiResponse<{ data: EmployerProfile[]; pagination: any }>>(
      '/profiles/employer/search',
      { params }
    ),
};
