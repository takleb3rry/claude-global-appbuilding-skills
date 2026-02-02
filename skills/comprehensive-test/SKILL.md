---
name: comprehensive-test
description: Comprehensive pre-deployment testing - dual E2E (Playwright/Cypress), MSW integration tests, conflict analysis, prioritized fix plan. Use for UAT, full test suite, pre-deployment testing.
argument-hint: [setup|msw|integration|e2e|synthesize|full|skip-preflight]
context: fork
---

# Comprehensive Test Suite

Run a full testing pipeline with dual E2E frameworks, MSW-based integration tests, conflict detection, and synthesized fix recommendations.

---

## Configuration (Customize for Your Project)

Before first use, update these values to match your project structure:

```
LOCAL_WEB_URL      = http://localhost:5173      # Your local dev server URL
LOCAL_API_URL      = http://localhost:3000      # Your local API server URL
PRODUCTION_URL     = [YOUR_PRODUCTION_URL]      # e.g., https://myapp.vercel.app
WEB_PORT           = 5173                       # Port for web dev server
API_PORT           = 3000                       # Port for API dev server
E2E_PATH           = e2e/                       # Path to E2E tests from project root
MOCKS_PATH         = src/mocks/                 # Path for MSW mock handlers
TEST_REPORTS_PATH  = test-reports/              # Path for test output
```

**Monorepo users**: If your project uses a structure like `packages/web/`, adjust paths accordingly (e.g., `E2E_PATH = packages/web/e2e/`).

---

## When to Use
- Before deployment to staging/production
- After significant feature completion
- When UAT sign-off is required
- User says "test everything", "full test", "pre-deployment testing", "UAT"

## When NOT to Use
- Quick unit test runs (use `npm test` directly)
- Single component testing
- Debugging a specific test failure

---

## FIRST: Select Test Environment

**Before running any tests, ALWAYS ask the user which environment to test using AskUserQuestion:**

> "Which environment should I test?"
> 1. **Local development** (LOCAL_WEB_URL from config) - Requires servers to be running or I'll start them
> 2. **Production** (PRODUCTION_URL from config) - Tests against live deployment

**Based on the answer:**

- **Local**: Set `TEST_ENV=local`. Will check/start local servers before E2E tests.
- **Production**: Set `TEST_ENV=production`. Skip server startup entirely - production is already running. Use `TEST_ENV=production` prefix for all test commands.

**Report the selected environment** at the start of the test run summary.

---

## Project Context

### Detected Package Manager
```bash
if [ -f package-lock.json ]; then echo "npm"; elif [ -f yarn.lock ]; then echo "yarn"; elif [ -f pnpm-lock.yaml ]; then echo "pnpm"; else echo "unknown"; fi
```

### Detected Test Framework
```bash
grep -E '"vitest"|"jest"|"mocha"' package.json 2>/dev/null | head -1 || echo "none detected"
```

### Detected E2E Frameworks
```bash
grep -E '"@playwright/test"|"cypress"' package.json 2>/dev/null || echo "none detected"
```

### Detected Frontend
```bash
grep -E '"react"|"vue"|"svelte"|"angular"' package.json 2>/dev/null | head -1 || echo "none detected"
```

---

## Execution Flow

Based on `$ARGUMENTS`, execute the appropriate phase(s):

### Phase 0: Pre-Flight (runs automatically)

**Goal**: Ensure clean environment before any testing begins.

This phase runs **automatically** before setup, msw, integration, e2e, or full phases unless `$ARGUMENTS` contains "skip-preflight".

**To skip**: `/comprehensive-test e2e skip-preflight`

1. **Run cleanup script**: `npm run test:clean`
   - Kills processes on WEB_PORT and API_PORT (excluding Docker)
   - Clears node_modules/.cache directories
   - Removes stale test artifacts

2. **Report cleanup results**: Show what was cleaned (ports killed, caches cleared)

3. **Verify Docker is running** (for local E2E tests):
   ```bash
   # macOS with Docker Desktop:
   PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH" docker info >/dev/null 2>&1 && echo "Docker: running" || echo "Docker: NOT running"

   # Linux or Docker in PATH:
   docker info >/dev/null 2>&1 && echo "Docker: running" || echo "Docker: NOT running (E2E may fail)"
   ```

   **Note**: On macOS with Docker Desktop, you may need to add Docker to PATH. On Linux, Docker is typically already in PATH.

4. **Output**: "Pre-flight complete. Environment ready for testing."

---

### Phase: Setup (`$ARGUMENTS` = "setup" or "full")

**Goal**: Prepare the project for comprehensive testing.

1. **Read technology_decisions.md** for explicit stack choices
2. **Check for missing dependencies** - run: `npm ls @playwright/test cypress msw @testing-library/react vitest 2>/dev/null || echo "Some packages missing"`
3. **Generate configs from templates** if not present:
   - Copy `playwright.config.template.ts` to `E2E_PATH/playwright/playwright.config.ts`
   - Copy `cypress.config.template.ts` to `E2E_PATH/cypress/cypress.config.ts`
   - Copy `vitest.integration.config.template.ts` to `vitest.integration.config.ts`
