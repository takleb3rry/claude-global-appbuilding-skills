/**
 * Cypress Configuration Template
 *
 * React-optimized E2E testing with excellent DevX.
 * Complements Playwright for dual-framework coverage.
 *
 * ⚠️ IMPORTANT: Server Requirements
 * ==================================
 * Unlike Playwright, Cypress does NOT have a built-in webServer option.
 * You MUST start BOTH servers before running Cypress tests:
 *
 *   Terminal 1: npm run dev        (starts API + Web)
 *   Terminal 2: npm run test:e2e:cypress
 *
 * If you see "Cypress could not verify that this server is running",
 * the frontend is not running. If tests fail with network errors,
 * the API backend is not running.
 *
 * Quick check before running:
 *   curl -s http://localhost:5173 > /dev/null && echo "Web OK" || echo "Web NOT running"
 *   curl -s http://localhost:3000 > /dev/null && echo "API OK" || echo "API NOT running"
 *
 * CUSTOMIZE:
 * 1. LOCAL_WEB_URL - Your frontend dev server URL
 * 2. PRODUCTION_URL - Your deployed app URL
 * 3. specPattern - Path pattern to your test files
 */

import { defineConfig } from 'cypress';

const isProduction = process.env.TEST_ENV === 'production';

// Frontend URL (what Cypress tests against)
const LOCAL_WEB_URL = 'http://localhost:5173';

// Backend API URL (must be running for authenticated tests)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOCAL_API_URL = 'http://localhost:3000';

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://your-app.example.com';

export default defineConfig({
  e2e: {
    baseUrl: isProduction ? PRODUCTION_URL : LOCAL_WEB_URL,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,

    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,

    // Screenshots and videos
    screenshotOnRunFailure: true,
    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',

    // Retries
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Reporter
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },

    setupNodeEvents(on, config) {
      // Implement node event listeners here
      // Example: code coverage, accessibility testing
      return config;
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});
