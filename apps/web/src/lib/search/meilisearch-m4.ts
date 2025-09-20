import { MeiliSearch } from 'meilisearch';

// Meilisearch configuration
const MEILISEARCH_CONFIG = {
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY || 'masterKey',
  indexName: 'employees_public',
};

// Initialize Meilisearch client
const client = new MeiliSearch(MEILISEARCH_CONFIG);

// Search configuration
export const SEARCH_CONFIG = {
  indexName: MEILISEARCH_CONFIG.indexName,
  pageSize: 24,
  maxResults: 1000,
  attributesToSearch: ['firstName', 'headline', 'skills', 'city', 'province'],
  attributesToRetrieve: [
    'id',
    'userId',
    'firstName',
    'city',
    'province',
    'age',
    'civilStatus',
    'skills',
    'employmentType',
    'experience',
    'headline',
    'availabilityDate',
    'salaryMin',
    'salaryMax',
    'photoUrl',
    'profileScore',
    'updatedAt',
  ],
  attributesForFaceting: [
    'city',
    'province',
    'skills',
    'employmentType',
    'yearsOfExperience',
    'salaryRange',
  ],
  sortableAttributes: [
    'updatedAt',
    'salaryMax',
    'experience',
    'profileScore',
  ],
  filterableAttributes: [
    'city',
    'province',
    'skills',
    'employmentType',
    'yearsOfExperience',
    'salaryRange',
    'availabilityDate',
  ],
  searchableAttributes: [
    'firstName',
    'headline',
    'skills',
    'city',
    'province',
  ],
  synonyms: {
    'yaya': ['childcare', 'babysitter', 'nanny'],
    'katulong': ['housekeeper', 'maid', 'helper'],
    'kasambahay': ['housekeeper', 'domestic helper'],
    'cook': ['cooking', 'chef', 'luto'],
    'driver': ['driving', 'chauffeur', 'tsuper'],
    'gardener': ['gardening', 'landscaping', 'hardinero'],
    'laundry': ['washing', 'labada'],
    'ironing': ['pressing', 'plantsa'],
    'elderly care': ['senior care', 'alaga ng matanda'],
    'pet care': ['animal care', 'alaga ng hayop'],
  },
  stopWords: ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
};

// Search interface
export interface SearchFilters {
  query?: string;
  city?: string;
  province?: string;
  skills?: string[];
  employmentType?: 'LIVE_IN' | 'LIVE_OUT' | 'BOTH';
  yearsOfExperience?: {
    min?: number;
    max?: number;
  };
  salaryRange?: {
    min?: number;
    max?: number;
  };
  availabilityDate?: {
    from?: string;
    to?: string;
  };
  page?: number;
  sortBy?: 'relevance' | 'newest' | 'salary_high' | 'salary_low' | 'experience_high' | 'experience_low';
}

export interface SearchResult {
  id: string;
  userId: string;
  firstName: string;
  city: string;
  province: string;
  age: number;
  civilStatus: string;
  skills: string[];
  employmentType: string;
  experience: number;
  headline?: string;
  availabilityDate?: string;
  salaryMin: number;
  salaryMax: number;
  photoUrl?: string;
  profileScore: number;
  updatedAt: string;
}

export interface SearchResponse {
  hits: SearchResult[];
  totalHits: number;
  page: number;
  totalPages: number;
  facets?: Record<string, Record<string, number>>;
  processingTimeMs: number;
}

// Search service class
export class SearchService {
  private index = client.index(SEARCH_CONFIG.indexName);

