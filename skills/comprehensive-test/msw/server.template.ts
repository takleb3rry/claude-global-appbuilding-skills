/**
 * MSW Server Setup (Node.js)
 *
 * For integration tests running in Node.js/Vitest.
 * Import in your test setup file.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// ============================================
// VITEST SETUP (add to vitest.setup.ts)
// ============================================

/*
import { server } from './src/mocks/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
*/

// ============================================
// USAGE IN TESTS
// ============================================

/*
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('MyComponent', () => {
  it('handles error state', async () => {
    // Override handler for this test only
    server.use(
      http.get('/api/items', () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        );
      })
    );

    // Test error handling...
  });
});
*/
