/**
 * MSW Handlers Template
 *
 * Patterns for mocking API endpoints in integration tests.
 * Copy and customize for your specific API routes.
 *
 * SECTIONS:
 * 1. Auth handlers (login, logout, session)
 * 2. CRUD handlers (generic patterns)
 * 3. Error simulation (network, validation, server)
 * 4. Delay simulation (slow responses)
 */

import { http, HttpResponse, delay } from 'msw';

// Base URL - customize for your API
const API_BASE = '/api';

// ============================================
// AUTH HANDLERS
// ============================================

export const authHandlers = [
  // Login
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    // Success case
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: {
          id: 'user-1',
          email: body.email,
          firstName: 'Test',
          lastName: 'User',
          role: 'EMPLOYEE',
        },
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    // Invalid credentials
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Logout
  http.post(`${API_BASE}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  // Current user / session check
  http.get(`${API_BASE}/auth/me`, () => {
    return HttpResponse.json({
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'EMPLOYEE',
    });
  }),

  // Unauthorized (for testing protected routes)
  http.get(`${API_BASE}/auth/me-unauthorized`, () => {
    return HttpResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }),
];

// ============================================
// CRUD HANDLERS (Generic Patterns)
// ============================================

// Replace 'items' with your actual resource name
export const crudHandlers = [
  // List (GET /api/items)
  http.get(`${API_BASE}/items`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    return HttpResponse.json({
      data: [
        { id: '1', name: 'Item 1', createdAt: '2025-01-01' },
        { id: '2', name: 'Item 2', createdAt: '2025-01-02' },
      ],
      pagination: {
        page,
        limit,
        total: 2,
        totalPages: 1,
      },
    });
  }),

  // Get single (GET /api/items/:id)
  http.get(`${API_BASE}/items/:id`, ({ params }) => {
    const { id } = params;

    if (id === 'not-found') {
      return HttpResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      id,
      name: `Item ${id}`,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-15',
    });
  }),

  // Create (POST /api/items)
  http.post(`${API_BASE}/items`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    // Validation error example
    if (!body.name) {
      return HttpResponse.json(
        { error: 'Validation failed', fields: { name: 'Name is required' } },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        id: 'new-item-id',
        ...body,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Update (PUT /api/items/:id)
  http.put(`${API_BASE}/items/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  }),

  // Partial update (PATCH /api/items/:id)
  http.patch(`${API_BASE}/items/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      id,
      name: `Item ${id}`,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  }),

  // Delete (DELETE /api/items/:id)
  http.delete(`${API_BASE}/items/:id`, ({ params }) => {
    const { id } = params;

    if (id === 'protected') {
      return HttpResponse.json(
        { error: 'Cannot delete protected item' },
        { status: 403 }
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];

// ============================================
// ERROR SIMULATION HANDLERS
// ============================================

export const errorHandlers = [
  // Network error
  http.get(`${API_BASE}/test/network-error`, () => {
    return HttpResponse.error();
  }),

  // Server error (500)
  http.get(`${API_BASE}/test/server-error`, () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),

  // Bad request (400)
  http.post(`${API_BASE}/test/bad-request`, () => {
    return HttpResponse.json(
      {
        error: 'Validation failed',
        fields: {
          email: 'Invalid email format',
          password: 'Password too short',
        },
      },
      { status: 400 }
    );
  }),

  // Rate limited (429)
  http.get(`${API_BASE}/test/rate-limited`, () => {
    return HttpResponse.json(
      { error: 'Too many requests', retryAfter: 60 },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }),

  // Service unavailable (503)
  http.get(`${API_BASE}/test/unavailable`, () => {
    return HttpResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }),
];

// ============================================
// DELAY SIMULATION HANDLERS
// ============================================

export const delayHandlers = [
  // Slow response (5 seconds)
  http.get(`${API_BASE}/test/slow`, async () => {
    await delay(5000);
    return HttpResponse.json({ data: 'slow response' });
  }),

  // Variable delay based on query param
  http.get(`${API_BASE}/test/delay`, async ({ request }) => {
    const url = new URL(request.url);
    const ms = parseInt(url.searchParams.get('ms') || '1000');
    await delay(ms);
    return HttpResponse.json({ data: 'delayed response', delayMs: ms });
  }),

  // Timeout simulation (very long delay)
  http.get(`${API_BASE}/test/timeout`, async () => {
    await delay(30000); // 30 seconds
    return HttpResponse.json({ data: 'this should timeout' });
  }),
];

// ============================================
// COMBINED DEFAULT HANDLERS
// ============================================

export const handlers = [
  ...authHandlers,
  ...crudHandlers,
  ...errorHandlers,
  ...delayHandlers,
];

export default handlers;
