import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkInterviewAccess } from '@/lib/middleware/paywall-m3';
import { z } from 'zod';

const interviewSchema = z.object({
  employeeId: z.string(),
  startsAt: z.string().datetime(),
  notes: z.string().optional(),
});

// GET /api/interviews - Get interviews for employer
export async function GET(request: NextRequest) {
  try {
    // Check subscription access
    const paywallResponse = await checkInterviewAccess(request);
    if (paywallResponse) {
      return paywallResponse;
    }

    const session = await auth();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const interviews = await prisma.interview.findMany({
      where: {
        employerId: session!.user!.id,
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
      orderBy: { startsAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/interviews - Schedule new interview
export async function POST(request: NextRequest) {
  try {
    // Check subscription access
    const paywallResponse = await checkInterviewAccess(request);
    if (paywallResponse) {
      return paywallResponse;
    }

    const session = await auth();
    const body = await request.json();
    const { employeeId, startsAt, notes } = interviewSchema.parse(body);

    // Verify employee exists
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      include: {
        employeeProfile: {
          select: {
            firstName: true,
            lastName: true,
            city: true,
            province: true,
          },
        },
      },
    });

    if (!employee || !employee.employeeProfile) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if interview time is in the future
    const interviewDate = new Date(startsAt);
    if (interviewDate <= new Date()) {
      return NextResponse.json({ error: 'Interview must be scheduled in the future' }, { status: 400 });
    }

    // Create interview
    const interview = await prisma.interview.create({
      data: {
        employerId: session!.user!.id,
        employeeId,
        startsAt: interviewDate,
        notes,
        status: 'SCHEDULED',
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

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error scheduling interview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
