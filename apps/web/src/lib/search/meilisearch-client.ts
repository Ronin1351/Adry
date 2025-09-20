import { MeiliSearch } from 'meilisearch';

// Meilisearch configuration
const MEILISEARCH_CONFIG = {
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY || 'masterKey',
};

// Initialize Meilisearch client
export const meilisearch = new MeiliSearch(MEILISEARCH_CONFIG);

// Index configuration
export const EMPLOYEES_INDEX = 'employees_public';

// Search document interface
export interface EmployeeSearchDocument {
  id: string;                    // userId
  first_name: string;
  city: string;
  province: string;
  skills: string[];
  years_of_experience: number;
  live_in_out: 'LIVE_IN' | 'LIVE_OUT' | 'BOTH';
  headline?: string;
  availability_date?: string;    // ISO date
  salary_min: number;
  salary_max: number;
  updated_at: string;           // ISO timestamp
  slug: string;                 // SEO-friendly URL slug
  experience_band: string;      // Computed: 0-1, 2-3, 4-5, 6+
}

// Index settings
export const INDEX_SETTINGS = {
  searchableAttributes: [
    'first_name',
    'headline', 
    'skills',
    'city',
    'province'
  ],
  filterableAttributes: [
    'city',
    'province', 
    'skills',
    'live_in_out',
    'experience_band'
  ],
  sortableAttributes: [
    'updated_at',
    'salary_max',
    'years_of_experience'
  ],
  rankingRules: [
    'words',
    'typo', 
    'proximity',
    'attribute',
    'sort',
    'exactness'
  ],
  customRanking: [
    'desc(updated_at)',
    'desc(salary_max)'
  ],
  synonyms: {
    'yaya': ['childcare', 'babysitter', 'nanny'],
    'elderly care': ['caregiver', 'senior care'],
    'laundry': ['ironing', 'washing'],
    'katulong': ['housekeeper', 'maid', 'helper'],
    'kasambahay': ['housekeeper', 'domestic helper'],
    'cook': ['cooking', 'chef', 'luto'],
    'driver': ['driving', 'chauffeur', 'tsuper'],
    'gardener': ['gardening', 'landscaping', 'hardinero'],
    'pet care': ['animal care', 'alaga ng hayop'],
    'ironing': ['pressing', 'plantsa'],
  },
  stopWords: [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
  ],
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: { 
      oneTypo: 4, 
      twoTypos: 8 
    },
    disableOnWords: [],
    disableOnAttributes: [],
  },
  faceting: {
    maxValuesPerFacet: 100,
    sortFacetValuesBy: { '*': 'alpha' },
  },
  pagination: {
    maxTotalHits: 10000,
  },
};

// Initialize the index
export async function initializeEmployeesIndex() {
  try {
    // Check if index exists
    const indexes = await meilisearch.getIndexes();
    const indexExists = indexes.results.some(index => index.uid === EMPLOYEES_INDEX);

    if (!indexExists) {
      // Create index
      await meilisearch.createIndex(EMPLOYEES_INDEX, {
        primaryKey: 'id',
      });
      console.log(`Created index: ${EMPLOYEES_INDEX}`);
    }

    // Get index instance
    const index = meilisearch.index(EMPLOYEES_INDEX);

    // Configure index settings
    await index.updateSettings(INDEX_SETTINGS);

    console.log(`Index ${EMPLOYEES_INDEX} initialized successfully`);
    return index;
  } catch (error) {
    console.error('Error initializing Meilisearch index:', error);
    throw error;
  }
}

// Get index instance
export function getEmployeesIndex() {
  return meilisearch.index(EMPLOYEES_INDEX);
}

// Health check
export async function checkMeilisearchHealth() {
  try {
    const health = await meilisearch.health();
    return { status: 'healthy', ...health };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
