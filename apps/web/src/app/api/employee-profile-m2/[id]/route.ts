import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { publicEmployeeProfileSchema, extendedEmployeeProfileSchema } from '@/lib/validations/employee-profile-m2';

// GET /api/employee-profile-m2/[id] - Get public or extended profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const profileId = params.id;

    // Get the profile with all relations
    const profile = await prisma.employeeProfile.findUnique({
      where: { userId: profileId },
      include: {
        documents: {
          where: { status: 'VERIFIED' }, // Only show verified documents
          orderBy: { createdAt: 'desc' },
        },
        references: {
          orderBy: { createdAt: 'desc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if profile is visible
    if (!profile.visibility) {
      return NextResponse.json({ error: 'Profile not available' }, { status: 404 });
    }

    // Determine access level based on user role and subscription
    let hasExtendedAccess = false;

    if (session?.user?.id) {
      // Check if user is admin
      if (session.user.role === 'ADMIN') {
        hasExtendedAccess = true;
      }
      // Check if user is employer with active subscription
      else if (session.user.role === 'EMPLOYER') {
        const activeSubscription = await prisma.subscription.findFirst({
          where: {
            employerId: session.user.id,
            status: 'ACTIVE',
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        hasExtendedAccess = !!activeSubscription;
      }
    }

    // Return appropriate data based on access level
    if (hasExtendedAccess) {
      // Return extended profile with private fields
      const extendedProfile = {
        ...profile,
        // Include private fields for subscribed employers
        lastName: profile.lastName,
        exactAddress: profile.exactAddress,
        phone: profile.phone,
        email: profile.email,
        documents: profile.documents,
        references: profile.references,
      };

      return NextResponse.json(extendedProfile);
    } else {
      // Return public profile with limited fields
      const publicProfile = {
        ...profile,
        // Hide private fields
        lastName: undefined,
        exactAddress: undefined,
        phone: undefined,
        email: undefined,
        documents: undefined,
        references: undefined,
      };

      return NextResponse.json(publicProfile);
    }
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
