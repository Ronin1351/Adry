import { NextRequest, NextResponse } from 'next/server';
import { getEmployeesIndex } from '@/lib/search/meilisearch-client';
import { z } from 'zod';

const searchQuerySchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  skills: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  live_in_out: z.enum(['LIVE_IN', 'LIVE_OUT', 'BOTH']).optional(),
  experience_band: z.string().optional(),
  salary_min: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  salary_max: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  availability_date: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  sort: z.enum(['relevance', 'newest', 'salary_high', 'salary_low', 'experience_high', 'experience_low']).optional(),
});

// GET /api/search/employees - Search employee profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate search parameters
    const queryParams = Object.fromEntries(searchParams.entries());
    const validatedParams = searchQuerySchema.parse(queryParams);

    const index = getEmployeesIndex();
    const pageSize = 24;
    const page = validatedParams.page || 1;
    const offset = (page - 1) * pageSize;

    // Build filter string
    const filterParts: string[] = [];

    if (validatedParams.city) {
      filterParts.push(`city = "${validatedParams.city}"`);
    }

    if (validatedParams.province) {
      filterParts.push(`province = "${validatedParams.province}"`);
    }

    if (validatedParams.skills && validatedParams.skills.length > 0) {
      const skillFilters = validatedParams.skills.map(skill => `skills = "${skill}"`);
      filterParts.push(`(${skillFilters.join(' OR ')})`);
    }

    if (validatedParams.live_in_out) {
      if (validatedParams.live_in_out === 'BOTH') {
        filterParts.push(`(live_in_out = "LIVE_IN" OR live_in_out = "LIVE_OUT")`);
      } else {
        filterParts.push(`live_in_out = "${validatedParams.live_in_out}"`);
      }
    }

    if (validatedParams.experience_band) {
      filterParts.push(`experience_band = "${validatedParams.experience_band}"`);
    }

    if (validatedParams.salary_min !== undefined) {
      filterParts.push(`salary_max >= ${validatedParams.salary_min}`);
    }

    if (validatedParams.salary_max !== undefined) {
      filterParts.push(`salary_min <= ${validatedParams.salary_max}`);
    }

    if (validatedParams.availability_date) {
      filterParts.push(`availability_date >= "${validatedParams.availability_date}"`);
    }

    // Build sort array
    let sort: string[] = [];
    switch (validatedParams.sort) {
      case 'newest':
        sort = ['updated_at:desc'];
        break;
      case 'salary_high':
        sort = ['salary_max:desc'];
        break;
      case 'salary_low':
        sort = ['salary_min:asc'];
        break;
      case 'experience_high':
        sort = ['years_of_experience:desc'];
        break;
      case 'experience_low':
        sort = ['years_of_experience:asc'];
        break;
      case 'relevance':
      default:
        // Meilisearch will use relevance by default
        break;
    }

    // Perform search
    const searchParams = {
      q: validatedParams.q || '',
      filter: filterParts.length > 0 ? filterParts.join(' AND ') : undefined,
      sort,
      offset,
      limit: pageSize,
      facets: ['city', 'province', 'skills', 'live_in_out', 'experience_band'],
    };

    const response = await index.search(validatedParams.q || '', searchParams);

    // Calculate pagination info
    const totalPages = Math.ceil(response.totalHits / pageSize);

    return NextResponse.json({
      hits: response.hits,
      totalHits: response.totalHits,
      page,
      totalPages,
      facets: response.facetsDistribution,
      processingTimeMs: response.processingTimeMs,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}