'use client';

import { useMemo } from 'react';
import { SearchFilters } from '@/lib/search/meilisearch-m4';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type SortValue =
  | 'relevance'
  | 'newest'
  | 'salary_high'
  | 'salary_low'
  | 'experience_high'
  | 'experience_low';

interface SearchResultsHeaderProps {
  filters: SearchFilters;
  totalHits?: number;
  onSortChange?: (sortBy: SortValue) => void;
  onFilterRemove?: (filterKey: string) => void; // use 'all' to clear everything
}

type ActiveFilter = {
  key: string;
  label: string;
  value: string;
};

export function SearchResultsHeader({
  filters,
  totalHits = 0,
  onSortChange,
  onFilterRemove,
}: SearchResultsHeaderProps) {
  const employmentTypeLabel = (t?: string) => {
    const v = (t ?? '').toUpperCase();
    if (v === 'LIVE_IN') return 'Live-in';
    if (v === 'LIVE_OUT') return 'Live-out';
    if (v === 'BOTH') return 'Live-in & Live-out';
    return 'Any';
    };

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const out: ActiveFilter[] = [];

    if (filters.query) {
      out.push({ key: 'query', label: `"${filters.query}"`, value: String(filters.query) });
    }
    if (filters.city) {
      out.push({ key: 'city', label: filters.city, value: filters.city });
    }
    if (filters.province) {
      out.push({ key: 'province', label: filters.province, value: filters.province });
    }
    if (filters.skills?.length) {
      out.push({
        key: 'skills',
        label: filters.skills.join(', '),
        value: filters.skills.join(','),
      });
    }
    if (filters.employmentType) {
      out.push({
        key: 'employmentType',
        label: employmentTypeLabel(filters.employmentType),
        value: String(filters.employmentType),
      });
    }
    if (filters.yearsOfExperience?.min || filters.yearsOfExperience?.max) {
      const min = filters.yearsOfExperience?.min ?? 0;
      const max = filters.yearsOfExperience?.max ?? '∞';
      out.push({
        key: 'yearsOfExperience',
        label: `${min}-${max} years`,
        value: `${min}-${max}`,
      });
    }
    if (filters.salaryRange?.min || filters.salaryRange?.max) {
      const min =
        typeof filters.salaryRange?.min === 'number'
          ? `₱${filters.salaryRange.min.toLocaleString()}`
          : '₱0';
      const max =
        typeof filters.salaryRange?.max === 'number'
          ? `₱${filters.salaryRange.max.toLocaleString()}`
          : '₱∞';
      out.push({
        key: 'salaryRange',
        label: `${min} − ${max}`,
        value: `${min}-${max}`,
      });
    }
    if (filters.availabilityDate?.from || filters.availabilityDate?.to) {
      const from = filters.availabilityDate?.from
        ? new Date(filters.availabilityDate.from).toLocaleDateString()
        : 'Any';
      const to = filters.availabilityDate?.to
        ? new Date(filters.availabilityDate.to).toLocaleDateString()
        : 'Any';
      out.push({
        key: 'availabilityDate',
        label: `${from} − ${to}`,
        value: `${from}-${to}`,
      });
    }

    return out;
  }, [filters]);

  const sortValue: SortValue = (filters.sortBy as SortValue) || 'relevance';

  return (
    <div className="space-y-4">
      {/* Results Count + Query echo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {totalHits > 0 ? `${totalHits.toLocaleString()} workers found` : 'No workers found'}
          </h2>
          {filters.query ? (
            <span className="text-gray-600">for “{filters.query}”</span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select
            value={sortValue}
            onValueChange={(v) => onSortChange?.(v as SortValue)}
          >
            <SelectTrigger className="w-48" aria-label="Sort results">
              <SelectValue placeholder="Most Relevant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="newest">Most Recent</SelectItem>
              <SelectItem value="salary_high">Salary: High to Low</SelectItem>
              <SelectItem value="salary_low">Salary: Low to High</SelectItem>
              <SelectItem value="experience_high">Experience: High to Low</SelectItem>
              <SelectItem value="experience_low">Experience: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterRemove?.('all')}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <Badge
                key={`${f.key}:${f.value}`}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                <span className="text-xs">{f.label}</span>
                {onFilterRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove ${f.key}`}
                    onClick={() => onFilterRemove(f.key)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search Tips */}
      {totalHits === 0 && !filters.query && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Search Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Try searching by skills like “cooking”, “childcare”, or “driving”.</li>
            <li>• Use location filters to find workers in your area.</li>
            <li>• Adjust salary range to match your budget.</li>
            <li>• Check availability dates for immediate hires.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
