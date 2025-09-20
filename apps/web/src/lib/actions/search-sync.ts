'use server';

import { searchSyncService } from '@/lib/search/sync-service';
import { revalidatePath } from 'next/cache';

// Server action to sync single profile
export async function syncEmployeeProfile(userId: string) {
  try {
    await searchSyncService.syncEmployeeProfile(userId);
    
    // Revalidate search pages
    revalidatePath('/workers');
    revalidatePath(`/workers/[slug]`, 'page');
    
    return { success: true };
  } catch (error) {
    console.error('Error syncing employee profile:', error);
    return { success: false, error: error.message };
  }
}

// Server action to sync multiple profiles
export async function syncEmployeeProfiles(userIds: string[]) {
  try {
    await searchSyncService.syncEmployeeProfiles(userIds);
    
    // Revalidate search pages
    revalidatePath('/workers');
    
    return { success: true };
  } catch (error) {
    console.error('Error syncing employee profiles:', error);
    return { success: false, error: error.message };
  }
}

// Server action to remove profile from index
export async function removeEmployeeProfile(userId: string) {
  try {
    await searchSyncService.removeEmployeeProfile(userId);
    
    // Revalidate search pages
    revalidatePath('/workers');
    revalidatePath(`/workers/[slug]`, 'page');
    
    return { success: true };
  } catch (error) {
    console.error('Error removing employee profile:', error);
    return { success: false, error: error.message };
  }
}

// Server action for full reindex (admin only)
export async function reindexAllProfiles() {
  try {
    await searchSyncService.reindexAll();
    
    // Revalidate all search pages
    revalidatePath('/workers');
    revalidatePath('/workers/[slug]', 'page');
    
    return { success: true };
  } catch (error) {
    console.error('Error reindexing all profiles:', error);
    return { success: false, error: error.message };
  }
}

// Server action to get index stats
export async function getSearchIndexStats() {
  try {
    const stats = await searchSyncService.getIndexStats();
    return { success: true, stats };
  } catch (error) {
    console.error('Error getting index stats:', error);
    return { success: false, error: error.message };
  }
}
