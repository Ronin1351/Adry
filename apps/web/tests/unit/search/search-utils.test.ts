import { describe, it, expect } from 'vitest';
import {
  generateEmployeeSlug,
  parseEmployeeSlug,
  generateSearchCanonicalUrl,
  generateSearchPageTitle,
  generateSearchMetaDescription,
  formatCurrency,
  formatDate,
  getEmploymentTypeText,
  getExperienceBandText,
} from '@/lib/search/search-utils';

describe('Search Utils', () => {
  describe('generateEmployeeSlug', () => {
    it('should generate clean slug from name and city', () => {
      const slug = generateEmployeeSlug('Maria Santos', 'Quezon City', 'user123');
      expect(slug).toBe('maria-santos-quezon-city-user123');
    });

    it('should handle special characters in name and city', () => {
      const slug = generateEmployeeSlug('José María', 'San José del Monte', 'user456');
      expect(slug).toBe('jos-mar-a-san-jos-del-monte-user456');
    });

    it('should handle multiple spaces', () => {
      const slug = generateEmployeeSlug('Maria  Santos', 'Quezon  City', 'user789');
      expect(slug).toBe('maria-santos-quezon-city-user789');
    });
  });

  describe('parseEmployeeSlug', () => {
    it('should parse valid slug correctly', () => {
      const result = parseEmployeeSlug('maria-santos-quezon-city-user123');
      expect(result).toEqual({
        userId: 'user123',
        firstName: 'maria-santos',
        city: 'quezon-city',
      });
    });

    it('should return null for invalid slug', () => {
      const result = parseEmployeeSlug('invalid-slug');
      expect(result).toBeNull();
    });

    it('should handle complex names and cities', () => {
      const result = parseEmployeeSlug('jos-mar-a-san-jos-del-monte-user456');
      expect(result).toEqual({
        userId: 'user456',
        firstName: 'jos-mar-a',
        city: 'san-jos-del-monte',
      });
    });
  });

  describe('generateSearchCanonicalUrl', () => {
    it('should generate basic URL with no filters', () => {
      const url = generateSearchCanonicalUrl({
        skills: [],
        page: 1,
        sort: 'relevance',
      });
      expect(url).toBe('/workers');
    });

    it('should generate URL with query parameter', () => {
      const url = generateSearchCanonicalUrl({
        query: 'cooking',
        skills: [],
        page: 1,
        sort: 'relevance',
      });
      expect(url).toBe('/workers?q=cooking');
    });

    it('should generate URL with multiple filters', () => {
      const url = generateSearchCanonicalUrl({
        query: 'nanny',
        city: 'Quezon City',
        province: 'Metro Manila',
        skills: ['cooking', 'childcare'],
        live_in_out: 'LIVE_IN',
        salary_min: 10000,
        salary_max: 30000,
        page: 2,
        sort: 'newest',
      });
      expect(url).toContain('q=nanny');
      expect(url).toContain('city=Quezon%20City');
      expect(url).toContain('province=Metro%20Manila');
      expect(url).toContain('skills=cooking%2Cchildcare');
      expect(url).toContain('live_in_out=LIVE_IN');
      expect(url).toContain('salary_min=10000');
      expect(url).toContain('salary_max=30000');
      expect(url).toContain('page=2');
      expect(url).toContain('sort=newest');
    });
  });

  describe('generateSearchPageTitle', () => {
    it('should generate basic title with no filters', () => {
      const title = generateSearchPageTitle({
        skills: [],
        page: 1,
        sort: 'relevance',
      }, 50);
      expect(title).toBe('Find Housekeepers & Domestic Helpers | Adry');
    });

    it('should include city and province in title', () => {
      const title = generateSearchPageTitle({
        city: 'Quezon City',
        province: 'Metro Manila',
        skills: [],
        page: 1,
        sort: 'relevance',
      }, 25);
      expect(title).toBe('Housekeepers in Quezon City, Metro Manila | Adry');
    });

    it('should include skills in title', () => {
      const title = generateSearchPageTitle({
        skills: ['cooking', 'childcare'],
        page: 1,
        sort: 'relevance',
      }, 30);
      expect(title).toBe('cooking, childcare Services - Find Housekeepers & Domestic Helpers | Adry');
    });

    it('should include employment type in title', () => {
      const title = generateSearchPageTitle({
        live_in_out: 'LIVE_IN',
        skills: [],
        page: 1,
        sort: 'relevance',
      }, 20);
      expect(title).toBe('Live-in Find Housekeepers & Domestic Helpers | Adry');
    });

    it('should include query in title', () => {
      const title = generateSearchPageTitle({
        query: 'experienced nanny',
        skills: [],
        page: 1,
        sort: 'relevance',
      }, 15);
      expect(title).toBe('"experienced nanny" - Find Housekeepers & Domestic Helpers | Adry');
    });
  });

  describe('generateSearchMetaDescription', () => {
    it('should generate basic description', () => {
      const description = generateSearchMetaDescription({
        skills: [],
        page: 1,
        sort: 'relevance',
      }, 100);
      expect(description).toContain('Find 100 verified housekeepers');
    });

    it('should include location in description', () => {
      const description = generateSearchMetaDescription({
        city: 'Quezon City',
        province: 'Metro Manila',
        skills: [],
        page: 1,
        sort: 'relevance',
      }, 50);
      expect(description).toContain('in Quezon City, Metro Manila');
    });

    it('should include skills in description', () => {
      const description = generateSearchMetaDescription({
        skills: ['cooking', 'childcare'],
        page: 1,
        sort: 'relevance',
      }, 75);
      expect(description).toContain('specializing in cooking, childcare');
    });

    it('should include salary range in description', () => {
      const description = generateSearchMetaDescription({
        salary_min: 15000,
        salary_max: 25000,
        skills: [],
        page: 1,
        sort: 'relevance',
      }, 60);
      expect(description).toContain('with salary range ₱15,000 - ₱25,000');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in PHP', () => {
      expect(formatCurrency(15000)).toBe('₱15,000');
      expect(formatCurrency(250000)).toBe('₱250,000');
      expect(formatCurrency(1000)).toBe('₱1,000');
    });
  });

  describe('formatDate', () => {
    it('should format date in Philippine locale', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date.toISOString());
      expect(formatted).toContain('January');
      expect(formatted).toContain('2024');
    });
  });

  describe('getEmploymentTypeText', () => {
    it('should return correct text for employment types', () => {
      expect(getEmploymentTypeText('LIVE_IN')).toBe('Live-in');
      expect(getEmploymentTypeText('LIVE_OUT')).toBe('Live-out');
      expect(getEmploymentTypeText('BOTH')).toBe('Live-in & Live-out');
      expect(getEmploymentTypeText('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('getExperienceBandText', () => {
    it('should return correct text for experience bands', () => {
      expect(getExperienceBandText('0-1')).toBe('0-1 years');
      expect(getExperienceBandText('2-3')).toBe('2-3 years');
      expect(getExperienceBandText('4-5')).toBe('4-5 years');
      expect(getExperienceBandText('6+')).toBe('6+ years');
      expect(getExperienceBandText('UNKNOWN')).toBe('UNKNOWN');
    });
  });
});
