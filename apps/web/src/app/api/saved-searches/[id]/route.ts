import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateSavedSearchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  paramsJson: z.record(z.any()).optional(),
});

// GET /api/saved-searches/[id] - Get specific saved search
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedSearch = await prisma.savedSearch.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        paramsJson: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!savedSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }

    return NextResponse.json({ savedSearch });
  } catch (error) {
    console.error('Error fetching saved search:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved search' },
      { status: 500 }
    );
  }
}

// PUT /api/saved-searches/[id] - Update saved search
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateData = updateSavedSearchSchema.parse(body);

    // Check if saved search exists and belongs to user
    const existingSearch = await prisma.savedSearch.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }

    // Check if name is being changed and if new name already exists
    if (updateData.name && updateData.name !== existingSearch.name) {
      const nameExists = await prisma.savedSearch.findFirst({
        where: {
          userId: session.user.id,
          name: updateData.name,
          id: { not: params.id },
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'A saved search with this name already exists' },
          { status: 409 }
        );
      }
    }

    const savedSearch = await prisma.savedSearch.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        paramsJson: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ savedSearch });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating saved search:', error);
    return NextResponse.json(
      { error: 'Failed to update saved search' },
      { status: 500 }
    );
  }
}

// DELETE /api/saved-searches/[id] - Delete saved search
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if saved search exists and belongs to user
    const existingSearch = await prisma.savedSearch.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }

    await prisma.savedSearch.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return NextResponse.json(
      { error: 'Failed to delete saved search' },
      { status: 500 }
    );
  }
}
