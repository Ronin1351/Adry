import { apiClient } from './client';
import { Message, ApiResponse, PaginatedResponse } from '../types';

export const messageAPI = {
  getMessages: (params: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Message>>('/messages', { params }),

  getConversation: (userId: string) =>
    apiClient.get<ApiResponse<Message[]>>(`/messages/conversation/${userId}`),

  sendMessage: (data: { receiverId: string; content: string }) =>
    apiClient.post<ApiResponse<Message>>('/messages', data),

  markAsRead: (messageId: string) =>
    apiClient.patch<ApiResponse<Message>>(`/messages/${messageId}/read`),

  deleteMessage: (messageId: string) =>
    apiClient.delete<ApiResponse<null>>(`/messages/${messageId}`),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/messages/unread-count'),
};
