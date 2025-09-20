import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createSavedSearchSchema = z.object({
  name: z.string().min(1).max(100),
  paramsJson: z.record(z.any()),
});

const updateSavedSearchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  paramsJson: z.record(z.any()).optional(),
});

// GET /api/saved-searches - Get user's saved searches
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        paramsJson: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ savedSearches });
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
      { status: 500 }
    );
  }
}

// POST /api/saved-searches - Create new saved search
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, paramsJson } = createSavedSearchSchema.parse(body);

    // Check if user already has a saved search with this name
    const existingSearch = await prisma.savedSearch.findFirst({
      where: {
        userId: session.user.id,
        name: name,
      },
    });

    if (existingSearch) {
      return NextResponse.json(
        { error: 'A saved search with this name already exists' },
        { status: 409 }
      );
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: session.user.id,
        name,
        paramsJson,
      },
      select: {
        id: true,
        name: true,
        paramsJson: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ savedSearch }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating saved search:', error);
    return NextResponse.json(
      { error: 'Failed to create saved search' },
      { status: 500 }
    );
  }
}
