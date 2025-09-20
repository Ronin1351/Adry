import { apiClient } from './client';
import { Subscription, ApiResponse } from '../types';

export const paymentAPI = {
  createSubscription: (data: { priceId: string; paymentMethodId: string }) =>
    apiClient.post<ApiResponse<Subscription>>('/payments/subscription', data),

  getSubscription: () =>
    apiClient.get<ApiResponse<Subscription>>('/payments/subscription'),

  updateSubscription: (data: { subscriptionId: string; priceId: string }) =>
    apiClient.put<ApiResponse<Subscription>>('/payments/subscription', data),

  cancelSubscription: (subscriptionId: string) =>
    apiClient.delete<ApiResponse<null>>(`/payments/subscription/${subscriptionId}`),

  getPaymentMethods: () =>
    apiClient.get<ApiResponse<any[]>>('/payments/methods'),

  addPaymentMethod: (data: { paymentMethodId: string }) =>
    apiClient.post<ApiResponse<any>>('/payments/methods', data),

  removePaymentMethod: (paymentMethodId: string) =>
    apiClient.delete<ApiResponse<null>>(`/payments/methods/${paymentMethodId}`),

  getInvoices: (params: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<any[]>>('/payments/invoices', { params }),

  getPaymentHistory: (params: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<any[]>>('/payments/history', { params }),

  createCheckoutSession: (data: { priceId: string; successUrl: string; cancelUrl: string }) =>
    apiClient.post<ApiResponse<{ sessionId: string; url: string }>>('/payments/checkout', data),

  getCheckoutSession: (sessionId: string) =>
    apiClient.get<ApiResponse<any>>(`/payments/checkout/${sessionId}`),
};
