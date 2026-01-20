const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run sequentially for E2E tests
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for video recording
  reporter: 'html',
  timeout: 180000, // 3 minutes default timeout for E2E tests
  use: {
    baseURL: process.env.TEST_API_URL || 'https://aiva-y723.onrender.com',
    trace: 'on',
    video: 'on', // Enable video recording
    screenshot: 'on', // Enable screenshots
  },
  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.test.js',
      use: {
        video: 'off', // No video for API tests
      },
    },
    {
      name: 'e2e-tests',
      testMatch: '**/e2e-*.test.js',
      use: {
        video: 'on', // Video for E2E tests
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'multi-page-tests',
      testMatch: '**/multi-page-*.test.js',
      use: {
        video: 'on', // Video for multi-page tests
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  webServer: undefined, // We're testing against deployed URL
});
