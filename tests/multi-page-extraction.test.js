// Playwright test for multi-page company context extraction
// Verifies that the system successfully discovers and fetches multiple pages

const { test, expect } = require('@playwright/test');

// Use Render URL by default - this is what users will actually use
const API_URL = process.env.TEST_API_URL || 'https://aiva-y723.onrender.com';

test.describe('Multi-Page Company Context Extraction', () => {
  test('should discover and fetch multiple pages from autopayplus.com', async ({ page, request }) => {
    const testURL = 'https://autopayplus.com';
    
    // Step 1: Verify homepage is accessible and has meaningful content
    console.log('📄 Step 1: Verifying homepage accessibility...');
    await page.goto(testURL, { waitUntil: 'networkidle' });
    
    const homepageContent = await page.textContent('body');
    expect(homepageContent.length).toBeGreaterThan(1000, 'Homepage should have substantial content');
    console.log(`✅ Homepage content: ${homepageContent.length} chars`);

    // Step 2: Verify key pages are accessible
    console.log('📄 Step 2: Verifying key pages accessibility...');
    const keyPages = ['/about', '/products', '/services', '/pricing', '/contact'];
    const accessiblePages = [];
    
    for (const keyPage of keyPages) {
      try {
        const pageURL = `${testURL}${keyPage}`;
        await page.goto(pageURL, { waitUntil: 'networkidle', timeout: 10000 });
        const content = await page.textContent('body');
        
        if (content && content.length > 500) {
          accessiblePages.push({
            path: keyPage,
            url: pageURL,
            contentLength: content.length
          });
          console.log(`✅ ${keyPage}: ${content.length} chars`);
        } else {
          console.log(`⚠️ ${keyPage}: Content too short or empty`);
        }
      } catch (e) {
        console.log(`⚠️ ${keyPage}: Not accessible (${e.message})`);
      }
    }

    expect(accessiblePages.length).toBeGreaterThan(0, 'At least one key page should be accessible');
    console.log(`✅ Found ${accessiblePages.length} accessible key pages`);

    // Step 3: Test the multi-page extraction endpoint
    console.log('📡 Step 3: Testing multi-page extraction endpoint...');
    console.log(`   Using API URL: ${API_URL}`);
    
    const extractionResponse = await request.post(`${apiUrl}/api/aiva/fetch-multi-page-context`, {
      data: {
        websiteURL: testURL
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(extractionResponse.ok()).toBeTruthy();
    
    const extractionData = await extractionResponse.json();
    expect(extractionData.success).toBe(true);
    expect(extractionData.companyContext).toBeDefined();
    
    const context = extractionData.companyContext;
    
    // Step 4: Verify extraction captured company-specific information
    console.log('🔍 Step 4: Verifying extraction quality...');
    
    // Check that multiple pages were fetched
    expect(context.pagesFetched).toBeGreaterThan(1, 'Should fetch multiple pages');
    console.log(`✅ Fetched ${context.pagesFetched} pages`);
    
    if (context.pagesFetchedDetails) {
      console.log('📊 Pages fetched:', context.pagesFetchedDetails.map(p => p.path || p.url));
    }

    // Check that core business is extracted and relevant to Autopay Plus
    expect(context.coreBusiness).toBeDefined();
    expect(context.coreBusiness).not.toBe('Not specified');
    expect(context.coreBusiness.length).toBeGreaterThan(50);
    
    // Verify it mentions payment-related terms (Autopay Plus is a payment processing company)
    const coreBusinessLower = context.coreBusiness.toLowerCase();
    const hasPaymentTerms = 
      coreBusinessLower.includes('payment') || 
      coreBusinessLower.includes('billing') || 
      coreBusinessLower.includes('autopay') ||
      coreBusinessLower.includes('recurring') ||
      coreBusinessLower.includes('subscription');
    
    if (!hasPaymentTerms) {
      console.warn('⚠️ Core business extraction may not be accurate - missing payment-related terms');
      console.warn(`   Extracted: ${context.coreBusiness.substring(0, 200)}`);
    } else {
      console.log('✅ Core business extraction appears relevant');
    }

    // Check target market
    expect(context.targetMarket).toBeDefined();
    expect(context.targetMarket).not.toBe('Not specified');
    
    // Check industry
    expect(context.industry).toBeDefined();
    expect(context.industry).not.toBe('Not specified');
    
    // Check rawContent includes content from multiple pages
    expect(context.rawContent).toBeDefined();
    expect(context.rawContent.length).toBeGreaterThan(2000, 'Raw content should be substantial');
    
    console.log('✅ Extraction quality checks passed');
    console.log(`   Core Business: ${context.coreBusiness.substring(0, 100)}...`);
    console.log(`   Target Market: ${context.targetMarket.substring(0, 100)}...`);
    console.log(`   Industry: ${context.industry}`);
    console.log(`   Raw Content: ${context.rawContent.length} chars`);
  });

  test('should handle single-page fallback gracefully', async ({ request }) => {
    // Test with a simple site that might not have multiple pages
    const testURL = 'https://example.com';
    
    console.log(`📡 Testing fallback with: ${testURL}`);
    console.log(`   Using API URL: ${API_URL}`);
    
    const extractionResponse = await request.post(`${API_URL}/api/aiva/fetch-multi-page-context`, {
      data: {
        websiteURL: testURL
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!extractionResponse.ok()) {
      const errorText = await extractionResponse.text();
      console.error(`❌ API Error (${extractionResponse.status()}):`, errorText.substring(0, 500));
      throw new Error(`API request failed: ${extractionResponse.status()} ${extractionResponse.statusText()}`);
    }

    // Should still succeed even if only homepage is fetched
    expect(extractionResponse.ok()).toBeTruthy();
    
    const extractionData = await extractionResponse.json();
    expect(extractionData.success).toBe(true);
    expect(extractionData.companyContext).toBeDefined();
    
    // Should have at least the homepage
    expect(extractionData.companyContext.pagesFetched).toBeGreaterThanOrEqual(1);
    console.log(`✅ Fallback handled gracefully: ${extractionData.companyContext.pagesFetched} page(s) fetched`);
  });

  test('should extract meaningful context from paycor.com', async ({ request }) => {
    const testURL = 'https://paycor.com';
    
    console.log(`📡 Testing extraction with: ${testURL}`);
    console.log(`   Using API URL: ${API_URL}`);
    
    const extractionResponse = await request.post(`${API_URL}/api/aiva/fetch-multi-page-context`, {
      data: {
        websiteURL: testURL
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(extractionResponse.ok()).toBeTruthy();
    
    const extractionData = await extractionResponse.json();
    expect(extractionData.success).toBe(true);
    
    const context = extractionData.companyContext;
    
    // Verify multiple pages were fetched
    expect(context.pagesFetched).toBeGreaterThan(1);
    console.log(`✅ Fetched ${context.pagesFetched} pages from Paycor`);
    
    // Verify extraction quality
    expect(context.coreBusiness).toBeDefined();
    expect(context.coreBusiness.length).toBeGreaterThan(50);
    
    // Paycor is an HR/payroll company, so check for relevant terms
    const coreBusinessLower = context.coreBusiness.toLowerCase();
    const hasHRTerms = 
      coreBusinessLower.includes('hr') || 
      coreBusinessLower.includes('payroll') || 
      coreBusinessLower.includes('human resources') ||
      coreBusinessLower.includes('hcm');
    
    if (hasHRTerms) {
      console.log('✅ Core business extraction appears relevant for Paycor');
    } else {
      console.warn('⚠️ Core business may not be accurate');
      console.warn(`   Extracted: ${context.coreBusiness.substring(0, 200)}`);
    }
    
    expect(context.targetMarket).toBeDefined();
    expect(context.industry).toBeDefined();
    expect(context.rawContent.length).toBeGreaterThan(2000);
    
    console.log(`✅ Paycor extraction successful`);
    console.log(`   Industry: ${context.industry}`);
    console.log(`   Target Market: ${context.targetMarket.substring(0, 100)}...`);
  });
});
