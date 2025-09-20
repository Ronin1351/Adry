import { apiClient } from '../client';
import { Shortlist, AdryApiResponse } from '../../types/adry';

export const adryShortlistAPI = {
  // Add to Shortlist
  addToShortlist: (data: {
    employeeId: string;
    notes?: string;
  }) =>
    apiClient.post<AdryApiResponse<Shortlist>>('/shortlist', data),

  // Remove from Shortlist
  removeFromShortlist: (shortlistId: string) =>
    apiClient.delete<AdryApiResponse<null>>(`/shortlist/${shortlistId}`),

  // Get Shortlist
  getShortlist: (params: { page?: number; limit?: number }) =>
    apiClient.get<AdryApiResponse<{ data: Shortlist[]; pagination: any }>>(
      '/shortlist',
      { params }
    ),

  // Update Shortlist Item
  updateShortlistItem: (shortlistId: string, data: {
    notes?: string;
  }) =>
    apiClient.put<AdryApiResponse<Shortlist>>(`/shortlist/${shortlistId}`, data),

  // Check if in Shortlist
  isInShortlist: (employeeId: string) =>
    apiClient.get<AdryApiResponse<{ 
      inShortlist: boolean;
      shortlistId?: string;
    }>>(`/shortlist/check/${employeeId}`),

  // Clear Shortlist
  clearShortlist: () =>
    apiClient.delete<AdryApiResponse<{ cleared: number }>>('/shortlist/clear'),

  // Export Shortlist
  exportShortlist: (format: 'csv' | 'pdf' = 'csv') =>
    apiClient.get<AdryApiResponse<{ downloadUrl: string }>>(
      `/shortlist/export?format=${format}`
    ),
};
