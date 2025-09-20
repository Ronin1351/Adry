import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST!,
  apiKey: process.env.MEILISEARCH_API_KEY!,
});

export const searchClient = client;

// Search indexes
export const INDEXES = {
  PROFILES: 'employee_profiles',
  EMPLOYERS: 'employers',
} as const;

// Search configuration
export const searchConfig = {
  searchableAttributes: [
    'name',
    'skills',
    'location',
    'experienceText',
    'bio',
  ],
  filterableAttributes: [
    'location',
    'skills',
    'civilStatus',
    'liveIn',
    'salaryMin',
    'salaryMax',
    'availabilityDate',
    'visibility',
  ],
  sortableAttributes: [
    'createdAt',
    'salaryMin',
    'salaryMax',
    'experience',
  ],
  rankingRules: [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
  ],
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: 4,
  },
  synonyms: {
    'housekeeper': ['maid', 'domestic helper', 'house help'],
    'cooking': ['chef', 'kitchen', 'meal preparation'],
    'childcare': ['babysitting', 'nanny', 'child care'],
    'cleaning': ['housekeeping', 'house cleaning', 'domestic work'],
  },
};

// Search functions
export async function searchProfiles(query: string, filters: Record<string, any> = {}) {
  const index = searchClient.index(INDEXES.PROFILES);
  
  const searchParams = {
    q: query,
    filters: Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key} IN [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          return `${key} >= ${value.min} AND ${key} <= ${value.max}`;
        }
        return `${key} = "${value}"`;
      })
      .join(' AND '),
    limit: 20,
    offset: 0,
  };

  return await index.search(searchParams.q, {
    filter: searchParams.filters,
    limit: searchParams.limit,
    offset: searchParams.offset,
  });
}

export async function indexProfile(profile: any) {
  const index = searchClient.index(INDEXES.PROFILES);
  return await index.addDocuments([profile]);
}

export async function updateProfile(profile: any) {
  const index = searchClient.index(INDEXES.PROFILES);
  return await index.updateDocuments([profile]);
}

export async function deleteProfile(profileId: string) {
  const index = searchClient.index(INDEXES.PROFILES);
  return await index.deleteDocument(profileId);
}

// Initialize search indexes
export async function initializeSearch() {
  try {
    // Create profiles index
    await searchClient.createIndex(INDEXES.PROFILES, {
      primaryKey: 'id',
    });

    // Configure profiles index
    const profilesIndex = searchClient.index(INDEXES.PROFILES);
    await profilesIndex.updateSearchableAttributes(searchConfig.searchableAttributes);
    await profilesIndex.updateFilterableAttributes(searchConfig.filterableAttributes);
    await profilesIndex.updateSortableAttributes(searchConfig.sortableAttributes);
    await profilesIndex.updateRankingRules(searchConfig.rankingRules);
    await profilesIndex.updateTypoTolerance(searchConfig.typoTolerance);
    await profilesIndex.updateSynonyms(searchConfig.synonyms);

    console.log('✅ Search indexes initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing search indexes:', error);
  }
}
