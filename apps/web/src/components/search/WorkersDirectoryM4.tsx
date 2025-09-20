'use client';

import { useState, useEffect } from 'react';
import { SearchFilters, SearchResult } from '@/lib/search/meilisearch-m4';
import { WorkerCard } from '@/components/search/WorkerCardM4';
import { SearchResultsSkeleton } from '@/components/search/SearchResultsSkeletonM4';
import { NoResultsFound } from '@/components/search/NoResultsFoundM4';
import { SearchError } from '@/components/search/SearchErrorM4';

interface WorkersDirectoryProps {
  filters: SearchFilters;
}

export function WorkersDirectory({ filters }: WorkersDirectoryProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProfiles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build search URL
        const searchParams = new URLSearchParams();
        
        if (filters.query) searchParams.set('q', filters.query);
        if (filters.city) searchParams.set('city', filters.city);
        if (filters.province) searchParams.set('province', filters.province);
        if (filters.skills?.length) searchParams.set('skills', filters.skills.join(','));
        if (filters.employmentType) searchParams.set('employmentType', filters.employmentType);
        if (filters.yearsOfExperience?.min) searchParams.set('yearsMin', filters.yearsOfExperience.min.toString());
        if (filters.yearsOfExperience?.max) searchParams.set('yearsMax', filters.yearsOfExperience.max.toString());
        if (filters.salaryRange?.min) searchParams.set('salaryMin', filters.salaryRange.min.toString());
        if (filters.salaryRange?.max) searchParams.set('salaryMax', filters.salaryRange.max.toString());
        if (filters.availabilityDate?.from) searchParams.set('availableFrom', filters.availabilityDate.from);
        if (filters.availabilityDate?.to) searchParams.set('availableTo', filters.availabilityDate.to);
        if (filters.page) searchParams.set('page', filters.page.toString());
        if (filters.sortBy) searchParams.set('sort', filters.sortBy);

        const response = await fetch(`/api/search/employees?${searchParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data.hits || []);
        setTotalHits(data.totalHits || 0);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setIsLoading(false);
      }
    };

    searchProfiles();
  }, [filters]);

  if (isLoading) {
    return <SearchResultsSkeleton />;
  }

  if (error) {
    return <SearchError error={error} />;
  }

  if (results.length === 0) {
    return <NoResultsFound filters={filters} />;
  }

  return (
    <div className="space-y-6">
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((worker) => (
          <WorkerCard key={worker.userId} worker={worker} />
        ))}
      </div>

      {/* Results Info */}
      <div className="text-center text-sm text-gray-600">
        Showing {results.length} of {totalHits} results
      </div>
    </div>
  );
}
