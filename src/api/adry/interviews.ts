import { apiClient } from '../client';
import { Interview, AdryApiResponse } from '../../types/adry';

export const adryInterviewAPI = {
  // Schedule Interview (requires active subscription)
  scheduleInterview: (data: {
    employeeId: string;
    scheduledAt: string;
    duration: number;
    location: string;
    notes?: string;
  }) =>
    apiClient.post<AdryApiResponse<Interview>>('/interviews', data),

  // Get Interviews
  getInterviews: (params: { page?: number; limit?: number }) =>
    apiClient.get<AdryApiResponse<{ data: Interview[]; pagination: any }>>(
      '/interviews',
      { params }
    ),

  // Get Interview
  getInterview: (interviewId: string) =>
    apiClient.get<AdryApiResponse<Interview>>(`/interviews/${interviewId}`),

  // Update Interview
  updateInterview: (interviewId: string, data: {
    scheduledAt?: string;
    duration?: number;
    location?: string;
    notes?: string;
    status?: string;
  }) =>
    apiClient.put<AdryApiResponse<Interview>>(`/interviews/${interviewId}`, data),

  // Cancel Interview
  cancelInterview: (interviewId: string, reason?: string) =>
    apiClient.patch<AdryApiResponse<Interview>>(
      `/interviews/${interviewId}/cancel`,
      { reason }
    ),

  // Reschedule Interview
  rescheduleInterview: (interviewId: string, newScheduledAt: string) =>
    apiClient.patch<AdryApiResponse<Interview>>(
      `/interviews/${interviewId}/reschedule`,
      { scheduledAt: newScheduledAt }
    ),

  // Complete Interview
  completeInterview: (interviewId: string, notes?: string) =>
    apiClient.patch<AdryApiResponse<Interview>>(
      `/interviews/${interviewId}/complete`,
      { notes }
    ),

  // Get Available Time Slots
  getAvailableSlots: (employeeId: string, date: string) =>
    apiClient.get<AdryApiResponse<{ 
      slots: { time: string; available: boolean }[];
    }>>(`/interviews/available-slots/${employeeId}`, {
      params: { date }
    }),

  // Check if Can Schedule (subscription check)
  canSchedule: (employeeId: string) =>
    apiClient.get<AdryApiResponse<{ 
      canSchedule: boolean;
      reason?: string;
      subscriptionStatus?: string;
    }>>(`/interviews/can-schedule/${employeeId}`),
};
