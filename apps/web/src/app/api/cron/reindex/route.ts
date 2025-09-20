import { NextRequest, NextResponse } from 'next/server';
import { runDailyReindex, runIncrementalReindex } from '@/lib/jobs/reindex-job';

// POST /api/cron/reindex - Daily reindex job
export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await request.json().catch(() => ({}));
    
    switch (type) {
      case 'daily':
        await runDailyReindex();
        break;
      case 'incremental':
        await runIncrementalReindex();
        break;
      default:
        // Default to incremental for regular cron calls
        await runIncrementalReindex();
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Reindex job completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron reindex job failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
