import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { employerProfileSchema, employerProfileUpdateSchema } from '@/lib/validations/employer-profile-m3';
import { z } from 'zod';

// GET /api/employer-profile-m3 - Get current employer's profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can access this endpoint' }, { status: 403 });
    }

    const profile = await prisma.employerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
        billingHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        paymentMethods: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/employer-profile-m3 - Create new profile
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can create profiles' }, { status: 403 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.employerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 });
    }

    const body = await request.json();
    const validatedData = employerProfileSchema.parse(body);

    const profile = await prisma.employerProfile.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating employer profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/employer-profile-m3 - Update profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can update profiles' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = employerProfileUpdateSchema.parse(body);

    // Get existing profile
    const existingProfile = await prisma.employerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = await prisma.employerProfile.update({
      where: { userId: session.user.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating employer profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/employer-profile-m3 - Delete profile
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can delete profiles' }, { status: 403 });
    }

    const profile = await prisma.employerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    await prisma.employerProfile.delete({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting employer profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
