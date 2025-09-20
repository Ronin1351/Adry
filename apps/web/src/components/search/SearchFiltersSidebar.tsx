'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchFilters } from '@/lib/search/search-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar,
  X,
  Filter
} from 'lucide-react';

interface SearchFiltersSidebarProps {
  facets: {
    cities: Record<string, number>;
    provinces: Record<string, number>;
    skills: Record<string, number>;
    live_in_out: Record<string, number>;
    experience_bands: Record<string, number>;
  };
  currentFilters: SearchFilters;
}

export function SearchFiltersSidebar({ facets, currentFilters }: SearchFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update filters when URL changes
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear existing filter params
    const filterKeys = ['q', 'city', 'province', 'skills', 'live_in_out', 'experience_band', 'salary_min', 'salary_max', 'availability_date', 'sort', 'page'];
    filterKeys.forEach(key => params.delete(key));
    
    // Add new filter params
    if (updatedFilters.query) params.set('q', updatedFilters.query);
    if (updatedFilters.city) params.set('city', updatedFilters.city);
    if (updatedFilters.province) params.set('province', updatedFilters.province);
    if (updatedFilters.skills.length > 0) params.set('skills', updatedFilters.skills.join(','));
    if (updatedFilters.live_in_out) params.set('live_in_out', updatedFilters.live_in_out);
    if (updatedFilters.experience_band) params.set('experience_band', updatedFilters.experience_band);
    if (updatedFilters.salary_min) params.set('salary_min', updatedFilters.salary_min.toString());
    if (updatedFilters.salary_max) params.set('salary_max', updatedFilters.salary_max.toString());
    if (updatedFilters.availability_date) params.set('availability_date', updatedFilters.availability_date);
    if (updatedFilters.sort) params.set('sort', updatedFilters.sort);
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/workers?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({ query: '', skills: [], page: 1, sort: 'relevance' });
    router.push('/workers');
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    updateFilters({ skills: newSkills });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.city) count++;
    if (filters.province) count++;
    if (filters.skills?.length) count++;
    if (filters.live_in_out) count++;
    if (filters.experience_band) count++;
    if (filters.salary_min || filters.salary_max) count++;
    if (filters.availability_date) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <span>{isExpanded ? 'Hide' : 'Show'}</span>
        </Button>
      </div>

      {/* Filters Content */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Search Query */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              data-testid="search-input"
              placeholder="Search by name, skills, or location..."
              value={filters.query || ''}
              onChange={(e) => updateFilters({ query: e.target.value || undefined })}
            />
          </CardContent>
        </Card>

        {/* Location Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="province" className="text-xs text-gray-600">Province</Label>
              <Select
                data-testid="province-select"
                value={filters.province || ''}
                onValueChange={(value) => updateFilters({ province: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All provinces</SelectItem>
                  {Object.entries(facets.provinces)
                    .sort(([,a], [,b]) => b - a)
                    .map(([province, count]) => (
                      <SelectItem key={province} value={province}>
                        {province} ({count})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="city" className="text-xs text-gray-600">City</Label>
              <Select
                data-testid="city-select"
                value={filters.city || ''}
                onValueChange={(value) => updateFilters({ city: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All cities</SelectItem>
                  {Object.entries(facets.cities)
                    .sort(([,a], [,b]) => b - a)
                    .map(([city, count]) => (
                      <SelectItem key={city} value={city}>
                        {city} ({count})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employment Type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Employment Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(facets.live_in_out).map(([type, count]) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.live_in_out === type}
                    onCheckedChange={(checked) => 
                      updateFilters({ live_in_out: checked ? type as any : undefined })
                    }
                  />
                  <Label htmlFor={type} className="text-sm flex-1">
                    {type === 'LIVE_IN' ? 'Live-in' : 
                     type === 'LIVE_OUT' ? 'Live-out' : 
                     type === 'BOTH' ? 'Live-in & Live-out' : type}
                    <span className="text-gray-500 ml-1">({count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(facets.skills)
                .sort(([,a], [,b]) => b - a)
                .map(([skill, count]) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      data-testid={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                      checked={filters.skills?.includes(skill) || false}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <Label htmlFor={skill} className="text-sm flex-1">
                      {skill}
                      <span className="text-gray-500 ml-1">({count})</span>
                    </Label>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience Band */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(facets.experience_bands).map(([band, count]) => (
                <div key={band} className="flex items-center space-x-2">
                  <Checkbox
                    id={band}
                    checked={filters.experience_band === band}
                    onCheckedChange={(checked) => 
                      updateFilters({ experience_band: checked ? band : undefined })
                    }
                  />
                  <Label htmlFor={band} className="text-sm flex-1">
                    {band === '0-1' ? '0-1 years' :
                     band === '2-3' ? '2-3 years' :
                     band === '4-5' ? '4-5 years' :
                     band === '6+' ? '6+ years' : band}
                    <span className="text-gray-500 ml-1">({count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Salary Range */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Monthly Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="salaryMin" className="text-xs text-gray-600">Min (₱)</Label>
                  <Input
                    id="salaryMin"
                    data-testid="salary-min"
                    type="number"
                    placeholder="3000"
                    value={filters.salary_min || ''}
                    onChange={(e) => updateFilters({ 
                      salary_min: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax" className="text-xs text-gray-600">Max (₱)</Label>
                  <Input
                    id="salaryMax"
                    data-testid="salary-max"
                    type="number"
                    placeholder="50000"
                    value={filters.salary_max || ''}
                    onChange={(e) => updateFilters({ 
                      salary_max: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label htmlFor="availabilityDate" className="text-xs text-gray-600">Available from</Label>
                <Input
                  id="availabilityDate"
                  type="date"
                  value={filters.availability_date || ''}
                  onChange={(e) => updateFilters({ 
                    availability_date: e.target.value || undefined 
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
}
