import { apiClient } from '../client';
import { Subscription, AdryApiResponse } from '../../types/adry';

export const adrySubscriptionAPI = {
  // Create Subscription
  createSubscription: (data: { 
    priceId: string; 
    paymentMethodId: string;
    employerId: string;
  }) =>
    apiClient.post<AdryApiResponse<Subscription>>('/subscriptions', data),

  // Get Employer Subscription
  getSubscription: (employerId: string) =>
    apiClient.get<AdryApiResponse<Subscription>>(`/subscriptions/employer/${employerId}`),

  // Update Subscription
  updateSubscription: (subscriptionId: string, data: { 
    priceId?: string;
    paymentMethodId?: string;
  }) =>
    apiClient.put<AdryApiResponse<Subscription>>(`/subscriptions/${subscriptionId}`, data),

  // Cancel Subscription
  cancelSubscription: (subscriptionId: string, reason?: string) =>
    apiClient.patch<AdryApiResponse<{ cancelledAt: string }>>(
      `/subscriptions/${subscriptionId}/cancel`,
      { reason }
    ),

  // Reactivate Subscription
  reactivateSubscription: (subscriptionId: string) =>
    apiClient.patch<AdryApiResponse<Subscription>>(
      `/subscriptions/${subscriptionId}/reactivate`
    ),

  // Get Subscription Status
  getSubscriptionStatus: (employerId: string) =>
    apiClient.get<AdryApiResponse<{ 
      hasActiveSubscription: boolean;
      canMessage: boolean;
      canSchedule: boolean;
      expiresAt?: string;
    }>>(`/subscriptions/employer/${employerId}/status`),

  // Create Checkout Session
  createCheckoutSession: (data: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    employerId: string;
  }) =>
    apiClient.post<AdryApiResponse<{ sessionId: string; url: string }>>(
      '/subscriptions/checkout',
      data
    ),

  // Get Billing History
  getBillingHistory: (employerId: string, params: { page?: number; limit?: number }) =>
    apiClient.get<AdryApiResponse<{ data: any[]; pagination: any }>>(
      `/subscriptions/employer/${employerId}/billing`,
      { params }
    ),

  // Update Payment Method
  updatePaymentMethod: (subscriptionId: string, paymentMethodId: string) =>
    apiClient.patch<AdryApiResponse<{ updated: boolean }>>(
      `/subscriptions/${subscriptionId}/payment-method`,
      { paymentMethodId }
    ),

  // Get Subscription Plans
  getSubscriptionPlans: () =>
    apiClient.get<AdryApiResponse<{ 
      id: string;
      name: string;
      price: number;
      currency: string;
      interval: string;
      features: string[];
    }[]>>('/subscriptions/plans'),
};
