import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkMessageAccess } from '@/lib/middleware/paywall-m3';

// GET /api/chat - Get chats for employer
export async function GET(request: NextRequest) {
  try {
    // Check subscription access
    const paywallResponse = await checkMessageAccess(request);
    if (paywallResponse) {
      return paywallResponse;
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    const chats = await prisma.chat.findMany({
      where: {
        employerId: session.user.id,
      },
      include: {
        employee: {
          include: {
            employeeProfile: {
              select: {
                firstName: true,
                lastName: true,
                photoUrl: true,
                city: true,
                province: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chat - Create new chat
export async function POST(request: NextRequest) {
  try {
    // Check subscription access
    const paywallResponse = await checkMessageAccess(request);
    if (paywallResponse) {
      return paywallResponse;
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { employeeId } = await request.json();

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        employerId: session.user.id,
        employeeId,
      },
    });

    if (existingChat) {
      return NextResponse.json(existingChat);
    }

    // Create new chat
    const chat = await prisma.chat.create({
      data: {
        employerId: session.user.id,
        employeeId,
      },
      include: {
        employee: {
          include: {
            employeeProfile: {
              select: {
                firstName: true,
                lastName: true,
                photoUrl: true,
                city: true,
                province: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
