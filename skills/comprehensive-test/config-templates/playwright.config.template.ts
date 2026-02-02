/**
 * Playwright Configuration Template
 *
 * Cross-browser E2E testing setup for React/Vite applications.
 * Supports local and production environment testing.
 *
 * ⚠️ IMPORTANT: Backend API Server Requirement
 * ============================================
 * The `webServer` config below ONLY starts the frontend (Vite).
 * If your app requires a backend API, you MUST start it separately:
 *
 *   Terminal 1: npm run dev        (or npm run dev:api for API only)
 *   Terminal 2: npx playwright test
 *
 * Without the API running, tests requiring authentication or API calls
 * will fail with ECONNREFUSED errors.
 *
 * To check if API is running:
 *   curl -s http://localhost:3000/health || echo "API not running!"
 *
 * CUSTOMIZE:
 * 1. LOCAL_WEB_URL - Your frontend dev server URL
 * 2. LOCAL_API_URL - Your backend API URL (for reference/documentation)
 * 3. PRODUCTION_URL - Your deployed app URL
 * 4. testDir - Path to your test files
 */

import { defineConfig, devices } from '@playwright/test';

const isProduction = process.env.TEST_ENV === 'production';
const isCI = !!process.env.CI;

// Frontend URL (what Playwright tests against)
const LOCAL_WEB_URL = 'http://localhost:5173';

// Backend API URL (must be running separately for authenticated tests)
// This is for documentation - Playwright doesn't start this automatically
const LOCAL_API_URL = 'http://localhost:3000';

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://your-app.example.com';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  workers: isCI ? 2 : undefined,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,

  reporter: [
    ['html', { outputFolder: './playwright-report' }],
    ['json', { outputFile: './test-results/results.json' }],
    ['list'],
  ],

  timeout: 30000,
  expect: { timeout: 5000 },

  use: {
    baseURL: isProduction ? PRODUCTION_URL : LOCAL_WEB_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  /**
   * webServer only starts the FRONTEND.
   *
   * For full-stack apps, the backend API must be started separately.
   * Common pattern:
   *   - Option A: Run `npm run dev` (starts both) in separate terminal
   *   - Option B: Set reuseExistingServer: true and start servers manually
   *
   * If you see ECONNREFUSED errors in tests, the API is not running.
   */
  webServer: isProduction ? undefined : {
    command: 'npm run dev:web',  // Only starts frontend; start API separately
    url: LOCAL_WEB_URL,
    reuseExistingServer: !isCI,  // Reuse if already running (recommended for dev)
    timeout: 120000,
  },
});
