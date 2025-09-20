'use client';

import { SearchFilters } from '@/lib/search/search-utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Bookmark } from 'lucide-react';

interface SearchResultsHeaderProps {
  filters: SearchFilters;
  totalHits?: number;
  onSortChange?: (sortBy: string) => void;
  onFilterRemove?: (filterKey: string) => void;
}

export function SearchResultsHeader({ 
  filters, 
  totalHits = 0, 
  onSortChange,
  onFilterRemove 
}: SearchResultsHeaderProps) {
  const getSortLabel = (sortBy: string) => {
    switch (sortBy) {
      case 'relevance':
        return 'Most Relevant';
      case 'newest':
        return 'Most Recent';
      case 'salary_high':
        return 'Salary: High to Low';
      case 'salary_low':
        return 'Salary: Low to High';
      case 'experience_high':
        return 'Experience: High to Low';
      case 'experience_low':
        return 'Experience: Low to High';
      default:
        return 'Most Relevant';
    }
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    
    if (filters.query) {
      activeFilters.push({ key: 'query', label: `"${filters.query}"`, value: filters.query });
    }
    if (filters.city) {
      activeFilters.push({ key: 'city', label: filters.city, value: filters.city });
    }
    if (filters.province) {
      activeFilters.push({ key: 'province', label: filters.province, value: filters.province });
    }
    if (filters.skills?.length) {
      activeFilters.push({ key: 'skills', label: filters.skills.join(', '), value: filters.skills.join(',') });
    }
    if (filters.live_in_out) {
      const typeLabel = filters.live_in_out === 'LIVE_IN' ? 'Live-in' : 
                       filters.live_in_out === 'LIVE_OUT' ? 'Live-out' : 
                       'Live-in & Live-out';
      activeFilters.push({ key: 'live_in_out', label: typeLabel, value: filters.live_in_out });
    }
    if (filters.experience_band) {
      const bandLabel = filters.experience_band === '0-1' ? '0-1 years' :
                       filters.experience_band === '2-3' ? '2-3 years' :
                       filters.experience_band === '4-5' ? '4-5 years' :
                       filters.experience_band === '6+' ? '6+ years' : filters.experience_band;
      activeFilters.push({ key: 'experience_band', label: bandLabel, value: filters.experience_band });
    }
    if (filters.salary_min || filters.salary_max) {
      const min = filters.salary_min ? `₱${filters.salary_min.toLocaleString()}` : '₱0';
      const max = filters.salary_max ? `₱${filters.salary_max.toLocaleString()}` : '₱∞';
      activeFilters.push({ key: 'salaryRange', label: `${min} - ${max}`, value: `${min}-${max}` });
    }
    if (filters.availability_date) {
      const date = new Date(filters.availability_date).toLocaleDateString();
      activeFilters.push({ key: 'availability_date', label: `Available from ${date}`, value: filters.availability_date });
    }
    
    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-4">
      {/* Results Count and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {totalHits > 0 ? `${totalHits.toLocaleString()} workers found` : 'No workers found'}
          </h2>
          {filters.query && (
            <span className="text-gray-600">
              for "{filters.query}"
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2" data-testid="sort-controls">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select
            data-testid="sort-select"
            value={filters.sort || 'relevance'}
            onValueChange={onSortChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
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
          <Button
            variant="outline"
            size="sm"
            data-testid="saved-searches-button"
            onClick={() => {/* This will be handled by parent component */}}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Saved Searches
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-2" data-testid="active-filters">
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
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                <span className="text-xs">{filter.label}</span>
                {onFilterRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFilterRemove(filter.key)}
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
            <li>• Try searching by skills like "cooking", "childcare", or "driving"</li>
            <li>• Use location filters to find workers in your area</li>
            <li>• Adjust salary range to match your budget</li>
            <li>• Check availability dates for immediate hires</li>
          </ul>
        </div>
      )}
    </div>
  );
}
