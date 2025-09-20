import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Paywall middleware to check subscription status
export async function checkSubscriptionAccess(request: NextRequest): Promise<NextResponse | null> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Access denied. Employer subscription required.' }, { status: 403 });
    }

    // Check for active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        employerId: session.user.id,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return NextResponse.json({ 
        error: 'Active subscription required',
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'You need an active subscription to access this feature. Please subscribe to continue.',
      }, { status: 403 });
    }

    // Check if subscription is expired
    if (subscription.expiresAt < new Date()) {
      // Update subscription status to expired
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'EXPIRED' },
      });

      return NextResponse.json({ 
        error: 'Subscription expired',
        code: 'SUBSCRIPTION_EXPIRED',
        message: 'Your subscription has expired. Please renew to continue.',
      }, { status: 403 });
    }

    // Subscription is valid, allow access
    return null;
  } catch (error) {
    console.error('Paywall check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Check if subscription allows new messages (not read-only)
export async function checkMessageAccess(request: NextRequest): Promise<NextResponse | null> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Access denied. Employer subscription required.' }, { status: 403 });
    }

    // Check for active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        employerId: session.user.id,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return NextResponse.json({ 
        error: 'Active subscription required for messaging',
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'You need an active subscription to send messages. Please subscribe to continue.',
      }, { status: 403 });
    }

    // Check if subscription is expired
    if (subscription.expiresAt < new Date()) {
      // Update subscription status to expired
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'EXPIRED' },
      });

      return NextResponse.json({ 
        error: 'Subscription expired - read-only mode',
        code: 'READ_ONLY_MODE',
        message: 'Your subscription has expired. You can view existing messages but cannot send new ones. Please renew to continue messaging.',
      }, { status: 403 });
    }

    // Subscription is valid, allow messaging
    return null;
  } catch (error) {
    console.error('Message access check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Check if subscription allows interview scheduling
export async function checkInterviewAccess(request: NextRequest): Promise<NextResponse | null> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Access denied. Employer subscription required.' }, { status: 403 });
    }

    // Check for active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        employerId: session.user.id,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return NextResponse.json({ 
        error: 'Active subscription required for interview scheduling',
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'You need an active subscription to schedule interviews. Please subscribe to continue.',
      }, { status: 403 });
    }

    // Check if subscription is expired
    if (subscription.expiresAt < new Date()) {
      // Update subscription status to expired
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'EXPIRED' },
      });

      return NextResponse.json({ 
        error: 'Subscription expired',
        code: 'SUBSCRIPTION_EXPIRED',
        message: 'Your subscription has expired. Please renew to schedule interviews.',
      }, { status: 403 });
    }

    // Subscription is valid, allow interview scheduling
    return null;
  } catch (error) {
    console.error('Interview access check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get subscription status for UI
export async function getSubscriptionStatus(userId: string) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        employerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return {
        hasSubscription: false,
        status: null,
        expiresAt: null,
        isActive: false,
        isExpired: false,
        isReadOnly: false,
      };
    }

    const now = new Date();
    const isActive = subscription.status === 'ACTIVE' && subscription.expiresAt > now;
    const isExpired = subscription.expiresAt < now;
    const isReadOnly = subscription.status === 'EXPIRED' || isExpired;

    return {
      hasSubscription: true,
      status: subscription.status,
      expiresAt: subscription.expiresAt,
      isActive,
      isExpired,
      isReadOnly,
    };
  } catch (error) {
    console.error('Get subscription status error:', error);
    return {
      hasSubscription: false,
      status: null,
      expiresAt: null,
      isActive: false,
      isExpired: false,
      isReadOnly: false,
    };
  }
}

// Paywall UI components data
export function getPaywallData(subscriptionStatus: any) {
  if (!subscriptionStatus.hasSubscription) {
    return {
      title: 'Subscription Required',
      message: 'You need an active subscription to access this feature.',
      action: 'Subscribe Now',
      actionUrl: '/employer/subscribe',
      icon: '🔒',
    };
  }

  if (subscriptionStatus.isExpired || subscriptionStatus.isReadOnly) {
    return {
      title: 'Subscription Expired',
      message: 'Your subscription has expired. Please renew to continue using all features.',
      action: 'Renew Subscription',
      actionUrl: '/employer/subscribe',
      icon: '⏰',
    };
  }

  if (subscriptionStatus.status === 'PAST_DUE') {
    return {
      title: 'Payment Past Due',
      message: 'Your payment is past due. Please update your payment method to continue.',
      action: 'Update Payment',
      actionUrl: '/employer/billing',
      icon: '💳',
    };
  }

  return null; // No paywall needed
}