4. **Create directory structure** if missing: `E2E_PATH/playwright/`, `E2E_PATH/cypress/`, `MOCKS_PATH`, `TEST_REPORTS_PATH`
5. **Output**: Report what was created/configured

### Phase: MSW Setup (`$ARGUMENTS` = "msw" or "full")

**Goal**: Generate MSW handlers from API routes for deterministic testing.

1. **Scan for API route files**:
   - NestJS: `packages/api/src/**/*.controller.ts`
   - Express: `src/routes/**/*.ts`
   - Fastify: `src/routes/**/*.ts`
2. **Extract endpoints**: Parse decorators/route definitions for paths and methods
3. **Generate handler stubs** using templates from `msw/handlers.template.ts`:
   - Auth handlers (login, logout, session)
   - CRUD handlers (GET, POST, PUT, DELETE)
   - Error simulation handlers
4. **Create setup files**:
   - `src/mocks/handlers.ts` - Generated handlers
   - `src/mocks/server.ts` - Node.js MSW server
   - `src/mocks/browser.ts` - Browser MSW (for Storybook)
5. **Output**: `src/mocks/` directory populated

### Phase: Integration (`$ARGUMENTS` = "integration" or "full")

**Goal**: Run fast integration tests with MSW before slower E2E tests.

**Runs BEFORE E2E** - faster feedback, catches issues early.

1. **Start MSW server** for API mocking
2. **Run integration tests**: `npm run test:integration 2>&1 | tee test-reports/integration/output.log`
3. **Collect results**:
   - Parse test output for failures
   - Extract coverage metrics if available
4. **Output**: `test-reports/integration/results.json`
5. **Decision point**: If critical failures exist, ask user whether to continue to E2E

### Phase: E2E (`$ARGUMENTS` = "e2e" or "full")

**Goal**: Run both E2E frameworks for cross-validation.

**Runs AFTER integration tests** pass or user approves.

#### For PRODUCTION Environment (TEST_ENV=production)

If user selected production:
1. **Skip server startup entirely** - production is already running
2. **Verify production is accessible**: `curl -s -o /dev/null -w "%{http_code}" $PRODUCTION_URL`
3. **Run tests with TEST_ENV=production prefix** (see Step 3 below)

#### For LOCAL Environment (TEST_ENV=local)

##### Step 1: Check Server Status

First, check if servers are already running (substitute your LOCAL_WEB_URL and LOCAL_API_URL):

```bash
curl -s -o /dev/null -w "%{http_code}" $LOCAL_WEB_URL 2>/dev/null || echo "000"
```

```bash
curl -s -o /dev/null -w "%{http_code}" $LOCAL_API_URL/health 2>/dev/null || curl -s -o /dev/null -w "%{http_code}" $LOCAL_API_URL 2>/dev/null || echo "000"
```

If BOTH return 200 (or 401/404 for API), skip to Step 3 (Run E2E Tests).

##### Step 2: Start Servers (if not running) - LOCAL ONLY

If servers are not running, start them automatically:

**Step 2a: Start Database**
Run this and wait for completion: `npm run db:up`

Then ensure migrations are applied: `npm run db:migrate`

**Note on Docker**: If Docker commands fail with "command not found":
- **macOS with Docker Desktop**: Prefix with `PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"`
- **Linux**: Docker should be in PATH; ensure Docker service is running (`systemctl start docker`)
- **Windows/WSL**: Ensure Docker Desktop is running and WSL integration is enabled

**Step 2b: Start API Server in Background**
Use the Bash tool with `run_in_background: true` to run: `npm run dev:api`

**Step 2c: Start Web Server in Background**
Use the Bash tool with `run_in_background: true` to run: `npm run dev:web`

**Step 2d: Wait for Servers to be Ready**
Poll for readiness with a loop (substitute your LOCAL_WEB_URL and LOCAL_API_URL):

```bash
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do WEB=$(curl -s -o /dev/null -w "%{http_code}" $LOCAL_WEB_URL 2>/dev/null); API=$(curl -s -o /dev/null -w "%{http_code}" $LOCAL_API_URL/health 2>/dev/null || curl -s -o /dev/null -w "%{http_code}" $LOCAL_API_URL 2>/dev/null); echo "Attempt $i: Web=$WEB API=$API"; if [ "$WEB" = "200" ] && ([ "$API" = "200" ] || [ "$API" = "401" ] || [ "$API" = "404" ]); then echo "READY"; exit 0; fi; sleep 5; done; echo "TIMEOUT"
```

If the output ends with "READY", proceed to Step 3.
If the output ends with "TIMEOUT", inform the user that servers failed to start and ask how to proceed.

#### Step 3: Run E2E Tests

**Use the adaptive runner** which tries parallel first, then falls back to sequential if server overload is detected:

**Cypress Environment Note**: VSCode and Claude Code set `ELECTRON_RUN_AS_NODE=1` which breaks Cypress. Always use the npm scripts which handle this, or prefix direct calls with `env -u ELECTRON_RUN_AS_NODE`.

