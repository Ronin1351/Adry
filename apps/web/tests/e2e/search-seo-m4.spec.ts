import { test, expect } from '@playwright/test';

test.describe('Search + SEO M4', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to workers page
    await page.goto('/workers');
  });

  test('should display search interface with filters', async ({ page }) => {
    // Check main elements are present
    await expect(page.locator('h1')).toContainText('Find Your Perfect Housekeeper');
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="filters-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="sort-controls"]')).toBeVisible();
  });

  test('should filter workers by location', async ({ page }) => {
    // Select province
    await page.selectOption('[data-testid="province-select"]', 'Metro Manila');
    await page.waitForLoadState('networkidle');
    
    // Check URL updated
    expect(page.url()).toContain('province=Metro%20Manila');
    
    // Select city
    await page.selectOption('[data-testid="city-select"]', 'Quezon City');
    await page.waitForLoadState('networkidle');
    
    // Check URL updated
    expect(page.url()).toContain('city=Quezon%20City');
    
    // Verify results show location filter
    await expect(page.locator('[data-testid="active-filters"]')).toContainText('Quezon City');
  });

  test('should filter workers by skills', async ({ page }) => {
    // Select cooking skill
    await page.check('[data-testid="skill-cooking"]');
    await page.waitForLoadState('networkidle');
    
    // Check URL updated
    expect(page.url()).toContain('skills=cooking');
    
    // Select childcare skill
    await page.check('[data-testid="skill-childcare"]');
    await page.waitForLoadState('networkidle');
    
    // Check URL updated
    expect(page.url()).toContain('skills=cooking%2Cchildcare');
    
    // Verify results show skills filter
    await expect(page.locator('[data-testid="active-filters"]')).toContainText('cooking, childcare');
  });

  test('should filter workers by salary range', async ({ page }) => {
    // Set minimum salary
    await page.fill('[data-testid="salary-min"]', '10000');
    await page.fill('[data-testid="salary-max"]', '30000');
    await page.waitForLoadState('networkidle');
    
    // Check URL updated
    expect(page.url()).toContain('salary_min=10000');
    expect(page.url()).toContain('salary_max=30000');
    
    // Verify results show salary filter
    await expect(page.locator('[data-testid="active-filters"]')).toContainText('₱10,000 - ₱30,000');
  });

  test('should sort workers by different criteria', async ({ page }) => {
    // Sort by newest
    await page.selectOption('[data-testid="sort-select"]', 'newest');
    await page.waitForLoadState('networkidle');
    
    // Check URL updated
    expect(page.url()).toContain('sort=newest');
    
    // Sort by salary high to low
    await page.selectOption('[data-testid="sort-select"]', 'salary_high');
    await page.waitForLoadState('networkidle');
    
    // Check URL updated
    expect(page.url()).toContain('sort=salary_high');
  });

  test('should paginate through results', async ({ page }) => {
    // Wait for results to load
    await page.waitForSelector('[data-testid="worker-card"]');
    
    // Check if pagination is present
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      // Click next page
      await page.click('[data-testid="next-page"]');
      await page.waitForLoadState('networkidle');
      
      // Check URL updated
      expect(page.url()).toContain('page=2');
      
      // Click previous page
      await page.click('[data-testid="prev-page"]');
      await page.waitForLoadState('networkidle');
      
      // Check URL updated
      expect(page.url()).toContain('page=1');
    }
  });

  test('should display worker profile page with public fields only', async ({ page }) => {
    // Click on first worker card
    await page.waitForSelector('[data-testid="worker-card"]');
    await page.click('[data-testid="worker-card"]:first-child [data-testid="view-profile-button"]');
    
    // Check profile page loaded
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify public fields are displayed
    await expect(page.locator('[data-testid="worker-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="worker-location"]')).toBeVisible();
    await expect(page.locator('[data-testid="worker-skills"]')).toBeVisible();
    await expect(page.locator('[data-testid="worker-experience"]')).toBeVisible();
    await expect(page.locator('[data-testid="worker-salary"]')).toBeVisible();
    
    // Verify private fields are NOT displayed
    await expect(page.locator('[data-testid="worker-phone"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="worker-email"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="worker-address"]')).not.toBeVisible();
    
    // Verify contact information is gated
    await expect(page.locator('[data-testid="contact-gate"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-gate"]')).toContainText('Contact Information Available to Subscribers');
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    // Check workers page meta tags
    await expect(page.locator('title')).toContainText('Find Housekeepers');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Find.*housekeepers.*Philippines/);
    await expect(page.locator('meta[property="og:title"]')).toBeVisible();
    await expect(page.locator('meta[property="og:description"]')).toBeVisible();
    
    // Check canonical URL
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/workers/);
  });

  test('should have structured data for worker profiles', async ({ page }) => {
    // Navigate to a worker profile
    await page.waitForSelector('[data-testid="worker-card"]');
    await page.click('[data-testid="worker-card"]:first-child [data-testid="view-profile-button"]');
    
    // Check for JSON-LD structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toBeVisible();
    
    // Verify structured data contains Person schema
    const jsonContent = await structuredData.textContent();
    expect(jsonContent).toContain('"@type": "Person"');
    expect(jsonContent).toContain('"jobTitle": "Housekeeper"');
  });

  test('should enforce paywall on chat routes for unsubscribed employers', async ({ page }) => {
    // Try to access chat route directly
    await page.goto('/api/chat');
    
    // Should be redirected or show unauthorized
    await expect(page.locator('body')).toContainText(/unauthorized|forbidden|login/i);
  });

  test('should load saved searches for logged-in employers', async ({ page }) => {
    // Mock login as employer
    await page.goto('/auth/login');
    await page.fill('[data-testid="email"]', 'employer@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to workers page
    await page.goto('/workers');
    
    // Open saved searches modal
    await page.click('[data-testid="saved-searches-button"]');
    
    // Check modal is open
    await expect(page.locator('[data-testid="saved-searches-modal"]')).toBeVisible();
    
    // Check save current search functionality
    await page.fill('[data-testid="save-search-name"]', 'Test Search');
    await page.click('[data-testid="save-search-button"]');
    
    // Verify search was saved
    await expect(page.locator('[data-testid="saved-search-item"]')).toContainText('Test Search');
  });

  test('should handle search errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('/api/search/employees*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Search failed' })
      });
    });
    
    // Trigger search
    await page.fill('[data-testid="search-input"]', 'test');
    await page.waitForLoadState('networkidle');
    
    // Check error message is displayed
    await expect(page.locator('[data-testid="search-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-error"]')).toContainText('Search Error');
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Tab through filters
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Navigate through filter options with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    
    // Check that focus is visible and accessible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper image optimization', async ({ page }) => {
    // Check worker cards have optimized images
    await page.waitForSelector('[data-testid="worker-card"]');
    
    const images = page.locator('[data-testid="worker-photo"]');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      
      // Check image has proper attributes
      await expect(img).toHaveAttribute('loading', 'lazy');
      await expect(img).toHaveAttribute('alt');
      
      // Check image loads properly
      await expect(img).toBeVisible();
    }
  });

  test('should generate sitemap and robots.txt', async ({ page }) => {
    // Check sitemap
    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.status()).toBe(200);
    
    const sitemapContent = await sitemapResponse.text();
    expect(sitemapContent).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('/workers');
    
    // Check robots.txt
    const robotsResponse = await page.request.get('/robots.txt');
    expect(robotsResponse.status()).toBe(200);
    
    const robotsContent = await robotsResponse.text();
    expect(robotsContent).toContain('User-agent: *');
    expect(robotsContent).toContain('Sitemap:');
  });
});