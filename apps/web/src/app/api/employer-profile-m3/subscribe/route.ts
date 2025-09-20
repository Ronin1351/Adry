import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { paymentService } from '@/lib/payments/payment-providers-m3';
import { z } from 'zod';

const subscribeSchema = z.object({
  provider: z.enum(['STRIPE', 'PAYPAL', 'GCASH']),
  paymentMethodId: z.string().optional(),
});

// POST /api/employer-profile-m3/subscribe - Create subscription
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can subscribe' }, { status: 403 });
    }

    const body = await request.json();
    const { provider, paymentMethodId } = subscribeSchema.parse(body);

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        employerId: session.user.id,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingSubscription) {
      return NextResponse.json({ 
        error: 'Active subscription already exists',
        subscriptionId: existingSubscription.id,
      }, { status: 409 });
    }

    // Create subscription data
    const subscriptionData = {
      employerId: session.user.id,
      amount: 600, // ₱600
      currency: 'PHP',
      period: '3 months',
      provider,
    };

    // Create subscription with payment provider
    const paymentResult = await paymentService.createSubscription(provider, subscriptionData);

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment processing failed' },
        { status: 400 }
      );
    }

    // Calculate expiry date (3 months from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    // Create subscription record in database
    const subscription = await prisma.subscription.create({
      data: {
        employerId: session.user.id,
        status: 'PENDING',
        expiresAt,
        provider,
        providerSubscriptionId: paymentResult.subscriptionId,
      },
    });

    // Create billing history record
    await prisma.billingHistory.create({
      data: {
        employerId: session.user.id,
        subscriptionId: subscription.id,
        amount: 600,
        provider,
        providerPaymentId: paymentResult.paymentId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentResult.clientSecret,
      redirectUrl: paymentResult.redirectUrl,
      message: 'Subscription created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/employer-profile-m3/subscribe - Update subscription
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can update subscriptions' }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'renew') {
      // Renew subscription
      const subscription = await prisma.subscription.findFirst({
        where: {
          employerId: session.user.id,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!subscription) {
        return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
      }

      // Calculate new expiry date
      const newExpiresAt = new Date();
      newExpiresAt.setMonth(newExpiresAt.getMonth() + 3);

      // Update subscription
      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'ACTIVE',
          expiresAt: newExpiresAt,
          updatedAt: new Date(),
        },
      });

      // Create billing history record
      await prisma.billingHistory.create({
        data: {
          employerId: session.user.id,
          subscriptionId: subscription.id,
          amount: 600,
          provider: subscription.provider,
          status: 'PAID',
          paidAt: new Date(),
        },
      });

      return NextResponse.json({
        message: 'Subscription renewed successfully',
        subscription: updatedSubscription,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/employer-profile-m3/subscribe - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can cancel subscriptions' }, { status: 403 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        employerId: session.user.id,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Update subscription status
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Subscription canceled successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
