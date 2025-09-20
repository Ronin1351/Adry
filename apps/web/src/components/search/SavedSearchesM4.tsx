'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  Plus,
  Clock,
  Filter
} from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  filters: any;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SavedSearchesProps {
  onSearchLoad: (filters: any) => void;
}

export function SavedSearches({ onSearchLoad }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const router = useRouter();

  // Load saved searches
  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/employer-profile-m3/saved-searches');
      
      if (response.ok) {
        const searches = await response.json();
        setSavedSearches(searches);
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSavedSearch = async () => {
    if (!newSearchName.trim()) return;

    try {
      // Get current search filters from URL
      const currentFilters = getCurrentFiltersFromURL();
      
      const response = await fetch('/api/employer-profile-m3/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSearchName.trim(),
          filters: currentFilters,
        }),
      });

      if (response.ok) {
        setNewSearchName('');
        loadSavedSearches();
      }
    } catch (error) {
      console.error('Error creating saved search:', error);
    }
  };

  const updateSavedSearch = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      const response = await fetch('/api/employer-profile-m3/saved-searches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editingName.trim(),
        }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditingName('');
        loadSavedSearches();
      }
    } catch (error) {
      console.error('Error updating saved search:', error);
    }
  };

  const deleteSavedSearch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return;

    try {
      const response = await fetch(`/api/employer-profile-m3/saved-searches?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadSavedSearches();
      }
    } catch (error) {
      console.error('Error deleting saved search:', error);
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      const response = await fetch('/api/employer-profile-m3/saved-searches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isDefault: true,
        }),
      });

      if (response.ok) {
        loadSavedSearches();
      }
    } catch (error) {
      console.error('Error setting default search:', error);
    }
  };

  const loadSearch = (search: SavedSearch) => {
    // Apply filters to current search
    onSearchLoad(search.filters);
    
    // Update URL with search filters
    const params = new URLSearchParams();
    
    if (search.filters.query) params.set('q', search.filters.query);
    if (search.filters.city) params.set('city', search.filters.city);
    if (search.filters.province) params.set('province', search.filters.province);
    if (search.filters.skills?.length) params.set('skills', search.filters.skills.join(','));
    if (search.filters.employmentType) params.set('employmentType', search.filters.employmentType);
    if (search.filters.yearsOfExperience?.min) params.set('yearsMin', search.filters.yearsOfExperience.min.toString());
    if (search.filters.yearsOfExperience?.max) params.set('yearsMax', search.filters.yearsOfExperience.max.toString());
    if (search.filters.salaryRange?.min) params.set('salaryMin', search.filters.salaryRange.min.toString());
    if (search.filters.salaryRange?.max) params.set('salaryMax', search.filters.salaryRange.max.toString());
    if (search.filters.availabilityDate?.from) params.set('availableFrom', search.filters.availabilityDate.from);
    if (search.filters.availabilityDate?.to) params.set('availableTo', search.filters.availabilityDate.to);
    if (search.filters.sortBy) params.set('sort', search.filters.sortBy);
    
    router.push(`/workers?${params.toString()}`);
  };

  const getCurrentFiltersFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    
    return {
      query: params.get('q') || undefined,
      city: params.get('city') || undefined,
      province: params.get('province') || undefined,
      skills: params.get('skills')?.split(',').map(s => s.trim()) || undefined,
      employmentType: params.get('employmentType') || undefined,
      yearsOfExperience: {
        min: params.get('yearsMin') ? parseInt(params.get('yearsMin')!) : undefined,
        max: params.get('yearsMax') ? parseInt(params.get('yearsMax')!) : undefined,
      },
      salaryRange: {
        min: params.get('salaryMin') ? parseInt(params.get('salaryMin')!) : undefined,
        max: params.get('salaryMax') ? parseInt(params.get('salaryMax')!) : undefined,
      },
      availabilityDate: {
        from: params.get('availableFrom') || undefined,
        to: params.get('availableTo') || undefined,
      },
      sortBy: params.get('sort') || undefined,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Saved Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Saved Searches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create New Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Save current search as..."
            value={newSearchName}
            onChange={(e) => setNewSearchName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createSavedSearch()}
          />
          <Button 
            onClick={createSavedSearch}
            disabled={!newSearchName.trim() || isCreating}
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Saved Searches List */}
        {savedSearches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No saved searches yet</p>
            <p className="text-sm">Save your current search to quickly access it later</p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{search.name}</h4>
                    {search.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Created {formatDate(search.createdAt)}</span>
                    {search.filters.query && (
                      <span>• "{search.filters.query}"</span>
                    )}
                    {search.filters.city && (
                      <span>• {search.filters.city}</span>
                    )}
                    {search.filters.skills?.length && (
                      <span>• {search.filters.skills.length} skills</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadSearch(search)}
                    className="h-8 w-8 p-0"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                  
                  {!search.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAsDefault(search.id)}
                      className="h-8 w-8 p-0"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingId(search.id);
                      setEditingName(search.name);
                    }}
                    className="h-8 w-8 p-0"
                    title="Edit name"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSavedSearch(search.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    title="Delete search"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Edit Search Name</h3>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Enter new name"
                className="mb-4"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditingName('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateSavedSearch(editingId)}
                  disabled={!editingName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
