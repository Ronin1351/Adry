import { searchService } from './meilisearch-m4';

// Get search facets for filter options
export async function getSearchFacets() {
  try {
    const facets = await searchService.getSearchFacets();
    return facets;
  } catch (error) {
    console.error('Error getting search facets:', error);
    return {
      cities: {},
      provinces: {},
      skills: {},
      employmentTypes: {},
      experienceBands: {},
      salaryRanges: {},
    };
  }
}

// Generate SEO-friendly slug for employee profile
export function generateEmployeeSlug(firstName: string, city: string, userId: string): string {
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

// Parse slug to extract employee ID
export function parseEmployeeSlug(slug: string): { userId: string; firstName: string; city: string } | null {
  const parts = slug.split('-');
  if (parts.length < 3) return null;
  
  const userId = parts[parts.length - 1];
  const city = parts[parts.length - 2];
  const firstName = parts.slice(0, -2).join('-');
  
  return { userId, firstName, city };
}

// Generate canonical URL for search results
export function generateSearchCanonicalUrl(filters: any): string {
  const params = new URLSearchParams();
  
  if (filters.query) params.set('q', filters.query);
  if (filters.city) params.set('city', filters.city);
  if (filters.province) params.set('province', filters.province);
  if (filters.skills?.length) params.set('skills', filters.skills.join(','));
  if (filters.employmentType) params.set('employmentType', filters.employmentType);
  if (filters.yearsOfExperience?.min) params.set('yearsMin', filters.yearsOfExperience.min.toString());
  if (filters.yearsOfExperience?.max) params.set('yearsMax', filters.yearsOfExperience.max.toString());
  if (filters.salaryRange?.min) params.set('salaryMin', filters.salaryRange.min.toString());
  if (filters.salaryRange?.max) params.set('salaryMax', filters.salaryRange.max.toString());
  if (filters.availabilityDate?.from) params.set('availableFrom', filters.availabilityDate.from);
  if (filters.availabilityDate?.to) params.set('availableTo', filters.availabilityDate.to);
  if (filters.sortBy) params.set('sort', filters.sortBy);
  if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
  
  const queryString = params.toString();
  return queryString ? `/workers?${queryString}` : '/workers';
}

// Generate structured data for search results
export function generateSearchStructuredData(filters: any, results: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Housekeepers and Domestic Helpers',
    description: 'Find verified housekeepers, nannies, and domestic helpers in the Philippines',
    url: `${baseUrl}${generateSearchCanonicalUrl(filters)}`,
    numberOfItems: results.length,
    itemListElement: results.map((result, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: result.firstName,
        jobTitle: 'Housekeeper',
        address: {
          '@type': 'PostalAddress',
          addressLocality: result.city,
          addressRegion: result.province,
          addressCountry: 'PH',
        },
        url: `${baseUrl}/workers/${result.slug}`,
        image: result.photoUrl ? `${baseUrl}${result.photoUrl}` : undefined,
        knowsAbout: result.skills,
        workHours: result.employmentType === 'LIVE_IN' ? 'Live-in' : 'Live-out',
      },
    })),
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(filters: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Workers',
      item: `${baseUrl}/workers`,
    },
  ];

  if (filters.province) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: breadcrumbs.length + 1,
      name: filters.province,
      item: `${baseUrl}/workers?province=${encodeURIComponent(filters.province)}`,
    });
  }

  if (filters.city) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: breadcrumbs.length + 1,
      name: filters.city,
      item: `${baseUrl}/workers?city=${encodeURIComponent(filters.city)}&province=${encodeURIComponent(filters.province || '')}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}

// Generate meta description for search results
export function generateSearchMetaDescription(filters: any, totalHits: number): string {
  let description = `Find ${totalHits.toLocaleString()} verified housekeepers and domestic helpers`;
  
  if (filters.city && filters.province) {
    description += ` in ${filters.city}, ${filters.province}`;
  } else if (filters.province) {
    description += ` in ${filters.province}`;
  }
  
  if (filters.skills?.length) {
    description += ` specializing in ${filters.skills.join(', ')}`;
  }
  
  if (filters.employmentType) {
    const typeText = filters.employmentType === 'LIVE_IN' ? 'live-in' : 
                    filters.employmentType === 'LIVE_OUT' ? 'live-out' : 
                    'live-in and live-out';
    description += ` (${typeText})`;
  }
  
  if (filters.salaryRange?.min || filters.salaryRange?.max) {
    const min = filters.salaryRange.min ? `₱${filters.salaryRange.min.toLocaleString()}` : '₱0';
    const max = filters.salaryRange.max ? `₱${filters.salaryRange.max.toLocaleString()}` : '₱∞';
    description += ` with salary range ${min} - ${max}`;
  }
  
  description += '. Browse profiles, read reviews, and find your perfect match today.';
  
  return description;
}

// Generate page title for search results
export function generateSearchPageTitle(filters: any, totalHits: number): string {
  let title = 'Find Housekeepers & Domestic Helpers';
  
  if (filters.city && filters.province) {
    title = `Housekeepers in ${filters.city}, ${filters.province}`;
  } else if (filters.province) {
    title = `Housekeepers in ${filters.province}`;
  }
  
  if (filters.skills?.length) {
    title = `${filters.skills.join(', ')} Services - ${title}`;
  }
  
  if (filters.employmentType) {
    const typeText = filters.employmentType === 'LIVE_IN' ? 'Live-in' : 
                    filters.employmentType === 'LIVE_OUT' ? 'Live-out' : 
                    'Live-in & Live-out';
    title = `${typeText} ${title}`;
  }
  
  if (filters.query) {
    title = `"${filters.query}" - ${title}`;
  }
  
  title += ' | Adry';
  
  return title;
}

// Validate search filters
export function validateSearchFilters(filters: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (filters.yearsOfExperience?.min && filters.yearsOfExperience?.max) {
    if (filters.yearsOfExperience.min > filters.yearsOfExperience.max) {
      errors.push('Minimum experience cannot be greater than maximum experience');
    }
  }
  
  if (filters.salaryRange?.min && filters.salaryRange?.max) {
    if (filters.salaryRange.min > filters.salaryRange.max) {
      errors.push('Minimum salary cannot be greater than maximum salary');
    }
  }
  
  if (filters.availabilityDate?.from && filters.availabilityDate?.to) {
    const fromDate = new Date(filters.availabilityDate.from);
    const toDate = new Date(filters.availabilityDate.to);
    if (fromDate > toDate) {
      errors.push('Availability start date cannot be after end date');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Clean and normalize search query
export function normalizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .toLowerCase();
}

// Generate search suggestions based on query
export async function getSearchSuggestions(query: string, limit: number = 5) {
  try {
    const suggestions = await searchService.getSearchSuggestions(query, limit);
    return suggestions;
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
}
