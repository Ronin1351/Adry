import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payments/payment-providers-m3';
import { prisma } from '@/lib/db';

// Webhook handler for all payment providers
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = request.headers;
    
    // Determine provider from headers or body
    const provider = determineProvider(headers, body);
    
    if (!provider) {
      return NextResponse.json({ error: 'Unknown payment provider' }, { status: 400 });
    }

    // Verify webhook signature
    const signature = headers.get('stripe-signature') || 
                     headers.get('paypal-transmission-id') || 
                     headers.get('gcash-signature') || '';
    
    const isValid = await paymentService.verifyWebhook(provider, body, signature);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    // Parse event based on provider
    const event = parseEvent(provider, body);
    
    // Handle the webhook event
    const result = await paymentService.handleWebhook(provider, event);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
    }

    // Process the specific action
    await processWebhookAction(provider, event, result.action);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Determine payment provider from headers
function determineProvider(headers: Headers, body: string): 'STRIPE' | 'PAYPAL' | 'GCASH' | null {
  if (headers.get('stripe-signature')) {
    return 'STRIPE';
  }
  if (headers.get('paypal-transmission-id')) {
    return 'PAYPAL';
  }
  if (headers.get('gcash-signature')) {
    return 'GCASH';
  }
  
  // Try to determine from body content
  try {
    const data = JSON.parse(body);
    if (data.type && data.type.startsWith('stripe')) return 'STRIPE';
    if (data.event_type && data.event_type.startsWith('paypal')) return 'PAYPAL';
    if (data.event && data.event.startsWith('gcash')) return 'GCASH';
  } catch {
    // Ignore JSON parse errors
  }
  
  return null;
}

// Parse event based on provider
function parseEvent(provider: string, body: string): any {
  try {
    return JSON.parse(body);
  } catch {
    return { raw: body };
  }
}

// Process webhook actions
async function processWebhookAction(provider: string, event: any, action?: string) {
  try {
    switch (action) {
      case 'payment_succeeded':
        await handlePaymentSucceeded(provider, event);
        break;
      case 'payment_failed':
        await handlePaymentFailed(provider, event);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(provider, event);
        break;
      case 'subscription_canceled':
        await handleSubscriptionCanceled(provider, event);
        break;
      case 'payment_completed':
        await handlePaymentCompleted(provider, event);
        break;
      default:
        console.log(`Unknown webhook action: ${action}`);
    }
  } catch (error) {
    console.error('Error processing webhook action:', error);
  }
}

// Handle successful payment
async function handlePaymentSucceeded(provider: string, event: any) {
  try {
    const subscriptionId = extractSubscriptionId(provider, event);
    const paymentId = extractPaymentId(provider, event);
    const amount = extractAmount(provider, event);
    const employerId = extractEmployerId(provider, event);

    if (!subscriptionId || !employerId) {
      console.error('Missing required data for payment succeeded');
      return;
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update subscription status
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
      });

      // Create billing history record
      await tx.billingHistory.create({
        data: {
          employerId,
          subscriptionId,
          amount,
          provider: provider as any,
          providerPaymentId: paymentId,
          status: 'PAID',
          paidAt: new Date(),
        },
      });
    });

    console.log(`Payment succeeded for employer ${employerId}, subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailed(provider: string, event: any) {
  try {
    const subscriptionId = extractSubscriptionId(provider, event);
    const paymentId = extractPaymentId(provider, event);
    const employerId = extractEmployerId(provider, event);

    if (!subscriptionId || !employerId) {
      console.error('Missing required data for payment failed');
      return;
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update subscription status
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'PAST_DUE',
          updatedAt: new Date(),
        },
      });

      // Create billing history record
      await tx.billingHistory.create({
        data: {
          employerId,
          subscriptionId,
          amount: 0,
          provider: provider as any,
          providerPaymentId: paymentId,
          status: 'FAILED',
        },
      });
    });

    console.log(`Payment failed for employer ${employerId}, subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
    throw error;
  }
}

// Handle subscription update
async function handleSubscriptionUpdated(provider: string, event: any) {
  try {
    const subscriptionId = extractSubscriptionId(provider, event);
    const status = extractSubscriptionStatus(provider, event);

    if (!subscriptionId || !status) {
      console.error('Missing required data for subscription update');
      return;
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: status as any,
        updatedAt: new Date(),
      },
    });

    console.log(`Subscription updated: ${subscriptionId}, status: ${status}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

// Handle subscription cancellation
async function handleSubscriptionCanceled(provider: string, event: any) {
  try {
    const subscriptionId = extractSubscriptionId(provider, event);

    if (!subscriptionId) {
      console.error('Missing subscription ID for cancellation');
      return;
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELED',
        updatedAt: new Date(),
      },
    });

    console.log(`Subscription canceled: ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

// Handle payment completed (generic)
async function handlePaymentCompleted(provider: string, event: any) {
  try {
    const subscriptionId = extractSubscriptionId(provider, event);
    const paymentId = extractPaymentId(provider, event);
    const amount = extractAmount(provider, event);
    const employerId = extractEmployerId(provider, event);

    if (!subscriptionId || !employerId) {
      console.error('Missing required data for payment completed');
      return;
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update subscription status
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
      });

      // Create billing history record
      await tx.billingHistory.create({
        data: {
          employerId,
          subscriptionId,
          amount,
          provider: provider as any,
          providerPaymentId: paymentId,
          status: 'PAID',
          paidAt: new Date(),
        },
      });
    });

    console.log(`Payment completed for employer ${employerId}, subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment completed:', error);
    throw error;
  }
}

// Helper functions to extract data from webhook events
function extractSubscriptionId(provider: string, event: any): string | null {
  switch (provider) {
    case 'STRIPE':
      return event.data?.object?.id || event.data?.object?.subscription;
    case 'PAYPAL':
      return event.resource?.id || event.resource?.subscription_id;
    case 'GCASH':
      return event.data?.subscription_id || event.data?.id;
    default:
      return null;
  }
}

function extractPaymentId(provider: string, event: any): string | null {
  switch (provider) {
    case 'STRIPE':
      return event.data?.object?.payment_intent || event.data?.object?.id;
    case 'PAYPAL':
      return event.resource?.id || event.resource?.payment_id;
    case 'GCASH':
      return event.data?.payment_id || event.data?.id;
    default:
      return null;
  }
}

function extractAmount(provider: string, event: any): number {
  switch (provider) {
    case 'STRIPE':
      return (event.data?.object?.amount_total || 0) / 100; // Convert from cents
    case 'PAYPAL':
      return parseFloat(event.resource?.amount?.total || '0');
    case 'GCASH':
      return parseFloat(event.data?.amount || '0');
    default:
      return 0;
  }
}

function extractEmployerId(provider: string, event: any): string | null {
  switch (provider) {
    case 'STRIPE':
      return event.data?.object?.metadata?.employerId;
    case 'PAYPAL':
      return event.resource?.custom_id || event.resource?.metadata?.employerId;
    case 'GCASH':
      return event.data?.metadata?.employerId || event.data?.custom_id;
    default:
      return null;
  }
}

function extractSubscriptionStatus(provider: string, event: any): string | null {
  switch (provider) {
    case 'STRIPE':
      return event.data?.object?.status;
    case 'PAYPAL':
      return event.resource?.status;
    case 'GCASH':
      return event.data?.status;
    default:
      return null;
  }
}
