import Stripe from 'stripe';
import { db } from './db';

// Stripe configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: 'price_basic_monthly',
    name: 'Basic Plan',
    price: 600, // ₱600
    currency: 'php',
    interval: 'month',
    intervalCount: 3, // Every 3 months
    features: [
      'Unlimited messaging with housekeepers',
      'Schedule interviews',
      'View full contact details',
      'Access to verified profiles',
      'Advanced search filters',
    ],
  },
} as const;

// Create Stripe customer
export async function createStripeCustomer(userId: string, email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  return customer;
}

// Create subscription
export async function createSubscription(
  customerId: string,
  priceId: string,
  paymentMethodId: string
) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    default_payment_method: paymentMethodId,
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription;
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });

  return updatedSubscription;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

// Create checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

// Handle webhook events
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionChange(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

// Handle subscription changes
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const user = await db.user.findFirst({
    where: {
      employer: {
        stripeCustomerId: customerId,
      },
    },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const status = subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE';
  const expiresAt = new Date(subscription.current_period_end * 1000);

  await db.subscription.upsert({
    where: {
      providerRef: subscription.id,
    },
    update: {
      status,
      expiresAt,
    },
    create: {
      employerId: user.id,
      status,
      expiresAt,
      provider: 'stripe',
      providerRef: subscription.id,
    },
  });

  console.log(`Subscription ${subscription.id} updated for user ${user.id}`);
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db.subscription.updateMany({
    where: {
      providerRef: subscription.id,
    },
    data: {
      status: 'CANCELED',
    },
  });

  console.log(`Subscription ${subscription.id} canceled`);
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await db.subscription.findFirst({
    where: {
      providerRef: invoice.subscription as string,
    },
  });

  if (subscription) {
    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: 'ACTIVE' },
    });

    console.log(`Payment succeeded for subscription ${subscription.id}`);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await db.subscription.findFirst({
    where: {
      providerRef: invoice.subscription as string,
    },
  });

  if (subscription) {
    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: 'PAST_DUE' },
    });

    console.log(`Payment failed for subscription ${subscription.id}`);
  }
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await db.subscription.findFirst({
    where: {
      employerId: userId,
      status: 'ACTIVE',
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  return !!subscription;
}

// Get subscription status
export async function getSubscriptionStatus(userId: string) {
  const subscription = await db.subscription.findFirst({
    where: {
      employerId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!subscription) {
    return {
      hasActiveSubscription: false,
      canMessage: false,
      canSchedule: false,
      expiresAt: null,
    };
  }

  const isActive = subscription.status === 'ACTIVE' && subscription.expiresAt > new Date();

  return {
    hasActiveSubscription: isActive,
    canMessage: isActive,
    canSchedule: isActive,
    expiresAt: subscription.expiresAt,
    status: subscription.status,
  };
}
