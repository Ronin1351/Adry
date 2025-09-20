import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { employeeProfileSchema, employeeProfileUpdateSchema } from '@/lib/validations/employee-profile-m2';
import { z } from 'zod';

// GET /api/employee-profile-m2 - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.employeeProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        references: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/employee-profile-m2 - Create new profile
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employee
    if (session.user.role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Only employees can create profiles' }, { status: 403 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.employeeProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 });
    }

    const body = await request.json();
    const validatedData = employeeProfileSchema.parse(body);

    // Calculate profile completeness score
    const profileScore = calculateProfileScore(validatedData);

    const profile = await prisma.employeeProfile.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        profileScore,
        documents: {
          create: validatedData.documents || [],
        },
        references: {
          create: validatedData.references || [],
        },
      },
      include: {
        documents: true,
        references: true,
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

    console.error('Error creating employee profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/employee-profile-m2 - Update profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = employeeProfileUpdateSchema.parse(body);

    // Get existing profile to calculate updated score
    const existingProfile = await prisma.employeeProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Calculate updated profile completeness score
    const updatedData = { ...existingProfile, ...validatedData };
    const profileScore = calculateProfileScore(updatedData);

    const profile = await prisma.employeeProfile.update({
      where: { userId: session.user.id },
      data: {
        ...validatedData,
        profileScore,
        updatedAt: new Date(),
      },
      include: {
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        references: {
          orderBy: { createdAt: 'desc' },
        },
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

    console.error('Error updating employee profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/employee-profile-m2 - Delete profile
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.employeeProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    await prisma.employeeProfile.delete({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate profile completeness score
function calculateProfileScore(profile: any): number {
  let score = 0;
  const maxScore = 100;

  // Basic info (20%)
  if (profile.firstName && profile.lastName) score += 10;
  if (profile.age && profile.civilStatus) score += 10;

  // Professional (25%)
  if (profile.skills && profile.skills.length >= 3) score += 15;
  if (profile.experience !== undefined) score += 10;

  // Preferences (15%)
  if (profile.salaryMin && profile.salaryMax) score += 10;
  if (profile.employmentType) score += 5;

  // Documents (25%) - This would need to be calculated based on actual documents
  // For now, we'll assume 0 if no documents are provided
  if (profile.documents && profile.documents.length > 0) {
    const verifiedDocs = profile.documents.filter((doc: any) => doc.status === 'VERIFIED').length;
    score += Math.min(verifiedDocs * 5, 25);
  }

  // References (10%)
  if (profile.references && profile.references.length >= 1) score += 10;

  // Contact (5%)
  if (profile.phone && profile.email) score += 5;

  return Math.min(score, maxScore);
}
