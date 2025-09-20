import Stripe from 'stripe';

// Payment provider configuration
export const PAYMENT_CONFIG = {
  STRIPE: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  PAYPAL: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
    webhookId: process.env.PAYPAL_WEBHOOK_ID!,
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
  },
  GCASH: {
    publicKey: process.env.NEXT_PUBLIC_GCASH_PUBLIC_KEY!,
    secretKey: process.env.GCASH_SECRET_KEY!,
    webhookSecret: process.env.GCASH_WEBHOOK_SECRET!,
    environment: process.env.GCASH_ENVIRONMENT || 'sandbox',
  },
};

// Initialize Stripe
const stripe = new Stripe(PAYMENT_CONFIG.STRIPE.secretKey, {
  apiVersion: '2023-10-16',
});

// Payment provider types
export type PaymentProvider = 'STRIPE' | 'PAYPAL' | 'GCASH';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELED';

// Subscription data interface
export interface SubscriptionData {
  employerId: string;
  amount: number;
  currency: string;
  period: string;
  provider: PaymentProvider;
}

// Payment result interface
export interface PaymentResult {
  success: boolean;
  subscriptionId?: string;
  paymentId?: string;
  clientSecret?: string;
  redirectUrl?: string;
  error?: string;
}

// Stripe payment methods
export class StripeProvider {
  async createSubscription(data: SubscriptionData): Promise<PaymentResult> {
    try {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: data.employerId, // This should be the employer's email
        metadata: {
          employerId: data.employerId,
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price_data: {
            currency: data.currency.toLowerCase(),
            product_data: {
              name: 'Adry Employer Subscription',
              description: '3-month subscription for employer features',
            },
            unit_amount: data.amount * 100, // Convert to cents
            recurring: {
              interval: 'month',
              interval_count: 3,
            },
          },
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return {
        success: true,
        subscriptionId: subscription.id,
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Stripe subscription creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createPaymentIntent(amount: number, currency: string, employerId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          employerId,
        },
      });

      return {
        success: true,
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        PAYMENT_CONFIG.STRIPE.webhookSecret
      );
      return !!event;
    } catch (error) {
      console.error('Stripe webhook verification failed:', error);
      return false;
    }
  }

  async handleWebhook(event: Stripe.Event): Promise<{ success: boolean; action?: string }> {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          // Handle successful payment
          return { success: true, action: 'payment_succeeded' };
        case 'invoice.payment_failed':
          // Handle failed payment
          return { success: true, action: 'payment_failed' };
        case 'customer.subscription.updated':
          // Handle subscription update
          return { success: true, action: 'subscription_updated' };
        case 'customer.subscription.deleted':
          // Handle subscription cancellation
          return { success: true, action: 'subscription_canceled' };
        default:
          return { success: true, action: 'unknown' };
      }
    } catch (error) {
      console.error('Stripe webhook handling failed:', error);
      return { success: false };
    }
  }
}

// PayPal payment methods
export class PayPalProvider {
  async createSubscription(data: SubscriptionData): Promise<PaymentResult> {
    try {
      // This would integrate with PayPal SDK
      // For now, return a mock response
      const subscriptionId = `paypal_sub_${Date.now()}`;
      const paymentId = `paypal_pay_${Date.now()}`;
      
      return {
        success: true,
        subscriptionId,
        paymentId,
        redirectUrl: `https://paypal.com/checkout/${paymentId}`,
      };
    } catch (error) {
      console.error('PayPal subscription creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyWebhook(payload: any, headers: any): Promise<boolean> {
    try {
      // PayPal webhook verification logic
      return true; // Simplified for now
    } catch (error) {
      console.error('PayPal webhook verification failed:', error);
      return false;
    }
  }

  async handleWebhook(event: any): Promise<{ success: boolean; action?: string }> {
    try {
      // Handle PayPal webhook events
      return { success: true, action: 'payment_completed' };
    } catch (error) {
      console.error('PayPal webhook handling failed:', error);
      return { success: false };
    }
  }
}

// GCash payment methods (via Xendit/PayMongo)
export class GCashProvider {
  async createSubscription(data: SubscriptionData): Promise<PaymentResult> {
    try {
      // This would integrate with GCash via Xendit or PayMongo
      // For now, return a mock response
      const subscriptionId = `gcash_sub_${Date.now()}`;
      const paymentId = `gcash_pay_${Date.now()}`;
      
      return {
        success: true,
        subscriptionId,
        paymentId,
        redirectUrl: `https://gcash.com/checkout/${paymentId}`,
      };
    } catch (error) {
      console.error('GCash subscription creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyWebhook(payload: any, headers: any): Promise<boolean> {
    try {
      // GCash webhook verification logic
      return true; // Simplified for now
    } catch (error) {
      console.error('GCash webhook verification failed:', error);
      return false;
    }
  }

  async handleWebhook(event: any): Promise<{ success: boolean; action?: string }> {
    try {
      // Handle GCash webhook events
      return { success: true, action: 'payment_completed' };
    } catch (error) {
      console.error('GCash webhook handling failed:', error);
      return { success: false };
    }
  }
}

// Payment provider factory
export class PaymentProviderFactory {
  static createProvider(provider: PaymentProvider) {
    switch (provider) {
      case 'STRIPE':
        return new StripeProvider();
      case 'PAYPAL':
        return new PayPalProvider();
      case 'GCASH':
        return new GCashProvider();
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}

// Unified payment service
export class PaymentService {
  async createSubscription(provider: PaymentProvider, data: SubscriptionData): Promise<PaymentResult> {
    const paymentProvider = PaymentProviderFactory.createProvider(provider);
    return await paymentProvider.createSubscription(data);
  }

  async verifyWebhook(provider: PaymentProvider, payload: string | any, signature: string | any): Promise<boolean> {
    const paymentProvider = PaymentProviderFactory.createProvider(provider);
    return await paymentProvider.verifyWebhook(payload, signature);
  }

  async handleWebhook(provider: PaymentProvider, event: any): Promise<{ success: boolean; action?: string }> {
    const paymentProvider = PaymentProviderFactory.createProvider(provider);
    return await paymentProvider.handleWebhook(event);
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
