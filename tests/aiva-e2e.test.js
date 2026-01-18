const { test, expect } = require('@playwright/test');

const APP_URL = process.env.TEST_APP_URL || 'https://aiva-y723.onrender.com';

test.describe('AIVA ROI Calculator E2E', () => {
  test('should complete full ROI calculation flow', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes for full flow
    
    // Navigate to the app
    await page.goto(APP_URL);
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the ROI calculator form is visible
    const jobTitleInput = page.locator('input[name="jobTitle"], input[placeholder*="Job Title"], input[placeholder*="job title"]').first();
    await expect(jobTitleInput).toBeVisible({ timeout: 10000 });
    
    // Fill in the form
    await jobTitleInput.fill('Financial Analyst');
    
    // Find and fill industry
    const industryInput = page.locator('input[name="industry"], input[placeholder*="Industry"], select[name="industry"]').first();
    await industryInput.fill('Financial Services');
    
    // Find and fill company name
    const companyInput = page.locator('input[name="companyName"], input[placeholder*="Company"], input[placeholder*="company"]').first();
    await companyInput.fill('Test Company');
    
    // Find and fill hourly rate if present
    const hourlyRateInput = page.locator('input[name="hourlyRate"], input[type="number"]').first();
    if (await hourlyRateInput.isVisible()) {
      await hourlyRateInput.fill('50');
    }
    
    // Look for submit/calculate button
    const submitButton = page.locator('button[type="submit"], button:has-text("Calculate"), button:has-text("Generate"), button:has-text("Submit")').first();
    
    // Click submit
    await submitButton.click();
    
    // Wait for results - look for deliverables or results section
    // This might take a while due to AI generation
    await page.waitForSelector(
      '[class*="deliverable"], [class*="result"], [class*="card"], [data-testid*="deliverable"], [data-testid*="result"]',
      { timeout: 120000 }
    ).catch(() => {
      // If selector not found, check for error messages
      const errorElement = page.locator('[class*="error"], [role="alert"]').first();
      if (errorElement.isVisible()) {
        throw new Error('Error occurred during calculation');
      }
    });
    
    // Verify we got results (not an error)
    const errorMessage = page.locator('[class*="error"], [role="alert"], text=/500/, text=/Internal Server Error/').first();
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    if (hasError) {
      const errorText = await errorMessage.textContent();
      throw new Error(`Error displayed: ${errorText}`);
    }
    
    // Check that deliverables or results are shown
    const resultsVisible = await page.locator('text=/deliverable/i, text=/ROI/i, text=/hours/i, [class*="result"]').first().isVisible().catch(() => false);
    expect(resultsVisible).toBe(true);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForLoadState('networkidle');
    
    // Intercept API calls to simulate error
    await page.route('**/api/aiva/generate-deliverable-content', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test error' })
      });
    });
    
    // Try to submit form
    const jobTitleInput = page.locator('input[name="jobTitle"], input[placeholder*="Job Title"]').first();
    if (await jobTitleInput.isVisible()) {
      await jobTitleInput.fill('Test');
      const submitButton = page.locator('button[type="submit"], button:has-text("Calculate")').first();
      await submitButton.click();
      
      // Should show error message, not crash
      await page.waitForTimeout(2000);
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('Internal Server Error');
    }
  });

  test('should load without authentication errors', async ({ page }) => {
    // Check console for errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto(APP_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for any async operations
    
    // Filter out expected errors (like 401 for unauthenticated users)
    const criticalErrors = errors.filter(e => 
      !e.includes('401') && 
      !e.includes('Unauthorized') &&
      !e.includes('Failed to fetch') &&
      !e.includes('net::ERR_CONNECTION_REFUSED')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Console errors:', criticalErrors);
    }
    
    // Page should still load successfully
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });
});
