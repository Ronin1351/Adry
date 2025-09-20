import { apiClient } from './client';
import { JobPosting, JobApplication, SearchFilters, PaginatedResponse, ApiResponse } from '../types';

export const jobAPI = {
  getJobPostings: (params: {
    page?: number;
    limit?: number;
    filters?: SearchFilters;
  }) =>
    apiClient.get<PaginatedResponse<JobPosting>>('/jobs', { params }),

  getMyJobPostings: (params: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<JobPosting>>('/jobs/my', { params }),

  getJobPosting: (id: string) =>
    apiClient.get<ApiResponse<JobPosting>>(`/jobs/${id}`),

  createJobPosting: (data: Partial<JobPosting>) =>
    apiClient.post<ApiResponse<JobPosting>>('/jobs', data),

  updateJobPosting: (id: string, data: Partial<JobPosting>) =>
    apiClient.put<ApiResponse<JobPosting>>(`/jobs/${id}`, data),

  deleteJobPosting: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/jobs/${id}`),

  applyToJob: (data: { jobPostingId: string; coverLetter?: string }) =>
    apiClient.post<ApiResponse<JobApplication>>('/jobs/apply', data),

  getMyApplications: (params: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<JobApplication>>('/jobs/applications/my', { params }),

  getJobApplications: (jobPostingId: string) =>
    apiClient.get<ApiResponse<JobApplication[]>>(`/jobs/${jobPostingId}/applications`),

  updateApplicationStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<JobApplication>>(`/jobs/applications/${id}/status`, { status }),

  saveJob: (jobPostingId: string) =>
    apiClient.post<ApiResponse<null>>(`/jobs/${jobPostingId}/save`),

  unsaveJob: (jobPostingId: string) =>
    apiClient.delete<ApiResponse<null>>(`/jobs/${jobPostingId}/save`),

  getSavedJobs: (params: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<JobPosting>>('/jobs/saved', { params }),
};
