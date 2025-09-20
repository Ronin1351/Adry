// Search utilities for the workers directory

export interface SearchFilters {
  query?: string;
  city?: string;
  province?: string;
  skills: string[];
  live_in_out?: 'LIVE_IN' | 'LIVE_OUT' | 'BOTH';
  experience_band?: string;
  salary_min?: number;
  salary_max?: number;
  availability_date?: string;
  page: number;
  sort: 'relevance' | 'newest' | 'salary_high' | 'salary_low' | 'experience_high' | 'experience_low';
}

export interface SearchResult {
  id: string;
  first_name: string;
  city: string;
  province: string;
  skills: string[];
  years_of_experience: number;
  live_in_out: string;
  headline?: string;
  availability_date?: string;
  salary_min: number;
  salary_max: number;
  updated_at: string;
  slug: string;
  experience_band: string;
}

export interface SearchResponse {
  hits: SearchResult[];
  totalHits: number;
  page: number;
  totalPages: number;
  facets?: Record<string, Record<string, number>>;
  processingTimeMs: number;
}

// Get search facets for filter options
export async function getSearchFacets() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/search/facets`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch facets');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting search facets:', error);
    return {
      cities: {},
      provinces: {},
      skills: {},
      live_in_out: {},
      experience_bands: {},
    };
  }
}

// Search employee profiles
export async function searchProfiles(filters: SearchFilters): Promise<SearchResponse> {
  try {
    const searchParams = new URLSearchParams();
    
    if (filters.query) searchParams.set('q', filters.query);
    if (filters.city) searchParams.set('city', filters.city);
    if (filters.province) searchParams.set('province', filters.province);
    if (filters.skills.length > 0) searchParams.set('skills', filters.skills.join(','));
    if (filters.live_in_out) searchParams.set('live_in_out', filters.live_in_out);
    if (filters.experience_band) searchParams.set('experience_band', filters.experience_band);
    if (filters.salary_min) searchParams.set('salary_min', filters.salary_min.toString());
    if (filters.salary_max) searchParams.set('salary_max', filters.salary_max.toString());
    if (filters.availability_date) searchParams.set('availability_date', filters.availability_date);
    if (filters.page > 1) searchParams.set('page', filters.page.toString());
    if (filters.sort) searchParams.set('sort', filters.sort);

    const response = await fetch(`/api/search/employees?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Search failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
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
export function generateSearchCanonicalUrl(filters: SearchFilters): string {
  const params = new URLSearchParams();
  
  if (filters.query) params.set('q', filters.query);
  if (filters.city) params.set('city', filters.city);
  if (filters.province) params.set('province', filters.province);
  if (filters.skills.length > 0) params.set('skills', filters.skills.join(','));
  if (filters.live_in_out) params.set('live_in_out', filters.live_in_out);
  if (filters.experience_band) params.set('experience_band', filters.experience_band);
  if (filters.salary_min) params.set('salary_min', filters.salary_min.toString());
  if (filters.salary_max) params.set('salary_max', filters.salary_max.toString());
  if (filters.availability_date) params.set('availability_date', filters.availability_date);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page > 1) params.set('page', filters.page.toString());
  
  const queryString = params.toString();
  return queryString ? `/workers?${queryString}` : '/workers';
}

// Generate page title for search results
export function generateSearchPageTitle(filters: SearchFilters, totalHits: number): string {
  let title = 'Find Housekeepers & Domestic Helpers';
  
  if (filters.city && filters.province) {
    title = `Housekeepers in ${filters.city}, ${filters.province}`;
  } else if (filters.province) {
    title = `Housekeepers in ${filters.province}`;
  }
  
  if (filters.skills.length > 0) {
    title = `${filters.skills.join(', ')} Services - ${title}`;
  }
  
  if (filters.live_in_out) {
    const typeText = filters.live_in_out === 'LIVE_IN' ? 'Live-in' : 
                    filters.live_in_out === 'LIVE_OUT' ? 'Live-out' : 
                    'Live-in & Live-out';
    title = `${typeText} ${title}`;
  }
  
  if (filters.query) {
    title = `"${filters.query}" - ${title}`;
  }
  
  title += ' | Adry';
  
  return title;
}

// Generate meta description for search results
export function generateSearchMetaDescription(filters: SearchFilters, totalHits: number): string {
  let description = `Find ${totalHits.toLocaleString()} verified housekeepers and domestic helpers`;
  
  if (filters.city && filters.province) {
    description += ` in ${filters.city}, ${filters.province}`;
  } else if (filters.province) {
    description += ` in ${filters.province}`;
  }
  
  if (filters.skills.length > 0) {
    description += ` specializing in ${filters.skills.join(', ')}`;
  }
  
  if (filters.live_in_out) {
    const typeText = filters.live_in_out === 'LIVE_IN' ? 'live-in' : 
                    filters.live_in_out === 'LIVE_OUT' ? 'live-out' : 
                    'live-in and live-out';
    description += ` (${typeText})`;
  }
  
  if (filters.salary_min || filters.salary_max) {
    const min = filters.salary_min ? `₱${filters.salary_min.toLocaleString()}` : '₱0';
    const max = filters.salary_max ? `₱${filters.salary_max.toLocaleString()}` : '₱∞';
    description += ` with salary range ${min} - ${max}`;
  }
  
  description += '. Browse profiles, read reviews, and find your perfect match today.';
  
  return description;
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Get employment type display text
export function getEmploymentTypeText(type: string): string {
  switch (type) {
    case 'LIVE_IN':
      return 'Live-in';
    case 'LIVE_OUT':
      return 'Live-out';
    case 'BOTH':
      return 'Live-in & Live-out';
    default:
      return type;
  }
}

// Get experience band display text
export function getExperienceBandText(band: string): string {
  switch (band) {
    case '0-1':
      return '0-1 years';
    case '2-3':
      return '2-3 years';
    case '4-5':
      return '4-5 years';
    case '6+':
      return '6+ years';
    default:
      return band;
  }
}