**For LOCAL**:
1. **Run Playwright (adaptive)**: `npm run test:e2e:adaptive 2>&1 | tee $TEST_REPORTS_PATH/playwright-output.log`
   - Tries parallel first (fast)
   - If server crashes detected (ECONNREFUSED, etc.), automatically retries with `--workers=1`
2. **Run Cypress**: `npm run test:e2e:cypress 2>&1 | tee $TEST_REPORTS_PATH/cypress-output.log`

**For PRODUCTION**:
1. **Run Playwright (adaptive)**: `TEST_ENV=production npm run test:e2e:adaptive 2>&1 | tee $TEST_REPORTS_PATH/playwright-output.log`
2. **Run Cypress**: `TEST_ENV=production npm run test:e2e:cypress 2>&1 | tee $TEST_REPORTS_PATH/cypress-output.log`

3. **Capture artifacts**: Screenshots on failure, videos if configured

**Output**: `TEST_REPORTS_PATH/`

**Note for monorepos**: If Cypress is in a subdirectory (e.g., `packages/web/`), cd into it first or adjust npm scripts accordingly.

#### Step 4: Server Cleanup (Optional)

After E2E tests complete, ask the user if they want to stop the background servers.
If yes, find and kill the node processes for dev:api and dev:web.

### Phase: Synthesize (`$ARGUMENTS` = "synthesize" or "full")

**Goal**: Combine all test results into actionable fix recommendations.

1. **Parse all test results** into standardized BugReport schema:
   - Integration test failures
   - Playwright failures
   - Cypress failures
2. **Detect conflicts** using algorithm from `report-synthesis/conflict-detector.ts`:
   - Same-file conflicts (multiple fixes for one file)
   - Dependency conflicts (fix A requires fix B first)
   - Contradictory fixes (mutually exclusive recommendations)
3. **Generate dependency graph** of fixes
4. **Create topologically sorted fix order**
5. **Output files**:
   - `TEST_REPORTS_PATH/combined/fix-it-plan.md` - Prioritized action items
   - `TEST_REPORTS_PATH/combined/conflict-analysis.md` - Blocking issues requiring human decision
   - `TEST_REPORTS_PATH/combined/uat-evidence.md` - Test results mapped to UAT checklist
6. **IMPORTANT: Save final report to file**: After generating the summary, ALWAYS write the complete test results report to `TEST_REPORTS_PATH/comprehensive-test-report.md`. This ensures the report persists even if the session ends. Include the full Fix-It Plan, UAT Evidence, and all test summaries in this file.

---

## Output Files

All paths relative to TEST_REPORTS_PATH (default: `test-reports/`):

| File | Purpose |
|------|---------|
| `integration/results.json` | Integration test results |
| `playwright/results.json` | Playwright E2E results |
| `cypress/results.json` | Cypress E2E results |
| `combined/fix-it-plan.md` | **Primary output** - Prioritized fixes |
| `combined/conflict-analysis.md` | Conflicts requiring manual review |
| `combined/uat-evidence.md` | UAT checklist completion evidence |
| `comprehensive-test-report.md` | **Complete summary report** - Full results for session continuity |

---

## Core Principles

1. **Two E2E frameworks** - Playwright + Cypress for confidence via overlap
2. **MSW for API isolation** - Deterministic, edge-case testing without backend dependencies
3. **Integration tests first** - Fast feedback before slow E2E runs
4. **Conflict detection** - Automated analysis prevents fix collisions
5. **Synthesized output** - Single prioritized fix-it plan, not scattered reports
6. **UAT alignment** - Map tests to acceptance criteria for sign-off
7. **Automatic server management** - Start servers if needed, clean up when done

---

## Reference Materials

- [Config templates](config-templates/) - Playwright, Cypress, Vitest configs
- [MSW templates](msw/) - Handler patterns for auth, CRUD, errors
- [Report synthesis](report-synthesis/) - Bug schema, conflict detection, synthesizer
- [Checklists](checklists/) - Pre-test and UAT templates

---

## Quick Reference

| Command | Action |
|---------|--------|
| `/comprehensive-test setup` | Install deps, generate configs |
| `/comprehensive-test msw` | Generate MSW handlers from API routes |
| `/comprehensive-test integration` | Run integration tests with MSW |
| `/comprehensive-test e2e` | Run Playwright + Cypress (adaptive: parallel-first, sequential-fallback) |
| `/comprehensive-test e2e skip-preflight` | Skip pre-flight cleanup, run E2E directly |
| `/comprehensive-test synthesize` | Combine reports, generate fix plan |
| `/comprehensive-test full` | Complete pipeline (all phases) |
| `/comprehensive-test` | Interactive - ask which phase |

### Standalone Cleanup Commands

These npm scripts can be run directly without using the skill:

| Command | Action |
|---------|--------|
| `npm run test:clean` | Kill test ports, clear caches (fast) |
| `npm run test:fresh` | Clean + run unit tests |
| `npm run test:e2e:adaptive` | Parallel-first E2E, sequential fallback on crash |
| `npm run test:reset-all` | Nuclear option: clean + db:push + db:seed |
