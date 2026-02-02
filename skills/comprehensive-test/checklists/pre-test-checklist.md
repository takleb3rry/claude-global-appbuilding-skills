# Pre-Test Checklist

Verify these items before running comprehensive tests.

---

## Server Availability (E2E Tests)

**E2E tests require running servers.** Before the E2E phase, the skill will check:
- Web server at `http://localhost:5173`
- API server at `http://localhost:3000`

If servers aren't running, you'll be prompted to skip E2E or abort.

**To start servers manually** (in a separate terminal):
```
npm run db:up && npm run db:migrate && npm run dev
```

Wait for:
- API: `[Nest] LOG Nest application successfully started`
- Web: `Local: http://localhost:5173`

---

## Environment Verification

### Local Development
- [ ] **Database running**: `npm run db:up`
- [ ] **Migrations applied**: `npm run db:migrate`
- [ ] **Dev servers running**: `npm run dev`
- [ ] **Environment variables**: `.env` files configured

### Production/Staging
- [ ] Deployment completed successfully
- [ ] Health check passing
- [ ] Database migrations applied

---

## Dependencies Check

Verify test dependencies are installed:
```
npm ls @playwright/test cypress msw @testing-library/react vitest
```

Install Playwright browsers if needed:
```
npx playwright install
```

---

## Test Data

- [ ] Test users exist (employee, supervisor, admin)
- [ ] Sample timesheets available
- [ ] Task codes configured

---

## Configuration Files

- [ ] `e2e/playwright/playwright.config.ts` present
- [ ] `e2e/cypress/cypress.config.ts` present
- [ ] `vitest.integration.config.ts` present
- [ ] MSW handlers configured (`src/mocks/`)

---

## Clean State

Clean test artifacts before running:
```
rm -rf test-reports/ playwright-report/ e2e/playwright/reports/ e2e/cypress/videos/ e2e/cypress/screenshots/
```

---

## Quick Start

### Unit + Integration Tests (no servers needed)
```
npm test                    # All unit tests
npm run test:integration    # Integration tests with MSW
```

### E2E Tests (REQUIRES running servers)
```
# Terminal 1: Start servers
npm run db:up && npm run db:migrate && npm run dev

# Terminal 2: Run E2E after servers ready
npm run test:e2e:playwright
npm run test:e2e:cypress
```

### Full Test Suite
```
/comprehensive-test full
```
