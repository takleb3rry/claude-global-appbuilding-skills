---
name: execute-phase
description: Execute an approved implementation plan, with automated testing, UI verification, and acceptance-criteria review built into every task. Use this skill whenever the user is ready to start building — trigger on phrases like "execute phase X", "implement the plan", "let's start building", "start coding", "build this out", "time to code", "build phase X", "start phase X", "implement phase X", "let's build this", "start the build", "go ahead and build". Also trigger immediately after the user approves output from /plan-phase. Don't wait to be asked explicitly — if a plan exists and the user says something like "looks good, let's go", this is the right skill.
argument-hint: "phase-number"
---

# Execute Phase

Build the plan. Don't declare done until the evaluator approves every task.

---

## Step 1: Find and Read the Plan

Look for the plan file in this order:

1. `phase$ARGUMENTS_plan.md` in the project root (from `/plan-phase`)
2. If not found: ask "I don't see a plan file. Can you point me to it, or describe what we're building?"

Also read these if they exist — they constrain how you write code:
- `naming_conventions.md` — required naming patterns, test IDs, modal props
- `technology_decisions.md` — stack choices that affect implementation

Read the plan fully before touching any code. Identify:
- All tasks (numbered list)
- Acceptance criteria per task
- Files to create or modify
- Dependencies or risks noted

---

## Step 2: Set Up Progress Tracking

Use TodoWrite to create one todo per task from the plan. Mark each complete only after it passes all three evaluation layers.

---

## Step 3: The Execution Loop

Work through tasks one at a time. For each task:

### 3a: Build

Implement the task. Read any file before modifying it. Follow the plan; don't add scope beyond what's specified.

### 3b: Evaluate

After building each task, run the evaluator before moving on. Three layers — work through them in order. Fix failures before advancing.

---

#### Evaluator Layer 1: Automated Tests

```bash
# TypeScript compile check
npx tsc --noEmit

# Run tests relevant to what you changed
npx vitest run [affected files, or all if unsure]
```

Compile errors or test failures → fix and re-run. Don't advance until clean.

---

#### Evaluator Layer 2: UI Verification

Run this layer after any task that touches a UI component, route, page, or navigation link.

**Step 1 — Identify affected routes.** Look at which files you changed and map them to app routes (e.g., `src/app/vendors/page.tsx` → `/vendors`).

**Step 2 — Check if a dev server is running:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000"
```
If the result is `000`, note "UI verification skipped — dev server not running" and continue. Don't block the build for this.

**Step 3 — Write a targeted playwright verification script.** Create `e2e/_phase-verify.spec.ts` with the affected routes filled in:

```typescript
import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';

if (existsSync('playwright/.auth/user.json')) {
  test.use({ storageState: 'playwright/.auth/user.json' });
}

const ROUTES = ['/fill-in-affected-routes-here'];
const BASE = 'http://localhost:3000';

for (const route of ROUTES) {
  test(`UI: ${route}`, async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('console', m => { if (m.type() === 'error') jsErrors.push(m.text()); });
    page.on('pageerror', e => jsErrors.push(e.message));

    const res = await page.goto(`${BASE}${route}`);
    expect(res?.status(), `${route} returned error status`).toBeLessThan(400);
    await expect(page.locator('body')).not.toContainText('Something went wrong');

    // Check all visible buttons are enabled and clickable (no side effects)
    const buttons = page.locator('button:visible:not([disabled])');
    const btnCount = await buttons.count();
    for (let i = 0; i < btnCount; i++) {
      await buttons.nth(i).click({ trial: true });
    }

    // Click internal nav links and verify they don't crash
    const links = page.locator('a[href^="/"]:visible');
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href) {
        await page.goto(`${BASE}${href}`);
        await expect(page.locator('body')).not.toContainText('Something went wrong');
        await page.goto(`${BASE}${route}`); // return to original route
      }
    }

    expect(jsErrors, `JS errors on ${route}: ${jsErrors.join(', ')}`).toHaveLength(0);
  });
}
```

**Step 4 — Run it:**
```bash
npx playwright test e2e/_phase-verify.spec.ts --reporter=line
```

**Step 5 — Clean up:**
```bash
rm e2e/_phase-verify.spec.ts
```

Report which routes passed, which failed, and what errors were found.

**Any failures** → fix before moving on. Don't accumulate UI debt across tasks.

---

#### Evaluator Layer 3: Acceptance Criteria Self-Review

Read the acceptance criteria for this task from the plan. Evaluate each criterion explicitly:

```
Acceptance criteria check — Task N: [name]
✓ [criterion]: [how the implementation satisfies it — point to specific code or behavior]
✗ [criterion]: [what's missing or wrong]
```

Any failing criterion → fix, then re-run all three layers before advancing.

---

### 3c: Mark Complete

Only after all three evaluator layers pass: mark the task complete in TodoWrite and proceed to the next task.

---

## Step 4: Handling Blockers

When you hit something requiring a judgment call — architectural ambiguity, a missing dependency, a failing test with multiple plausible fixes, or anything where a wrong choice could cause rework — **stop and present options**:

> "I hit a blocker: [describe it in plain terms — no jargon].
>
> Options:
> 1. [Option A] — [tradeoff]
> 2. [Option B] — [tradeoff]
> 3. [Option C if applicable]
>
> Which do you prefer?"

Don't guess and proceed. Don't retry the same approach. Ask.

---

## Step 5: End-of-Phase Security Review

After all tasks complete, run a security pass on everything you built this phase. Check your own code against each item:

| Check | What to look for |
|-------|-----------------|
| Auth on new routes | Every new API route or page has an auth/session check — no unprotected endpoints |
| Input validation | User-supplied values validated before use (Zod, type checks, length limits) |
| Query safety | No raw string concatenation in DB queries — parameterized or ORM only |
| Secrets | No hardcoded credentials, tokens, or API keys in source files |
| XSS | No `dangerouslySetInnerHTML` with unescaped user content |
| Error leakage | Errors returned to clients don't expose stack traces, query text, or internal paths |

Report findings as:
- **BLOCKING** — fix before declaring the phase done
- **WARNING** — note it, proceed, flag for follow-up

Fix all BLOCKING items before moving to Step 6.

---

## Step 6: Completion

When all tasks pass evaluation and the security review is clean:

1. List what was built (one line per task)
2. Note any warnings or deferred items
3. Tell the user: "Phase complete. Run `/commit-phase $ARGUMENTS` to commit and merge."

---

## When to Use
- After `/plan-phase` produces an approved plan
- User says "execute phase X", "implement the plan", "start building", "let's build this", "time to code", "build phase X", "start phase X", "implement phase X"
- User approves a plan and is ready to write code

## When NOT to Use
- No plan exists yet — use `/plan-phase` first
- Still making technology decisions — use `/tech-stack`
- Work is done, just need to commit — use `/commit-phase`