  // Initialize the search index
  async initializeIndex() {
    try {
      // Check if index exists
      const indexes = await client.getIndexes();
      const indexExists = indexes.results.some(index => index.uid === SEARCH_CONFIG.indexName);

      if (!indexExists) {
        // Create index
        await client.createIndex(SEARCH_CONFIG.indexName, {
          primaryKey: 'id',
        });
      }

      // Configure index settings
      await this.index.updateSettings({
        searchableAttributes: SEARCH_CONFIG.searchableAttributes,
        filterableAttributes: SEARCH_CONFIG.filterableAttributes,
        sortableAttributes: SEARCH_CONFIG.sortableAttributes,
        attributesForFaceting: SEARCH_CONFIG.attributesForFaceting,
        attributesToRetrieve: SEARCH_CONFIG.attributesToRetrieve,
        synonyms: SEARCH_CONFIG.synonyms,
        stopWords: SEARCH_CONFIG.stopWords,
        typoTolerance: {
          enabled: true,
          minWordSizeForTypos: {
            oneTypo: 4,
            twoTypos: 8,
          },
          disableOnWords: [],
          disableOnAttributes: [],
        },
        faceting: {
          maxValuesPerFacet: 100,
          sortFacetValuesBy: { '*': 'alpha' },
        },
        pagination: {
          maxTotalHits: SEARCH_CONFIG.maxResults,
        },
      });

      console.log('Meilisearch index initialized successfully');
    } catch (error) {
      console.error('Error initializing Meilisearch index:', error);
      throw error;
    }
  }

  // Add or update employee profile in search index
  async indexEmployeeProfile(profile: any) {
    try {
      // Only index public fields
      const searchDocument = {
        id: profile.userId,
        userId: profile.userId,
        firstName: profile.firstName,
        city: profile.city,
        province: profile.province,
        age: profile.age,
        civilStatus: profile.civilStatus,
        skills: profile.skills || [],
        employmentType: profile.employmentType,
        experience: profile.experience,
        headline: profile.headline,
        availabilityDate: profile.availabilityDate,
        salaryMin: profile.salaryMin,
        salaryMax: profile.salaryMax,
        photoUrl: profile.photoUrl,
        profileScore: profile.profileScore || 0,
        updatedAt: profile.updatedAt,
        // Add computed fields for faceting
        yearsOfExperience: this.getExperienceBand(profile.experience),
        salaryRange: this.getSalaryRange(profile.salaryMin, profile.salaryMax),
      };

      await this.index.addDocuments([searchDocument]);
      console.log(`Indexed employee profile: ${profile.userId}`);
    } catch (error) {
      console.error('Error indexing employee profile:', error);
      throw error;
    }
  }

  // Remove employee profile from search index
  async removeEmployeeProfile(userId: string) {
    try {
      await this.index.deleteDocument(userId);
      console.log(`Removed employee profile from index: ${userId}`);
    } catch (error) {
      console.error('Error removing employee profile from index:', error);
      throw error;
    }
  }

