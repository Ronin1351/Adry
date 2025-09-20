import { prisma } from '@/lib/db';
import { getEmployeesIndex, type EmployeeSearchDocument } from './meilisearch-client';

export class SearchSyncService {
  private index = getEmployeesIndex();

  // Transform database record to search document
  private transformToSearchDocument(profile: any): EmployeeSearchDocument {
    return {
      id: profile.userId,
      first_name: profile.firstName,
      city: profile.city,
      province: profile.province,
      skills: profile.skills || [],
      years_of_experience: profile.experience,
      live_in_out: profile.employmentType,
      headline: profile.headline,
      availability_date: profile.availabilityDate?.toISOString(),
      salary_min: profile.salaryMin,
      salary_max: profile.salaryMax,
      updated_at: profile.updatedAt.toISOString(),
      slug: this.generateSlug(profile.firstName, profile.city, profile.userId),
      experience_band: this.getExperienceBand(profile.experience),
    };
  }

  // Generate SEO-friendly slug
  private generateSlug(firstName: string, city: string, userId: string): string {
    const cleanName = firstName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const cleanCity = city
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `${cleanName}-${cleanCity}-${userId}`;
  }

  // Get experience band
  private getExperienceBand(experience: number): string {
    if (experience < 2) return '0-1';
    if (experience < 4) return '2-3';
    if (experience < 6) return '4-5';
    return '6+';
  }

  // Sync single employee profile
  async syncEmployeeProfile(userId: string) {
    try {
      const profile = await prisma.employeeProfile.findUnique({
        where: { userId },
        select: {
          userId: true,
          firstName: true,
          city: true,
          province: true,
          skills: true,
          experience: true,
          employmentType: true,
          headline: true,
          availabilityDate: true,
          salaryMin: true,
          salaryMax: true,
          updatedAt: true,
          visibility: true,
        },
      });

      if (!profile) {
        // Remove from index if profile doesn't exist
        await this.index.deleteDocument(userId);
        console.log(`Removed profile ${userId} from search index`);
        return;
      }

      if (!profile.visibility) {
        // Remove from index if not visible
        await this.index.deleteDocument(userId);
        console.log(`Removed non-visible profile ${userId} from search index`);
        return;
      }

      // Add/update in index
      const searchDoc = this.transformToSearchDocument(profile);
      await this.index.addDocuments([searchDoc]);
      console.log(`Synced profile ${userId} to search index`);
    } catch (error) {
      console.error(`Error syncing profile ${userId}:`, error);
      throw error;
    }
  }

  // Batch sync multiple profiles
  async syncEmployeeProfiles(userIds: string[]) {
    try {
      const profiles = await prisma.employeeProfile.findMany({
        where: { 
          userId: { in: userIds },
          visibility: true 
        },
        select: {
          userId: true,
          firstName: true,
          city: true,
          province: true,
          skills: true,
          experience: true,
          employmentType: true,
          headline: true,
          availabilityDate: true,
          salaryMin: true,
          salaryMax: true,
          updatedAt: true,
          visibility: true,
        },
      });

      if (profiles.length === 0) {
        console.log('No visible profiles to sync');
        return;
      }

      const searchDocs = profiles.map(profile => 
        this.transformToSearchDocument(profile)
      );

      await this.index.addDocuments(searchDocs);
      console.log(`Synced ${profiles.length} profiles to search index`);
    } catch (error) {
      console.error('Error batch syncing profiles:', error);
      throw error;
    }
  }

  // Full reindex
  async reindexAll() {
    try {
      console.log('Starting full reindex...');
      
      const profiles = await prisma.employeeProfile.findMany({
        where: { visibility: true },
        select: {
          userId: true,
          firstName: true,
          city: true,
          province: true,
          skills: true,
          experience: true,
          employmentType: true,
          headline: true,
          availabilityDate: true,
          salaryMin: true,
          salaryMax: true,
          updatedAt: true,
          visibility: true,
        },
        orderBy: { updatedAt: 'desc' },
      });

      if (profiles.length === 0) {
        console.log('No profiles to index');
        return;
      }

      const searchDocs = profiles.map(profile => 
        this.transformToSearchDocument(profile)
      );

      // Clear existing index
      await this.index.deleteAllDocuments();
      
      // Add all documents
      await this.index.addDocuments(searchDocs);
      
      console.log(`Reindexed ${profiles.length} profiles`);
    } catch (error) {
      console.error('Error during full reindex:', error);
      throw error;
    }
  }

  // Remove profile from index
  async removeEmployeeProfile(userId: string) {
    try {
      await this.index.deleteDocument(userId);
      console.log(`Removed profile ${userId} from search index`);
    } catch (error) {
      console.error(`Error removing profile ${userId}:`, error);
      throw error;
    }
  }

  // Get index stats
  async getIndexStats() {
    try {
      const stats = await this.index.getStats();
      return stats;
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const searchSyncService = new SearchSyncService();
