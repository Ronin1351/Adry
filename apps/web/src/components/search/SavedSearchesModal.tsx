'use client';

import { useState, useEffect } from 'react';
import { SearchFilters } from '@/lib/search/search-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Save, 
  Bookmark, 
  Edit, 
  Trash2, 
  Search,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedSearch {
  id: string;
  name: string;
  paramsJson: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface SavedSearchesModalProps {
  currentFilters: SearchFilters;
  onLoadSearch: (filters: SearchFilters) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SavedSearchesModal({ 
  currentFilters, 
  onLoadSearch, 
  isOpen, 
  onOpenChange 
}: SavedSearchesModalProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const { toast } = useToast();

  // Load saved searches
  useEffect(() => {
    if (isOpen) {
      loadSavedSearches();
    }
  }, [isOpen]);

  const loadSavedSearches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/saved-searches');
      
      if (!response.ok) {
        throw new Error('Failed to load saved searches');
      }
      
      const data = await response.json();
      setSavedSearches(data.savedSearches || []);
    } catch (error) {
      console.error('Error loading saved searches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved searches',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentSearch = async () => {
    if (!newSearchName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your saved search',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSearchName.trim(),
          paramsJson: currentFilters,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save search');
      }

      const data = await response.json();
      setSavedSearches(prev => [data.savedSearch, ...prev]);
      setNewSearchName('');
      
      toast({
        title: 'Success',
        description: 'Search saved successfully',
      });
    } catch (error) {
      console.error('Error saving search:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save search',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loadSearch = (search: SavedSearch) => {
    onLoadSearch(search.paramsJson as SearchFilters);
    onOpenChange(false);
    
    toast({
      title: 'Search Loaded',
      description: `Applied "${search.name}" filters`,
    });
  };

  const updateSearch = async (id: string, newName: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update search');
      }

      setSavedSearches(prev => 
        prev.map(search => 
          search.id === id 
            ? { ...search, name: newName.trim() }
            : search
        )
      );
      setEditingId(null);
      setEditingName('');
      
      toast({
        title: 'Success',
        description: 'Search updated successfully',
      });
    } catch (error) {
      console.error('Error updating search:', error);
      toast({
        title: 'Error',
        description: 'Failed to update search',
        variant: 'destructive',
      });
    }
  };

  const deleteSearch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) {
      return;
    }

    try {
      const response = await fetch(`/api/saved-searches/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete search');
      }

      setSavedSearches(prev => prev.filter(search => search.id !== id));
      
      toast({
        title: 'Success',
        description: 'Search deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting search:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete search',
        variant: 'destructive',
      });
    }
  };

  const startEditing = (search: SavedSearch) => {
    setEditingId(search.id);
    setEditingName(search.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const getFilterSummary = (filters: Record<string, any>) => {
    const parts = [];
    if (filters.query) parts.push(`"${filters.query}"`);
    if (filters.city) parts.push(filters.city);
    if (filters.province) parts.push(filters.province);
    if (filters.skills?.length) parts.push(`${filters.skills.length} skills`);
    if (filters.live_in_out) parts.push(filters.live_in_out);
    if (filters.salary_min || filters.salary_max) parts.push('Salary range');
    
    return parts.length > 0 ? parts.join(', ') : 'No filters';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="saved-searches-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Saved Searches
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Save Current Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Save Current Search</h3>
            <div className="flex gap-2">
              <Input
                data-testid="save-search-name"
                placeholder="Enter search name..."
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveCurrentSearch();
                  }
                }}
              />
              <Button 
                data-testid="save-search-button"
                onClick={saveCurrentSearch}
                disabled={isSaving || !newSearchName.trim()}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Current filters: {getFilterSummary(currentFilters)}
            </p>
          </div>

          {/* Saved Searches List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Saved Searches</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : savedSearches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No saved searches yet</p>
                <p className="text-sm">Save your current search to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    data-testid="saved-search-item"
                  >
                    <div className="flex-1 min-w-0">
                      {editingId === search.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateSearch(search.id, editingName);
                              } else if (e.key === 'Escape') {
                                cancelEditing();
                              }
                            }}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => updateSearch(search.id, editingName)}
                            disabled={!editingName.trim()}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-medium text-gray-900">{search.name}</h4>
                          <p className="text-sm text-gray-600">
                            {getFilterSummary(search.paramsJson)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Saved {new Date(search.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {editingId !== search.id && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadSearch(search)}
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(search)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSearch(search.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
