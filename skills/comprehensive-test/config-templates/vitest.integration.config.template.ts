/**
 * Vitest Integration Test Configuration
 *
 * For component integration tests with MSW mocking.
 * Runs faster than E2E, catches issues early.
 *
 * CUSTOMIZE:
 * 1. include patterns for your test files
 * 2. setupFiles path for MSW server setup
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    // Integration test specific settings
    name: 'integration',
    include: ['src/**/*.integration.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'e2e/**'],

    // Environment
    environment: 'jsdom',

    // Setup files - MSW server initialization
    setupFiles: ['./src/mocks/setup.ts'],

    // Global test utilities
    globals: true,

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './test-reports/integration/coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/mocks/**',
        'src/**/*.d.ts',
      ],
    },

    // Reporter
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-reports/integration/results.json',
    },

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Pool settings for performance
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },

    // Dependencies to inline (common React libraries)
    deps: {
      inline: [/msw/],
    },
  },
});
