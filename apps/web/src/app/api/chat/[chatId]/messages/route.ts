import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkMessageAccess, getSubscriptionStatus } from '@/lib/middleware/paywall-m3';

// GET /api/chat/[chatId]/messages - Get messages for a chat
export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          { employerId: session.user.id },
          { employeeId: session.user.id },
        ],
      },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Get messages
    const messages = await prisma.chatMessage.findMany({
      where: { chatId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chat/[chatId]/messages - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = params;
    const { body } = await request.json();

    if (!body || body.trim().length === 0) {
      return NextResponse.json({ error: 'Message body is required' }, { status: 400 });
    }

    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          { employerId: session.user.id },
          { employeeId: session.user.id },
        ],
      },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Check if user is employer and has active subscription
    if (session.user.role === 'EMPLOYER') {
      const subscriptionStatus = await getSubscriptionStatus(session.user.id);
      
      if (!subscriptionStatus.hasSubscription) {
        return NextResponse.json({ 
          error: 'Active subscription required for messaging',
          code: 'SUBSCRIPTION_REQUIRED',
          message: 'You need an active subscription to send messages. Please subscribe to continue.',
        }, { status: 403 });
      }

      if (subscriptionStatus.isReadOnly) {
        return NextResponse.json({ 
          error: 'Subscription expired - read-only mode',
          code: 'READ_ONLY_MODE',
          message: 'Your subscription has expired. You can view existing messages but cannot send new ones. Please renew to continue messaging.',
        }, { status: 403 });
      }
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        chatId,
        senderId: session.user.id,
        body: body.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
