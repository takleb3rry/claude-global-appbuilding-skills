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

### 3a: Test-First (Layer 0)

Before writing any implementation code, write tests that encode the task's acceptance criteria.

1. Read the task's acceptance criteria from the plan
2. Write one or more test cases targeting the **expected behavior** — not the implementation you're about to write
3. Run the tests. **They must FAIL.** If they pass, the test isn't testing new behavior — rewrite it until it fails for the right reason
4. Only then proceed to 3b (Build)

**Skip Layer 0 when** the task is purely structural — file scaffolding, config changes, dependency installation, migration file creation, or static content. When skipping, note "Layer 0 skipped — [reason]" and proceed.

> **If you're thinking...** | **Do this instead**
> ---|---
> "This is too simple to need a test first" | Simple code breaks. The test takes 30 seconds to write. Do it.
> "I'll write the test after, I know what I'm building" | Tests written after implementation confirm what you built, not what was intended. They pass vacuously.
> "The existing tests will catch it" | Existing tests cover existing behavior. New behavior needs a new failing test.
> "This task is just wiring/plumbing" | Wiring bugs are the hardest to find. A test that verifies the wire is connected catches them early.

---

### 3b: Build

Implement the task. Read any file before modifying it. Follow the plan; don't add scope beyond what's specified.

### 3c: Evaluate

After building each task, run the evaluator before moving on. Four layers — work through them in order. Fix failures before advancing.

> **If you're thinking...** | **Do this instead**
> ---|---
> "This task is trivial, I can skip the evaluator" | Trivial tasks have trivial evaluations. Run them. Skipping is how trivial bugs ship.
> "Tests passed last task, I just need to check this one quick change" | Each task gets all layers. Cumulative changes create interaction bugs.
> "The dev server isn't running so I'll skip Layer 2" | Already handled — Layer 2 notes the skip and continues. But don't skip Layers 0, 1, 3, or 4.
> "I'll batch the security review, it's faster" | The security review IS batched (Step 5). Per-task reviews are Layers 1-4. Don't conflate them.
> "This blocker is obvious, I don't need to ask" | If you're confident, presenting options takes 10 seconds. If you're wrong, guessing costs an hour.

---

#### Evaluator Layer 1: Automated Tests (includes Layer 0 re-run)

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

Any failing criterion → fix, then re-run all evaluator layers before advancing.

---

#### Evaluator Layer 4: Adversarial Review

Run this layer on tasks that modify **business logic, auth, data mutation, or financial calculations**. Skip for pure UI/styling, documentation, and config changes — note "Layer 4 skipped — [reason]" when skipping.

Dispatch a subagent (via the Agent tool) with this prompt, filling in the specifics:

> You are reviewing code written by another agent. Do not trust their self-assessment. They finished suspiciously quickly.
>
> **Task:** [task description from plan]
> **Acceptance criteria:** [list from plan]
> **Files created/modified:** [list]
>
> Read every file listed. Check:
> (a) Does the code actually satisfy each acceptance criterion, or does it only appear to?
> (b) Are there edge cases the acceptance criteria don't cover but the requirements imply?
> (c) Any security issues, silent failures, or error paths that swallow exceptions?
>
> Report as PASS or ISSUES_FOUND with specific file:line references for each finding.

**If ISSUES_FOUND:** Fix the issues, re-run Layers 1-3, then re-run Layer 4.

**Max 2 review loops.** If Layer 4 still reports issues after 2 rounds, escalate to the user with the findings rather than continuing to iterate.

---

### 3d: Mark Complete

Only after Layer 0 tests pass (via Layer 1 re-run) and all evaluator layers pass: mark the task complete in TodoWrite and proceed to the next task.

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

**Verification language rules** — these apply to per-task completion (Step 3d) and phase completion alike:
- Never claim a task or phase is complete without command output that proves it (test pass count, build success, Playwright results)
- Banned phrases: "should work now", "this probably fixes it", "that should be fine", "I believe this resolves"
- Every completion statement must cite evidence: "Task 3 complete — `vitest run` passes 24/24, Playwright verified `/settings` and `/profile`"
- Follow the `/verify` checklist: IDENTIFY the proving command → RUN it → READ full output → CHECK it confirms the claim

When all tasks pass evaluation and the security review is clean:

1. List what was built (one line per task, with evidence summary)
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
