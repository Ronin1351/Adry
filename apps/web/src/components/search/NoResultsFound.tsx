'use client';

import { SearchFilters } from '@/lib/search/search-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, MapPin } from 'lucide-react';

interface NoResultsFoundProps {
  filters: SearchFilters;
}

export function NoResultsFound({ filters }: NoResultsFoundProps) {
  const hasActiveFilters = () => {
    return !!(filters.query || filters.city || filters.province || 
              filters.skills?.length || filters.live_in_out || 
              filters.experience_band || filters.salary_min || 
              filters.salary_max || filters.availability_date);
  };

  const clearAllFilters = () => {
    window.location.href = '/workers';
  };

  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No workers found
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {hasActiveFilters() 
            ? "We couldn't find any workers matching your current filters. Try adjusting your search criteria."
            : "No workers are currently available. Check back later or contact us for assistance."
          }
        </p>

        {hasActiveFilters() && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {filters.query && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  "{filters.query}"
                </span>
              )}
              {filters.city && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {filters.city}
                </span>
              )}
              {filters.province && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {filters.province}
                </span>
              )}
              {filters.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
              {filters.live_in_out && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {filters.live_in_out === 'LIVE_IN' ? 'Live-in' : 
                   filters.live_in_out === 'LIVE_OUT' ? 'Live-out' : 'Live-in & Live-out'}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Button onClick={clearAllFilters} variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Try these suggestions:</p>
          <ul className="space-y-1 text-left max-w-sm mx-auto">
            <li>• Remove some filters to broaden your search</li>
            <li>• Try different keywords or skills</li>
            <li>• Check nearby cities or provinces</li>
            <li>• Adjust salary range or experience level</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
