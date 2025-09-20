import { searchSyncService } from '@/lib/search/sync-service';
import { prisma } from '@/lib/db';

// Daily reindex job
export async function runDailyReindex() {
  console.log('Starting daily reindex job...');
  
  try {
    // Get all visible employee profiles
    const profiles = await prisma.employeeProfile.findMany({
      where: { visibility: true },
      select: { userId: true },
    });

    console.log(`Found ${profiles.length} visible profiles to reindex`);

    if (profiles.length === 0) {
      console.log('No profiles to reindex');
      return;
    }

    // Batch reindex
    const userIds = profiles.map(p => p.userId);
    await searchSyncService.syncEmployeeProfiles(userIds);

    console.log('Daily reindex job completed successfully');
  } catch (error) {
    console.error('Daily reindex job failed:', error);
    throw error;
  }
}

// Incremental reindex for changed profiles
export async function runIncrementalReindex() {
  console.log('Starting incremental reindex job...');
  
  try {
    // Get profiles updated in the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const updatedProfiles = await prisma.employeeProfile.findMany({
      where: {
        updatedAt: {
          gte: yesterday,
        },
      },
      select: { userId: true },
    });

    console.log(`Found ${updatedProfiles.length} profiles updated in last 24 hours`);

    if (updatedProfiles.length === 0) {
      console.log('No profiles to reindex');
      return;
    }

    // Sync updated profiles
    const userIds = updatedProfiles.map(p => p.userId);
    await searchSyncService.syncEmployeeProfiles(userIds);

    console.log('Incremental reindex job completed successfully');
  } catch (error) {
    console.error('Incremental reindex job failed:', error);
    throw error;
  }
}

// Full reindex (admin only)
export async function runFullReindex() {
  console.log('Starting full reindex job...');
  
  try {
    await searchSyncService.reindexAll();
    console.log('Full reindex job completed successfully');
  } catch (error) {
    console.error('Full reindex job failed:', error);
    throw error;
  }
}

// Health check for search index
export async function checkSearchIndexHealth() {
  try {
    const stats = await searchSyncService.getIndexStats();
    console.log('Search index health check:', stats);
    return { healthy: true, stats };
  } catch (error) {
    console.error('Search index health check failed:', error);
    return { healthy: false, error: error.message };
  }
}
