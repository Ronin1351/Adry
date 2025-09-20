import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { searchSyncService } from '@/lib/search/sync-service';
import { z } from 'zod';

const syncRequestSchema = z.object({
  type: z.enum(['single', 'batch', 'full', 'remove']),
  userId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
});

// POST /api/search/sync - Sync search index
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check authentication
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions (admin or employer)
    if (!['ADMIN', 'EMPLOYER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { type, userId, userIds } = syncRequestSchema.parse(body);

    switch (type) {
      case 'single':
        if (!userId) {
          return NextResponse.json({ error: 'userId required for single sync' }, { status: 400 });
        }
        await searchSyncService.syncEmployeeProfile(userId);
        break;

      case 'batch':
        if (!userIds || userIds.length === 0) {
          return NextResponse.json({ error: 'userIds required for batch sync' }, { status: 400 });
        }
        await searchSyncService.syncEmployeeProfiles(userIds);
        break;

      case 'full':
        // Only admin can do full reindex
        if (session.user.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Admin access required for full reindex' }, { status: 403 });
        }
        await searchSyncService.reindexAll();
        break;

      case 'remove':
        if (!userId) {
          return NextResponse.json({ error: 'userId required for remove' }, { status: 400 });
        }
        await searchSyncService.removeEmployeeProfile(userId);
        break;

      default:
        return NextResponse.json({ error: 'Invalid sync type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Search sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/search/sync - Get sync status and stats
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can view stats
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const stats = await searchSyncService.getIndexStats();
    
    return NextResponse.json({ 
      success: true, 
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting sync stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
