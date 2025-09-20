import { Suspense } from 'react';
import { Metadata } from 'next';
import { WorkersDirectory } from '@/components/search/WorkersDirectory';
import { SearchFiltersSidebar } from '@/components/search/SearchFiltersSidebar';
import { SearchResultsHeader } from '@/components/search/SearchResultsHeader';
import { SearchPagination } from '@/components/search/SearchPagination';
import { getSearchFacets } from '@/lib/search/search-utils';

interface WorkersPageProps {
  searchParams: {
    q?: string;
    city?: string;
    province?: string;
    skills?: string;
    live_in_out?: string;
    experience_band?: string;
    salary_min?: string;
    salary_max?: string;
    availability_date?: string;
    page?: string;
    sort?: string;
  };
}

// ISR configuration
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ searchParams }: WorkersPageProps): Promise<Metadata> {
  const { q, city, province, skills, live_in_out } = searchParams;
  
  let title = 'Find Housekeepers & Domestic Helpers in the Philippines';
  let description = 'Browse verified housekeepers, nannies, and domestic helpers. Find the perfect match for your household needs.';

  if (q) {
    title = `Search Results for "${q}" - ${title}`;
    description = `Search results for "${q}" - ${description}`;
  }

  if (city && province) {
    title = `Housekeepers in ${city}, ${province} - ${title}`;
    description = `Find housekeepers and domestic helpers in ${city}, ${province}. ${description}`;
  }

  if (skills) {
    const skillList = skills.split(',').join(', ');
    title = `${skillList} Services - ${title}`;
    description = `Find housekeepers specializing in ${skillList}. ${description}`;
  }

  if (live_in_out) {
    const typeText = live_in_out === 'LIVE_IN' ? 'Live-in' : 
                    live_in_out === 'LIVE_OUT' ? 'Live-out' : 'Live-in & Live-out';
    title = `${typeText} Housekeepers - ${title}`;
    description = `Find ${typeText.toLowerCase()} housekeepers. ${description}`;
  }

  return {
    title,
    description,
    keywords: [
      'housekeeper',
      'domestic helper',
      'nanny',
      'babysitter',
      'cook',
      'driver',
      'Philippines',
      'yaya',
      'katulong',
      'kasambahay',
      city,
      province,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_PH',
      siteName: 'Adry - Find Your Perfect Housekeeper',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: '/workers',
    },
  };
}

export default async function WorkersPage({ searchParams }: WorkersPageProps) {
  // Get search facets for filters
  const facets = await getSearchFacets();

  // Build search filters from URL params
  const filters = {
    query: searchParams.q,
    city: searchParams.city,
    province: searchParams.province,
    skills: searchParams.skills ? searchParams.skills.split(',').map(s => s.trim()) : [],
    live_in_out: searchParams.live_in_out as any,
    experience_band: searchParams.experience_band,
    salary_min: searchParams.salary_min ? parseInt(searchParams.salary_min) : undefined,
    salary_max: searchParams.salary_max ? parseInt(searchParams.salary_max) : undefined,
    availability_date: searchParams.availability_date,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    sort: searchParams.sort as any || 'relevance',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Find Your Perfect Housekeeper
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse verified housekeepers, nannies, and domestic helpers in the Philippines
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0" data-testid="filters-sidebar">
            <SearchFiltersSidebar facets={facets} currentFilters={filters} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Results Header */}
            <SearchResultsHeader filters={filters} />

            {/* Search Results */}
            <Suspense fallback={<SearchResultsSkeleton />}>
              <WorkersDirectory filters={filters} />
            </Suspense>

            {/* Pagination */}
            <Suspense fallback={<PaginationSkeleton />}>
              <SearchPagination filters={filters} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeletons
function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-6 bg-gray-200 rounded w-16"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}