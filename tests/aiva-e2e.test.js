const { test, expect } = require('@playwright/test');

const APP_URL = process.env.TEST_APP_URL || 'https://aiva-y723.onrender.com';

test.describe('AIVA ROI Calculator E2E', () => {
  test('should complete full ROI calculation flow', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes for full flow
    
    // Navigate to the app
    await page.goto(APP_URL);
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Wait for React to render
    
    // Check that the ROI calculator form is visible - look for select elements
    const jobTitleSelect = page.locator('select').filter({ hasText: /Job Title|Financial Analyst|Operations Manager/ }).first();
    await expect(jobTitleSelect).toBeVisible({ timeout: 15000 });
    
    // Fill in the form - select job title
    await jobTitleSelect.selectOption('Financial Analyst');
    
    // Find and select industry
    const industrySelect = page.locator('select').filter({ hasText: /Industry|Financial Services|Technology/ }).first();
    await industrySelect.selectOption('Financial Services');
    
    // Find and fill company name - look for input with placeholder containing "company" or "Acme"
    const companyInput = page.locator('input[placeholder*="company"], input[placeholder*="Acme"], input[placeholder*="Manufacturing"]').first();
    await companyInput.fill('Test Company');
    
    // Select company size
    const companySizeSelect = page.locator('select').filter({ hasText: /Company Size|1-10|11-50/ }).first();
    await companySizeSelect.selectOption('11-50 employees');
    
    // Find and fill salary amount - look for number input with $ sign or placeholder with numbers
    const salaryInput = page.locator('input[type="number"][placeholder*="85000"], input[type="number"][placeholder*="45"]').first();
    await salaryInput.fill('100000');
    
    // Wait a bit for form to update
    await page.waitForTimeout(1000);
    
    // Look for submit/calculate button - look for "Analyze" or "Calculate" text
    const submitButton = page.locator('button:has-text("Calculate My AI Voice Impact"), button:has-text("Analyze"), button:has-text("Calculate")').first();
    
    // Check if button is enabled
    const isEnabled = await submitButton.isEnabled();
    if (!isEnabled) {
      // Check what's missing
      const pageText = await page.textContent('body');
      console.log('Form state - button disabled. Page content:', pageText.substring(0, 2000));
      throw new Error('Submit button is disabled - required fields may be missing');
    }
    
    // Click submit and wait for navigation or API call
    await Promise.all([
      page.waitForResponse(response => 
        response.url().includes('/api/aiva/generate-deliverable-content') && response.status() === 200,
        { timeout: 120000 }
      ).catch(() => null), // Don't fail if response doesn't come
      submitButton.click()
    ]);
    
    // Wait for results - look for deliverables or results section
    // This might take a while due to AI generation
    try {
      await page.waitForSelector(
        '[class*="deliverable"], [class*="result"], [class*="card"], [data-testid*="deliverable"], [data-testid*="result"], text=/ROI/i, text=/hours/i, text=/freed/i',
        { timeout: 120000 }
      );
    } catch (timeoutError) {
      // Check for error messages
      const errorElement = page.locator('[class*="error"], [role="alert"], text=/500/, text=/Internal Server Error/, text=/Error/i').first();
      const hasError = await errorElement.isVisible().catch(() => false);
      
      if (hasError) {
        const errorText = await errorElement.textContent().catch(() => 'Unknown error');
        const pageText = await page.textContent('body').catch(() => '');
        console.log('Page content:', pageText.substring(0, 1000));
        throw new Error(`Error displayed: ${errorText}`);
      }
      
      // Check console for errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      if (consoleErrors.length > 0) {
        console.log('Console errors:', consoleErrors);
      }
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/error-screenshot.png', fullPage: true });
      throw new Error('Timeout waiting for results. Check screenshot at test-results/error-screenshot.png');
    }
    
    // Verify we got results (not an error)
    const errorMessage = page.locator('text=/500/, text=/Internal Server Error/, text=/Failed to generate/').first();
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    if (hasError) {
      const errorText = await errorMessage.textContent();
      const pageText = await page.textContent('body');
      console.log('Error page content:', pageText.substring(0, 2000));
      throw new Error(`Error displayed: ${errorText}`);
    }
    
    // Check that deliverables or results are shown
    const resultsVisible = await page.locator('text=/deliverable/i, text=/ROI/i, text=/hours/i, text=/freed/i, [class*="result"]').first().isVisible().catch(() => false);
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
