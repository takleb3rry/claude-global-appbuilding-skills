---
name: plan-phase
description: Build a detailed execution plan for a specific numbered implementation phase — tasks, files to touch, acceptance criteria, and tests — structured for Claude Code to execute. Use this skill whenever the user wants to understand, plan, scope, or break down a phase before building it. Trigger on intent: planning what a phase contains, deciding if a phase is too big to tackle in one session, or preparing work to hand off to /execute-phase. Common phrasings include "plan/break down/scope/detail phase X", "what goes into phase X", "what needs to happen in phase X", "is phase X too big" — but also trigger on any casual variation that expresses wanting to understand or organize a phase's work before coding begins. Do NOT trigger when the user is ready to start coding (use /execute-phase) or is checking status mid-execution.
argument-hint: <phase-number>
---

# Plan Phase

Build a structured execution plan for Phase $ARGUMENTS and write it to `phase$ARGUMENTS_plan.md` in the project root.

---

## Step 1: Read the Source Documents

Read all four source documents before writing anything. Extract specific things from each:

- **`implementation_plan.md`** — Find Phase $ARGUMENTS. Copy its task list verbatim — you're planning exactly what it specifies, not a reinterpretation.
- **`requirements.md`** — Find the requirement IDs this phase satisfies. You'll reference these in acceptance criteria.
- **`design.md`** — Pull relevant UI layouts, data models, and component patterns for this phase.
- **`technology_decisions.md`** — Extract constraints that affect implementation (auth patterns, DB layer, API conventions).

Also scan for existing `phase*_plan.md` files. Skim any prior phase plans to understand what's already built — so you don't re-plan completed work or misstate dependencies.

---

## Step 2: Assess Phase Size

Count the tasks in Phase $ARGUMENTS from `implementation_plan.md`.

**3–8 tasks spanning a single system boundary** → plan the full phase as-is.

**>8 tasks OR spans multiple system boundaries** (e.g., DB schema + UI + email + auth) → split into labeled sub-phases:
- Phase $ARGUMENTSa: [first boundary]
- Phase $ARGUMENTSb: [second boundary]
- Phase $ARGUMENTSc: [third if needed]

If you split, ask: "Phase $ARGUMENTS is large. I've divided it into sub-phases Xa, Xb, Xc — [one line each]. Which would you like to plan first?"

---

## Step 3: Write the Plan

Write `phase$ARGUMENTS_plan.md` using this exact template. Keep all fields tight — this document is consumed by `/execute-phase`, not read by humans.

~~~markdown
# Phase $ARGUMENTS: [Title from implementation_plan.md]

## Summary

| # | Task | Requirements |
|---|------|-------------|
| 1 | [Task name] | REQ-XX-1, REQ-XX-2 |
| 2 | [Task name] | REQ-XX-3 |

## Dependencies

- [ ] [Specific thing from a prior phase to verify before starting — e.g., "migration 0012 applied"]
- [ ] [Env var, service, or external dep that must exist]

*None — if no dependencies.*

---

## Tasks

### Task 1: [Name]

**What:** [One sentence — what to build or change]

**Files:**
- Create: `path/to/file.ts`
- Modify: `path/to/other.ts` — [what to add/change]

**AC:**
- [ ] [Specific, testable criterion — reference REQ-XX-1]
- [ ] [Another criterion]
- [ ] [For tasks with unusual security surface: relevant security criterion, e.g., "uploaded files validated for type and size before storage"]

---

### Task 2: [Name]

**What:** [One sentence]

**Files:**
- Modify: `path/to/file.ts` — [what to add/change]

**AC:**
- [ ] [Criterion]

---

[Repeat for all tasks]

---

## Tests

| Test | File | Verifies |
|------|------|---------|
| [test name] | `src/__tests__/foo.test.ts` | [behavior] |
~~~

---

## Step 4: Confirm

After writing the file, output:

```
Phase $ARGUMENTS plan written — [N] tasks.

1. [Task 1 name]
2. [Task 2 name]
...

Requirements satisfied: [REQ list]
Dependencies: [list or "none"]

Run `/execute-phase $ARGUMENTS` to build.
```

---

## When to Use
- User says "plan phase X", "break down phase X", "scope phase X", "what goes into phase X", "what needs to happen in phase X"
- Starting a new implementation phase from `implementation_plan.md`

## When NOT to Use
- Initial project setup → `/kickoff`
- Technology decisions → `/tech-stack`
- Ad-hoc feature with no `implementation_plan.md` → just ask Claude directly
- Ready to build → `/execute-phase`
