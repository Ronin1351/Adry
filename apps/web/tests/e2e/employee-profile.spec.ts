import { test, expect } from '@playwright/test';

test.describe('Employee Profile M2', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the employee profile page
    await page.goto('/employee/profile');
  });

  test('Employee can create and update their own profile', async ({ page }) => {
    // Test profile creation flow
    await test.step('Create new employee profile', async () => {
      // Fill basic information
      await page.fill('[data-testid="firstName"]', 'Maria');
      await page.fill('[data-testid="lastName"]', 'Dela Cruz');
      await page.fill('[data-testid="age"]', '28');
      await page.selectOption('[data-testid="civilStatus"]', 'SINGLE');
      await page.fill('[data-testid="city"]', 'Quezon City');
      await page.fill('[data-testid="province"]', 'Metro Manila');
      await page.fill('[data-testid="exactAddress"]', '123 Main Street, Barangay 1, Quezon City');
      await page.fill('[data-testid="phone"]', '+639171234567');
      await page.fill('[data-testid="email"]', 'maria@example.com');

      // Move to professional information
      await page.click('[data-testid="tab-professional"]');
      await page.fill('[data-testid="headline"]', 'Experienced housekeeper with 5 years of experience');
      await page.fill('[data-testid="experience"]', '5');
      
      // Select skills
      await page.check('[data-testid="skill-cooking"]');
      await page.check('[data-testid="skill-cleaning"]');
      await page.check('[data-testid="skill-childcare"]');

      // Move to preferences
      await page.click('[data-testid="tab-preferences"]');
      
      // Set salary range using sliders
      await page.locator('[data-testid="salary-min-slider"]').fill('8000');
      await page.locator('[data-testid="salary-max-slider"]').fill('15000');
      
      // Set employment type
      await page.click('[data-testid="employment-type-live-out"]');
      
      // Set days off
      await page.check('[data-testid="day-off-sunday"]');
      await page.check('[data-testid="day-off-wednesday"]');
      
      // Set work preferences
      await page.check('[data-testid="overtime-toggle"]');
      await page.check('[data-testid="holiday-work-toggle"]');
      await page.check('[data-testid="visibility-toggle"]');

      // Move to references
      await page.click('[data-testid="tab-references"]');
      await page.fill('[data-testid="reference-0-name"]', 'Juan Santos');
      await page.fill('[data-testid="reference-0-relationship"]', 'Previous Employer');
      await page.fill('[data-testid="reference-0-company"]', 'Santos Household');
      await page.fill('[data-testid="reference-0-phone"]', '+639187654321');
      await page.fill('[data-testid="reference-0-email"]', 'juan@example.com');
      await page.fill('[data-testid="reference-0-duration"]', '2 years');

      // Submit the form
      await page.click('[data-testid="submit-profile"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Profile created successfully');
    });

    // Test profile update flow
    await test.step('Update existing profile', async () => {
      // Navigate to profile edit page
      await page.goto('/employee/profile/edit');
      
      // Update some fields
      await page.fill('[data-testid="headline"]', 'Experienced housekeeper with 6 years of experience');
      await page.fill('[data-testid="experience"]', '6');
      
      // Update salary range
      await page.locator('[data-testid="salary-min-slider"]').fill('9000');
      await page.locator('[data-testid="salary-max-slider"]').fill('16000');
      
      // Save changes
      await page.click('[data-testid="save-profile"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Profile updated successfully');
    });

    // Test profile completeness scoring
    await test.step('Verify profile completeness scoring', async () => {
      await page.goto('/employee/profile');
      
      // Check that profile completeness is displayed
      await expect(page.locator('[data-testid="profile-completeness"]')).toBeVisible();
      
      // Check that the score is reasonable (should be high after filling all fields)
      const scoreElement = page.locator('[data-testid="profile-score"]');
      await expect(scoreElement).toBeVisible();
      
      const scoreText = await scoreElement.textContent();
      const score = parseInt(scoreText?.replace('%', '') || '0');
      expect(score).toBeGreaterThan(80); // Should be high after completing all fields
    });
  });

  test('Employee cannot access other employees profiles', async ({ page }) => {
    // Test that employee cannot access another employee's profile
    await test.step('Attempt to access another employee profile', async () => {
      // Try to access another employee's profile
      await page.goto('/employee-profile/other-employee-id');
      
      // Should be redirected or show error
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Access denied');
    });
  });

  test('Profile visibility toggle works correctly', async ({ page }) => {
    await test.step('Toggle profile visibility', async () => {
      await page.goto('/employee/profile/edit');
      
      // Initially profile should be visible
      await expect(page.locator('[data-testid="visibility-toggle"]')).toBeChecked();
      
      // Toggle visibility off
      await page.uncheck('[data-testid="visibility-toggle"]');
      await page.click('[data-testid="save-profile"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      
      // Verify profile is not visible to public
      await page.goto('/employee-profile/current-user-id');
      await expect(page.locator('[data-testid="profile-not-available"]')).toBeVisible();
      
      // Toggle visibility back on
      await page.goto('/employee/profile/edit');
      await page.check('[data-testid="visibility-toggle"]');
      await page.click('[data-testid="save-profile"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  });

  test('Salary slider updates live peso display', async ({ page }) => {
    await test.step('Test salary slider functionality', async () => {
      await page.goto('/employee/profile/edit');
      await page.click('[data-testid="tab-preferences"]');
      
      // Test minimum salary slider
      await page.locator('[data-testid="salary-min-slider"]').fill('5000');
      await expect(page.locator('[data-testid="salary-min-display"]')).toContainText('₱5,000');
      
      // Test maximum salary slider
      await page.locator('[data-testid="salary-max-slider"]').fill('20000');
      await expect(page.locator('[data-testid="salary-max-display"]')).toContainText('₱20,000');
      
      // Test range validation (max should be >= min)
      await page.locator('[data-testid="salary-min-slider"]').fill('25000');
      await expect(page.locator('[data-testid="salary-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="salary-error"]')).toContainText('Maximum salary must be greater than minimum');
    });
  });

  test('Form validation works correctly', async ({ page }) => {
    await test.step('Test form validation', async () => {
      await page.goto('/employee/profile');
      
      // Try to submit form with missing required fields
      await page.click('[data-testid="submit-profile"]');
      
      // Check for validation errors
      await expect(page.locator('[data-testid="firstName-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="lastName-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="age-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="city-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="province-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="phone-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      
      // Test phone number validation
      await page.fill('[data-testid="phone"]', 'invalid-phone');
      await page.click('[data-testid="submit-profile"]');
      await expect(page.locator('[data-testid="phone-error"]')).toContainText('Invalid Philippine phone number format');
      
      // Test email validation
      await page.fill('[data-testid="email"]', 'invalid-email');
      await page.click('[data-testid="submit-profile"]');
      await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email address format');
      
      // Test age validation
      await page.fill('[data-testid="age"]', '16');
      await page.click('[data-testid="submit-profile"]');
      await expect(page.locator('[data-testid="age-error"]')).toContainText('Must be at least 18 years old');
    });
  });

  test('Document upload functionality', async ({ page }) => {
    await test.step('Test document upload', async () => {
      await page.goto('/employee/profile/edit');
      await page.click('[data-testid="tab-documents"]');
      
      // Test file upload for required document
      const fileInput = page.locator('[data-testid="document-upload-philsys"]');
      await fileInput.setInputFiles({
        name: 'philsys-id.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data')
      });
      
      // Wait for upload to complete
      await expect(page.locator('[data-testid="document-status-pending"]')).toBeVisible();
      
      // Test file type validation
      const invalidFileInput = page.locator('[data-testid="document-upload-philhealth"]');
      await invalidFileInput.setInputFiles({
        name: 'document.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('invalid file type')
      });
      
      // Should show error for invalid file type
      await expect(page.locator('[data-testid="file-type-error"]')).toBeVisible();
    });
  });

  test('Profile completeness updates in real-time', async ({ page }) => {
    await test.step('Test real-time profile completeness updates', async () => {
      await page.goto('/employee/profile/edit');
      
      // Check initial score (should be low)
      const initialScore = await page.locator('[data-testid="profile-score"]').textContent();
      const initialScoreValue = parseInt(initialScore?.replace('%', '') || '0');
      expect(initialScoreValue).toBeLessThan(50);
      
      // Fill basic information
      await page.fill('[data-testid="firstName"]', 'Maria');
      await page.fill('[data-testid="lastName"]', 'Dela Cruz');
      await page.fill('[data-testid="age"]', '28');
      
      // Score should update
      await page.waitForTimeout(500); // Wait for debounced update
      const updatedScore = await page.locator('[data-testid="profile-score"]').textContent();
      const updatedScoreValue = parseInt(updatedScore?.replace('%', '') || '0');
      expect(updatedScoreValue).toBeGreaterThan(initialScoreValue);
      
      // Fill more fields
      await page.fill('[data-testid="city"]', 'Quezon City');
      await page.fill('[data-testid="province"]', 'Metro Manila');
      await page.fill('[data-testid="phone"]', '+639171234567');
      await page.fill('[data-testid="email"]', 'maria@example.com');
      
      // Score should increase further
      await page.waitForTimeout(500);
      const finalScore = await page.locator('[data-testid="profile-score"]').textContent();
      const finalScoreValue = parseInt(finalScore?.replace('%', '') || '0');
      expect(finalScoreValue).toBeGreaterThan(updatedScoreValue);
    });
  });
});
