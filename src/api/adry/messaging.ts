import { apiClient } from '../client';
import { Message, AdryApiResponse } from '../../types/adry';

export const adryMessagingAPI = {
  // Send Message (requires active subscription)
  sendMessage: (data: { 
    receiverId: string; 
    content: string;
  }) =>
    apiClient.post<AdryApiResponse<Message>>('/messages', data),

  // Get Messages
  getMessages: (params: { page?: number; limit?: number }) =>
    apiClient.get<AdryApiResponse<{ data: Message[]; pagination: any }>>(
      '/messages',
      { params }
    ),

  // Get Conversation
  getConversation: (userId: string) =>
    apiClient.get<AdryApiResponse<Message[]>>(`/messages/conversation/${userId}`),

  // Mark Message as Read
  markAsRead: (messageId: string) =>
    apiClient.patch<AdryApiResponse<Message>>(`/messages/${messageId}/read`),

  // Mark All Messages as Read
  markAllAsRead: (conversationId: string) =>
    apiClient.patch<AdryApiResponse<{ updated: number }>>(
      `/messages/conversation/${conversationId}/read-all`
    ),

  // Delete Message
  deleteMessage: (messageId: string) =>
    apiClient.delete<AdryApiResponse<null>>(`/messages/${messageId}`),

  // Get Unread Count
  getUnreadCount: () =>
    apiClient.get<AdryApiResponse<{ count: number }>>('/messages/unread-count'),

  // Archive Conversation
  archiveConversation: (conversationId: string) =>
    apiClient.patch<AdryApiResponse<{ archived: boolean }>>(
      `/messages/conversation/${conversationId}/archive`
    ),

  // Report Message
  reportMessage: (messageId: string, reason: string, description?: string) =>
    apiClient.post<AdryApiResponse<{ reportId: string }>>(
      `/messages/${messageId}/report`,
      { reason, description }
    ),

  // Check if Can Message (subscription check)
  canMessage: (receiverId: string) =>
    apiClient.get<AdryApiResponse<{ 
      canMessage: boolean;
      reason?: string;
      subscriptionStatus?: string;
    }>>(`/messages/can-message/${receiverId}`),
};
