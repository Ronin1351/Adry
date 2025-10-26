'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SearchFilters } from '@/lib/search/search-utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface SearchPaginationProps {
  filters: SearchFilters;
  totalHits: number;
  currentPage?: number;
  totalPages?: number;
}

export function SearchPagination({
  filters,
  totalHits,
  currentPage = 1,
  totalPages = 1,
}: SearchPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Prefer filters.pageSize if available; fallback to 24
  const pageSize = (filters as any)?.pageSize ?? 24;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const visiblePages = useMemo<(number | string)[]>(() => {
    const delta = 2;
    const range: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const out: (number | string)[] = [];
    if (currentPage - delta > 2) out.push(1, '...');
    else out.push(1);

    out.push(...range);

    if (currentPage + delta < totalPages - 1) out.push('...', totalPages);
    else if (totalPages > 1) out.push(totalPages);

    return out;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const startItem = totalHits === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalHits);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of {totalHits.toLocaleString()} results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2" data-testid="pagination">
        <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={currentPage === 1} className="hidden sm:flex">
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} data-testid="prev-page">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {visiblePages.map((p, idx) => {
            const isNum = typeof p === 'number';
            const isActive = isNum && p === currentPage;
            return (
              <div key={`${p}-${idx}`}>
                {p === '...' ? (
                  <span className="px-3 py-2 text-sm text-gray-500">…</span>
                ) : (
                  <Button
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => isNum && goToPage(p)}
                    className="w-10 h-10"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {p}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} data-testid="next-page">
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="hidden sm:flex">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
