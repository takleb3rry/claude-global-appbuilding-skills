---
name: plan-phase
description: Build a detailed execution plan for a specific implementation phase
argument-hint: <phase-number>
---

# Plan Phase

Using these documents as the priority foundation:
- @implementation_plan.md
- @design.md
- @requirements.md
- @technology_decisions.md

Build a detailed execution plan for Phase $ARGUMENTS.

**IMPORTANT: Write the plan to `phase$ARGUMENTS_plan.md` in the project root directory.**

Include:
1. Specific tasks to complete
2. Files to create or modify
3. Tests to write
4. Acceptance criteria from requirements that will be satisfied
5. Any dependencies on previous phases that need verification

## When to Use
- Starting a new implementation phase
- User says "plan phase X", "build a plan for phase X", "what's in phase X"
- User says "let's plan out phase X", "what needs to happen in phase X", "break down phase X for me", "I'm ready to start phase X"
- Beginning detailed work on a specific phase from implementation_plan.md

## When NOT to Use
- Initial project setup (use `/kickoff` instead)
- Technology decisions (use `/tech-stack` instead)
- Actually executing the plan (use `/execute-phase` instead)
