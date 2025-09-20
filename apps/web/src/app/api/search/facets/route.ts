import { NextRequest, NextResponse } from 'next/server';
import { getEmployeesIndex } from '@/lib/search/meilisearch-client';

// GET /api/search/facets - Get search facets for filters
export async function GET(request: NextRequest) {
  try {
    const index = getEmployeesIndex();
    
    // Get facets by performing an empty search
    const response = await index.search('', {
      facets: ['city', 'province', 'skills', 'live_in_out', 'experience_band'],
      hitsPerPage: 0,
    });

    // Transform facets into a more usable format
    const facets = {
      cities: response.facetsDistribution?.city || {},
      provinces: response.facetsDistribution?.province || {},
      skills: response.facetsDistribution?.skills || {},
      live_in_out: response.facetsDistribution?.live_in_out || {},
      experience_bands: response.facetsDistribution?.experience_band || {},
    };

    return NextResponse.json(facets);
  } catch (error) {
    console.error('Search facets error:', error);
    return NextResponse.json(
      { error: 'Failed to get facets' },
      { status: 500 }
    );
  }
}