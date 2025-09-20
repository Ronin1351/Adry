'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SearchErrorProps {
  error: string;
}

export function SearchError({ error }: SearchErrorProps) {
  const retrySearch = () => {
    window.location.reload();
  };

  return (
    <Card className="text-center py-12" data-testid="search-error">
      <CardContent>
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Search Error
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We encountered an error while searching for workers. Please try again.
        </p>

        <div className="space-y-4">
          <Button onClick={retrySearch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Error details:</p>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            {error}
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
