// ISR (Incremental Static Regeneration) utilities for M4 Search + SEO

export const ISR_CONFIG = {
  // Cache durations in seconds
  WORKERS_PAGE: 3600,        // 1 hour
  WORKER_PROFILE: 1800,      // 30 minutes
  SEARCH_FACETS: 3600,       // 1 hour
  SITEMAP: 3600,             // 1 hour
  ROBOTS_TXT: 86400,         // 24 hours
} as const;

// Revalidation tags
export const REVALIDATION_TAGS = {
  WORKERS: 'workers',
  WORKER_PROFILE: 'worker-profile',
  SEARCH_FACETS: 'search-facets',
  SITEMAP: 'sitemap',
} as const;

// Generate cache key for search results
export function generateSearchCacheKey(filters: Record<string, any>): string {
  const sortedFilters = Object.keys(filters)
    .sort()
    .reduce((result, key) => {
      result[key] = filters[key];
      return result;
    }, {} as Record<string, any>);
  
  return `search:${JSON.stringify(sortedFilters)}`;
}

// Generate cache key for worker profile
export function generateWorkerProfileCacheKey(slug: string): string {
  return `worker-profile:${slug}`;
}

// Generate cache key for search facets
export function generateSearchFacetsCacheKey(): string {
  return 'search-facets:all';
}

// Cache headers for different content types
export const CACHE_HEADERS = {
  // Static content - cache for 1 year
  STATIC: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  
  // ISR content - cache for specified duration
  ISR: (duration: number) => ({
    'Cache-Control': `public, max-age=${duration}, s-maxage=${duration}`,
  }),
  
  // Dynamic content - cache for short duration
  DYNAMIC: {
    'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes
  },
  
  // No cache
  NO_CACHE: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
} as const;

// Revalidation functions
export async function revalidateWorkersPage() {
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag(REVALIDATION_TAGS.WORKERS);
    console.log('Revalidated workers page cache');
  } catch (error) {
    console.error('Error revalidating workers page:', error);
  }
}

export async function revalidateWorkerProfile(slug: string) {
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag(REVALIDATION_TAGS.WORKER_PROFILE);
    revalidateTag(`${REVALIDATION_TAGS.WORKER_PROFILE}:${slug}`);
    console.log(`Revalidated worker profile cache for: ${slug}`);
  } catch (error) {
    console.error('Error revalidating worker profile:', error);
  }
}

export async function revalidateSearchFacets() {
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag(REVALIDATION_TAGS.SEARCH_FACETS);
    console.log('Revalidated search facets cache');
  } catch (error) {
    console.error('Error revalidating search facets:', error);
  }
}

export async function revalidateSitemap() {
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag(REVALIDATION_TAGS.SITEMAP);
    console.log('Revalidated sitemap cache');
  } catch (error) {
    console.error('Error revalidating sitemap:', error);
  }
}

// Cache warming functions
export async function warmWorkersPageCache() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Warm common search combinations
    const commonSearches = [
      '/workers',
      '/workers?province=Metro%20Manila',
      '/workers?province=Metro%20Manila&city=Quezon%20City',
      '/workers?skills=cooking',
      '/workers?skills=childcare',
      '/workers?live_in_out=LIVE_IN',
      '/workers?live_in_out=LIVE_OUT',
    ];
    
    for (const url of commonSearches) {
      try {
        await fetch(`${baseUrl}${url}`, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        console.log(`Warmed cache for: ${url}`);
      } catch (error) {
        console.error(`Error warming cache for ${url}:`, error);
      }
    }
  } catch (error) {
    console.error('Error warming workers page cache:', error);
  }
}

export async function warmWorkerProfileCache(slugs: string[]) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    for (const slug of slugs) {
      try {
        await fetch(`${baseUrl}/workers/${slug}`, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        console.log(`Warmed cache for worker profile: ${slug}`);
      } catch (error) {
        console.error(`Error warming cache for worker profile ${slug}:`, error);
      }
    }
  } catch (error) {
    console.error('Error warming worker profile cache:', error);
  }
}

// Cache invalidation on data changes
export async function invalidateCacheOnEmployeeUpdate(userId: string) {
  try {
    // Revalidate workers page (employee might appear/disappear)
    await revalidateWorkersPage();
    
    // Revalidate search facets (counts might change)
    await revalidateSearchFacets();
    
    // Revalidate sitemap (new/updated profile)
    await revalidateSitemap();
    
    console.log(`Invalidated cache for employee update: ${userId}`);
  } catch (error) {
    console.error('Error invalidating cache on employee update:', error);
  }
}

export async function invalidateCacheOnEmployeeProfileUpdate(userId: string, slug: string) {
  try {
    // Revalidate specific worker profile
    await revalidateWorkerProfile(slug);
    
    // Revalidate workers page (profile might change visibility)
    await revalidateWorkersPage();
    
    // Revalidate sitemap (profile content changed)
    await revalidateSitemap();
    
    console.log(`Invalidated cache for employee profile update: ${userId} (${slug})`);
  } catch (error) {
    console.error('Error invalidating cache on employee profile update:', error);
  }
}