  // Search employee profiles
  async searchProfiles(filters: SearchFilters): Promise<SearchResponse> {
    try {
      const {
        query = '',
        city,
        province,
        skills,
        employmentType,
        yearsOfExperience,
        salaryRange,
        availabilityDate,
        page = 1,
        sortBy = 'relevance',
      } = filters;

      // Build filter string
      const filterParts: string[] = [];

      if (city) {
        filterParts.push(`city = "${city}"`);
      }

      if (province) {
        filterParts.push(`province = "${province}"`);
      }

      if (skills && skills.length > 0) {
        const skillFilters = skills.map(skill => `skills = "${skill}"`);
        filterParts.push(`(${skillFilters.join(' OR ')})`);
      }

      if (employmentType) {
        if (employmentType === 'BOTH') {
          filterParts.push(`(employmentType = "LIVE_IN" OR employmentType = "LIVE_OUT")`);
        } else {
          filterParts.push(`employmentType = "${employmentType}"`);
        }
      }

      if (yearsOfExperience) {
        if (yearsOfExperience.min !== undefined) {
          filterParts.push(`experience >= ${yearsOfExperience.min}`);
        }
        if (yearsOfExperience.max !== undefined) {
          filterParts.push(`experience <= ${yearsOfExperience.max}`);
        }
      }

      if (salaryRange) {
        if (salaryRange.min !== undefined) {
          filterParts.push(`salaryMax >= ${salaryRange.min}`);
        }
        if (salaryRange.max !== undefined) {
          filterParts.push(`salaryMin <= ${salaryRange.max}`);
        }
      }

      if (availabilityDate) {
        if (availabilityDate.from) {
          filterParts.push(`availabilityDate >= "${availabilityDate.from}"`);
        }
        if (availabilityDate.to) {
          filterParts.push(`availabilityDate <= "${availabilityDate.to}"`);
        }
      }

      // Build sort array
      let sort: string[] = [];
      switch (sortBy) {
        case 'newest':
          sort = ['updatedAt:desc'];
          break;
        case 'salary_high':
          sort = ['salaryMax:desc'];
          break;
        case 'salary_low':
          sort = ['salaryMin:asc'];
          break;
        case 'experience_high':
          sort = ['experience:desc'];
          break;
        case 'experience_low':
          sort = ['experience:asc'];
          break;
        case 'relevance':
        default:
          // Meilisearch will use relevance by default
          break;
      }

      // Perform search
      const searchParams = {
        q: query,
        filter: filterParts.length > 0 ? filterParts.join(' AND ') : undefined,
        sort,
        page,
        hitsPerPage: SEARCH_CONFIG.pageSize,
        facets: SEARCH_CONFIG.attributesForFaceting,
        attributesToRetrieve: SEARCH_CONFIG.attributesToRetrieve,
        attributesToSearch: SEARCH_CONFIG.attributesToSearch,
      };

      const response = await this.index.search(query, searchParams);

      // Calculate pagination info
      const totalPages = Math.ceil(response.totalHits / SEARCH_CONFIG.pageSize);

      return {
        hits: response.hits as SearchResult[],
        totalHits: response.totalHits,
        page,
        totalPages,
        facets: response.facetsDistribution,
        processingTimeMs: response.processingTimeMs,
      };
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  }

  // Get search facets for filter options
  async getSearchFacets() {
    try {
      const response = await this.index.search('', {
        facets: SEARCH_CONFIG.attributesForFaceting,
        hitsPerPage: 0,
      });

      return response.facetsDistribution;
    } catch (error) {
      console.error('Error getting search facets:', error);
      throw error;
    }
  }

  // Helper methods
  private getExperienceBand(experience: number): string {
    if (experience < 1) return '0-1';
    if (experience < 3) return '1-3';
    if (experience < 5) return '3-5';
    if (experience < 10) return '5-10';
    return '10+';
  }

  private getSalaryRange(min: number, max: number): string {
    const avg = (min + max) / 2;
    if (avg < 5000) return '0-5k';
    if (avg < 10000) return '5k-10k';
    if (avg < 15000) return '10k-15k';
    if (avg < 20000) return '15k-20k';
    if (avg < 25000) return '20k-25k';
    return '25k+';
  }

  // Bulk index employee profiles
  async bulkIndexProfiles(profiles: any[]) {
    try {
      const searchDocuments = profiles.map(profile => ({
        id: profile.userId,
        userId: profile.userId,
        firstName: profile.firstName,
        city: profile.city,
        province: profile.province,
        age: profile.age,
        civilStatus: profile.civilStatus,
        skills: profile.skills || [],
        employmentType: profile.employmentType,
        experience: profile.experience,
        headline: profile.headline,
        availabilityDate: profile.availabilityDate,
        salaryMin: profile.salaryMin,
        salaryMax: profile.salaryMax,
        photoUrl: profile.photoUrl,
        profileScore: profile.profileScore || 0,
        updatedAt: profile.updatedAt,
        yearsOfExperience: this.getExperienceBand(profile.experience),
        salaryRange: this.getSalaryRange(profile.salaryMin, profile.salaryMax),
      }));

      await this.index.addDocuments(searchDocuments);
      console.log(`Bulk indexed ${profiles.length} employee profiles`);
    } catch (error) {
      console.error('Error bulk indexing profiles:', error);
      throw error;
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query: string, limit: number = 5) {
    try {
      const response = await this.index.search(query, {
        hitsPerPage: limit,
        attributesToRetrieve: ['firstName', 'city', 'province', 'skills'],
      });

      return response.hits.map((hit: any) => ({
        type: 'profile',
        id: hit.id,
        firstName: hit.firstName,
        city: hit.city,
        province: hit.province,
        skills: hit.skills,
      }));
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const searchService = new SearchService();
