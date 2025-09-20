import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const savedSearchSchema = z.object({
  name: z.string().min(1, 'Search name is required').max(100, 'Search name too long'),
  filters: z.object({
    query: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    skills: z.array(z.string()).optional(),
    employmentType: z.enum(['LIVE_IN', 'LIVE_OUT', 'BOTH']).optional(),
    yearsOfExperience: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    salaryRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    availabilityDate: z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    }).optional(),
    sortBy: z.enum(['relevance', 'newest', 'salary_high', 'salary_low', 'experience_high', 'experience_low']).optional(),
  }),
  isDefault: z.boolean().optional().default(false),
});

// GET /api/employer-profile-m3/saved-searches - Get saved searches
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can access saved searches' }, { status: 403 });
    }

    const savedSearches = await prisma.searchFilter.findMany({
      where: { employerId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(savedSearches);
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/employer-profile-m3/saved-searches - Create saved search
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can create saved searches' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = savedSearchSchema.parse(body);

    // If this is being set as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.searchFilter.updateMany({
        where: { 
          employerId: session.user.id,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const savedSearch = await prisma.searchFilter.create({
      data: {
        employerId: session.user.id,
        name: validatedData.name,
        filters: validatedData.filters,
        isDefault: validatedData.isDefault || false,
      },
    });

    return NextResponse.json(savedSearch, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating saved search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/employer-profile-m3/saved-searches - Update saved search
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can update saved searches' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Search ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existingSearch = await prisma.searchFilter.findFirst({
      where: { 
        id,
        employerId: session.user.id,
      },
    });

    if (!existingSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }

    // If this is being set as default, unset other defaults
    if (updateData.isDefault) {
      await prisma.searchFilter.updateMany({
        where: { 
          employerId: session.user.id,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const validatedData = savedSearchSchema.partial().parse(updateData);
    
    const updatedSearch = await prisma.searchFilter.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedSearch);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating saved search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/employer-profile-m3/saved-searches - Delete saved search
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Only employers can delete saved searches' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Search ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existingSearch = await prisma.searchFilter.findFirst({
      where: { 
        id,
        employerId: session.user.id,
      },
    });

    if (!existingSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }

    await prisma.searchFilter.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Saved search deleted successfully' });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
