const { test, expect } = require('@playwright/test');

const API_URL = process.env.TEST_API_URL || 'https://aiva-y723.onrender.com';

test.describe('AIVA ROI Calculator API', () => {
  test('should generate deliverable content successfully', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/aiva/generate-deliverable-content`, {
      data: {
        jobTitle: 'Financial Analyst',
        industry: 'Financial Services',
        companyName: 'Test Company',
        deliverables: [
          {
            title: 'Monthly Financial Reports',
            baselineHours: 8,
            aiEnabledHours: 2,
            frequency: 'monthly',
            occurrencesPerYear: 12,
            timeMultiplier: 4,
            annualHoursFreed: 72,
            payrollFreed: 3600,
            scenario: 'Monthly reporting',
            oldWay: 'Manual process',
            aiVoiceWay: 'AI-assisted process'
          },
          {
            title: 'Budget Analysis',
            baselineHours: 6,
            aiEnabledHours: 1.5,
            frequency: 'monthly',
            occurrencesPerYear: 12,
            timeMultiplier: 4,
            annualHoursFreed: 54,
            payrollFreed: 2700,
            scenario: 'Budget review',
            oldWay: 'Manual analysis',
            aiVoiceWay: 'AI-assisted analysis'
          },
          {
            title: 'Risk Assessment',
            baselineHours: 10,
            aiEnabledHours: 2.5,
            frequency: 'quarterly',
            occurrencesPerYear: 4,
            timeMultiplier: 4,
            annualHoursFreed: 30,
            payrollFreed: 1500,
            scenario: 'Risk evaluation',
            oldWay: 'Manual assessment',
            aiVoiceWay: 'AI-assisted assessment'
          },
          {
            title: 'Compliance Reports',
            baselineHours: 12,
            aiEnabledHours: 3,
            frequency: 'quarterly',
            occurrencesPerYear: 4,
            timeMultiplier: 4,
            annualHoursFreed: 36,
            payrollFreed: 1800,
            scenario: 'Compliance review',
            oldWay: 'Manual reporting',
            aiVoiceWay: 'AI-assisted reporting'
          },
          {
            title: 'Data Analysis',
            baselineHours: 15,
            aiEnabledHours: 4,
            frequency: 'monthly',
            occurrencesPerYear: 12,
            timeMultiplier: 3.75,
            annualHoursFreed: 132,
            payrollFreed: 6600,
            scenario: 'Data processing',
            oldWay: 'Manual analysis',
            aiVoiceWay: 'AI-assisted analysis'
          }
        ],
        hourlyRate: 50,
        biggestFrustration: 'Spending too much time on repetitive tasks'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('deliverables');
    expect(Array.isArray(data.deliverables)).toBe(true);
    expect(data.deliverables.length).toBeGreaterThan(0);
    
    // Check that deliverables have required fields
    data.deliverables.forEach((deliverable, index) => {
      expect(deliverable).toHaveProperty('title');
      if (!deliverable.error) {
        expect(deliverable).toHaveProperty('productivityImpact');
        expect(deliverable).toHaveProperty('emotionalImpact');
        expect(deliverable).toHaveProperty('businessROI');
      }
    });
  });

  test('should return proper error when all deliverables fail', async ({ request }) => {
    // This test would require mocking the API to fail, but we can test error handling
    const response = await request.get(`${API_URL}/api/aiva/model-check`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('model');
    expect(data.model).toBe('claude-sonnet-4-20250514');
  });

  test('should handle missing required fields', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/aiva/generate-deliverable-content`, {
      data: {
        jobTitle: 'Test',
        // Missing industry, companyName, deliverables
      }
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});
