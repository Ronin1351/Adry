'use client';

import { useState, useEffect } from 'react';
import { SearchFilters, SearchResult, searchProfiles } from '@/lib/search/search-utils';
import { WorkerCard } from './WorkerCard';
import { SearchResultsSkeleton } from './SearchResultsSkeleton';
import { NoResultsFound } from './NoResultsFound';
import { SearchError } from './SearchError';

interface WorkersDirectoryProps {
  filters: SearchFilters;
}

export function WorkersDirectory({ filters }: WorkersDirectoryProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProfilesData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await searchProfiles(filters);
        setResults(data.hits || []);
        setTotalHits(data.totalHits || 0);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setIsLoading(false);
      }
    };

    searchProfilesData();
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
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>

      {/* Results Info */}
      <div className="text-center text-sm text-gray-600">
        Showing {results.length} of {totalHits} results
      </div>
    </div>
  );
}
