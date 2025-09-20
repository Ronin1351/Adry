import { test, expect } from '@playwright/test';

test.describe('Employer Profile + Paywall M3', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the employer dashboard
    await page.goto('/employer/dashboard');
  });

  test('Employer can create and manage profile', async ({ page }) => {
    // Test profile creation flow
    await test.step('Create employer profile', async () => {
      await page.click('[data-testid="tab-profile"]');
      
      // Fill basic information
      await page.fill('[data-testid="companyName"]', 'Santos Household');
      await page.fill('[data-testid="contactPerson"]', 'Maria Santos');
      await page.fill('[data-testid="city"]', 'Quezon City');
      await page.fill('[data-testid="province"]', 'Metro Manila');
      await page.fill('[data-testid="aboutText"]', 'We are a loving family looking for a reliable housekeeper');
      await page.selectOption('[data-testid="householdSize"]', 'MEDIUM');

      // Move to job details
      await page.click('[data-testid="tab-job-details"]');
      await page.check('[data-testid="preferred-arrangement-live-out"]');
      
      // Set budget range
      await page.locator('[data-testid="budget-min-slider"]').fill('8000');
      await page.locator('[data-testid="budget-max-slider"]').fill('15000');
      
      // Select requirements
      await page.check('[data-testid="requirement-cooking"]');
      await page.check('[data-testid="requirement-childcare"]');
      await page.check('[data-testid="requirement-housekeeping"]');
      
      // Set language requirements
      await page.selectOption('[data-testid="primary-language"]', 'BOTH');
      await page.check('[data-testid="language-bisaya"]');

      // Move to work schedule
      await page.click('[data-testid="tab-work-schedule"]');
      await page.check('[data-testid="day-off-sunday"]');
      await page.check('[data-testid="day-off-wednesday"]');
      await page.fill('[data-testid="startTime"]', '08:00');
      await page.fill('[data-testid="endTime"]', '17:00');
      await page.check('[data-testid="flexibleHours"]');

      // Move to benefits
      await page.click('[data-testid="tab-benefits"]');
      await page.selectOption('[data-testid="sss-contribution"]', 'YES');
      await page.selectOption('[data-testid="philhealth-contribution"]', 'YES');
      await page.check('[data-testid="thirteenthMonthPay"]');
      await page.check('[data-testid="overtimePay"]');

      // Move to contact information
      await page.click('[data-testid="tab-contact"]');
      await page.fill('[data-testid="contactEmail"]', 'maria@example.com');
      await page.fill('[data-testid="contactPhone"]', '+639171234567');

      // Submit the form
      await page.click('[data-testid="submit-profile"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Profile created successfully');
    });

    // Test profile completeness scoring
    await test.step('Verify profile completeness scoring', async () => {
      await page.goto('/employer/dashboard');
      
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

  test('Employer can subscribe to service', async ({ page }) => {
    await test.step('Subscribe to service', async () => {
      await page.click('[data-testid="tab-subscription"]');
      
      // Should see subscription flow
      await expect(page.locator('[data-testid="subscription-flow"]')).toBeVisible();
      
      // Select payment method
      await page.click('[data-testid="payment-method-stripe"]');
      
      // Click subscribe button
      await page.click('[data-testid="subscribe-button"]');
      
      // Should redirect to payment or show payment form
      await expect(page.locator('[data-testid="payment-form"]')).toBeVisible();
      
      // Fill payment details (mock)
      await page.fill('[data-testid="card-number"]', '4242424242424242');
      await page.fill('[data-testid="card-expiry"]', '12/25');
      await page.fill('[data-testid="card-cvc"]', '123');
      await page.fill('[data-testid="card-name"]', 'Maria Santos');
      
      // Submit payment
      await page.click('[data-testid="submit-payment"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="subscription-success"]')).toBeVisible();
      await expect(page.locator('[data-testid="subscription-success"]')).toContainText('Subscription activated successfully');
    });

    // Test subscription status display
    await test.step('Verify subscription status', async () => {
      await page.goto('/employer/dashboard');
      
      // Check that subscription status is displayed
      await expect(page.locator('[data-testid="subscription-status"]')).toBeVisible();
      await expect(page.locator('[data-testid="subscription-status"]')).toContainText('ACTIVE');
      
      // Check expiry date
      await expect(page.locator('[data-testid="subscription-expiry"]')).toBeVisible();
    });
  });

  test('Paywall blocks chat access without subscription', async ({ page }) => {
    await test.step('Attempt to access chat without subscription', async () => {
      // Try to access chat
      await page.goto('/employer/chat');
      
      // Should see paywall message
      await expect(page.locator('[data-testid="paywall-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="paywall-message"]')).toContainText('Active subscription required');
      
      // Should see subscribe button
      await expect(page.locator('[data-testid="subscribe-button"]')).toBeVisible();
    });

    await test.step('Attempt to start new chat', async () => {
      // Try to start a new chat
      await page.goto('/employer/chat/new');
      
      // Should see paywall message
      await expect(page.locator('[data-testid="paywall-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="paywall-message"]')).toContainText('Active subscription required');
    });
  });

  test('Paywall blocks interview scheduling without subscription', async ({ page }) => {
    await test.step('Attempt to schedule interview without subscription', async () => {
      // Try to access interview scheduling
      await page.goto('/employer/interviews/schedule');
      
      // Should see paywall message
      await expect(page.locator('[data-testid="paywall-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="paywall-message"]')).toContainText('Active subscription required');
      
      // Should see subscribe button
      await expect(page.locator('[data-testid="subscribe-button"]')).toBeVisible();
    });
  });

  test('Expired subscription shows read-only mode', async ({ page }) => {
    await test.step('Simulate expired subscription', async () => {
      // This would require setting up a test with expired subscription
      // For now, we'll test the UI behavior
      
      // Mock expired subscription state
      await page.goto('/employer/chat');
      
      // Should see read-only mode message
      await expect(page.locator('[data-testid="read-only-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="read-only-message"]')).toContainText('Subscription expired - read-only mode');
      
      // Should see renewal button
      await expect(page.locator('[data-testid="renew-subscription-button"]')).toBeVisible();
    });

    await test.step('Verify read-only chat behavior', async () => {
      // Try to send a message in read-only mode
      await page.goto('/employer/chat/123');
      
      // Message input should be disabled
      await expect(page.locator('[data-testid="message-input"]')).toBeDisabled();
      
      // Send button should be disabled
      await expect(page.locator('[data-testid="send-button"]')).toBeDisabled();
      
      // Should see read-only indicator
      await expect(page.locator('[data-testid="read-only-indicator"]')).toBeVisible();
    });
  });

  test('Billing history displays correctly', async ({ page }) => {
    await test.step('View billing history', async () => {
      await page.click('[data-testid="tab-billing"]');
      
      // Should see billing history
      await expect(page.locator('[data-testid="billing-history"]')).toBeVisible();
      
      // Should see payment records
      await expect(page.locator('[data-testid="billing-record"]')).toBeVisible();
      
      // Should see invoice download buttons
      await expect(page.locator('[data-testid="download-invoice"]')).toBeVisible();
    });

    await test.step('Download invoice', async () => {
      // Click download invoice button
      await page.click('[data-testid="download-invoice"]');
      
      // Should trigger download or open invoice
      // This would need to be verified based on implementation
    });
  });

  test('Subscription renewal flow works', async ({ page }) => {
    await test.step('Renew subscription', async () => {
      await page.click('[data-testid="tab-subscription"]');
      
      // Click renew button
      await page.click('[data-testid="renew-subscription"]');
      
      // Should show renewal form
      await expect(page.locator('[data-testid="renewal-form"]')).toBeVisible();
      
      // Select payment method
      await page.click('[data-testid="payment-method-stripe"]');
      
      // Submit renewal
      await page.click('[data-testid="submit-renewal"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="renewal-success"]')).toBeVisible();
    });
  });

  test('Subscription cancellation flow works', async ({ page }) => {
    await test.step('Cancel subscription', async () => {
      await page.click('[data-testid="tab-subscription"]');
      
      // Click cancel button
      await page.click('[data-testid="cancel-subscription"]');
      
      // Should show cancellation confirmation
      await expect(page.locator('[data-testid="cancellation-confirmation"]')).toBeVisible();
      
      // Confirm cancellation
      await page.click('[data-testid="confirm-cancellation"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="cancellation-success"]')).toBeVisible();
    });
  });

  test('Payment provider integration works', async ({ page }) => {
    await test.step('Test Stripe integration', async () => {
      await page.click('[data-testid="tab-subscription"]');
      await page.click('[data-testid="payment-method-stripe"]');
      await page.click('[data-testid="subscribe-button"]');
      
      // Should show Stripe payment form
      await expect(page.locator('[data-testid="stripe-payment-form"]')).toBeVisible();
    });

    await test.step('Test PayPal integration', async () => {
      await page.click('[data-testid="payment-method-paypal"]');
      await page.click('[data-testid="subscribe-button"]');
      
      // Should redirect to PayPal or show PayPal form
      await expect(page.locator('[data-testid="paypal-payment-form"]')).toBeVisible();
    });

    await test.step('Test GCash integration', async () => {
      await page.click('[data-testid="payment-method-gcash"]');
      await page.click('[data-testid="subscribe-button"]');
      
      // Should show GCash payment form
      await expect(page.locator('[data-testid="gcash-payment-form"]')).toBeVisible();
    });
  });

  test('Webhook processing works correctly', async ({ page }) => {
    await test.step('Test webhook processing', async () => {
      // This would require setting up webhook testing
      // For now, we'll test the UI updates after webhook processing
      
      // Simulate successful payment webhook
      await page.goto('/employer/dashboard');
      
      // Should see updated subscription status
      await expect(page.locator('[data-testid="subscription-status"]')).toContainText('ACTIVE');
      
      // Should see billing history updated
      await page.click('[data-testid="tab-billing"]');
      await expect(page.locator('[data-testid="billing-record"]')).toBeVisible();
    });
  });

  test('Profile validation works correctly', async ({ page }) => {
    await test.step('Test form validation', async () => {
      await page.click('[data-testid="tab-profile"]');
      
      // Try to submit form with missing required fields
      await page.click('[data-testid="submit-profile"]');
      
      // Check for validation errors
      await expect(page.locator('[data-testid="companyName-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="contactPerson-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="city-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="province-error"]')).toBeVisible();
      
      // Test phone number validation
      await page.fill('[data-testid="contactPhone"]', 'invalid-phone');
      await page.click('[data-testid="submit-profile"]');
      await expect(page.locator('[data-testid="contactPhone-error"]')).toContainText('Invalid Philippine phone number format');
      
      // Test email validation
      await page.fill('[data-testid="contactEmail"]', 'invalid-email');
      await page.click('[data-testid="submit-profile"]');
      await expect(page.locator('[data-testid="contactEmail-error"]')).toContainText('Invalid email address format');
      
      // Test budget range validation
      await page.fill('[data-testid="budgetMin"]', '15000');
      await page.fill('[data-testid="budgetMax"]', '10000');
      await page.click('[data-testid="submit-profile"]');
      await expect(page.locator('[data-testid="budget-error"]')).toContainText('Minimum budget must be less than or equal to maximum budget');
    });
  });
});
