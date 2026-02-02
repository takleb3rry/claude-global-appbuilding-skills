---
name: commit-phase
description: Complete git workflow for a phase - branch, commit, merge, cleanup
argument-hint: <phase-number>
---

# Commit Phase

Complete git workflow for Phase $ARGUMENTS:

## Step 0: Naming Convention Check

Before committing, if naming_conventions.md exists in project root:

1. Identify the project's primary language/framework from project files
2. Get changed source files relevant to that stack: `git diff --name-only HEAD`
3. For each changed file, verify it follows the conventions documented in naming_conventions.md
   - Focus on naming consistency, test selectors, and patterns defined in the conventions
   - Use judgment about which conventions apply to which file types
4. Report findings:
   - **BLOCKING**: Issues that will likely break tests or cause runtime errors
   - **WARNING**: Inconsistencies that deviate from documented conventions
5. If issues found, ask: "Fix now or proceed anyway?"
6. If proceeding with issues, append to commit message:
   "Note: Convention issues deferred - see harmonize-report.md"

## Steps 1-5: Git Workflow

1. Check current branch: If on main, create feature branch:
   `git checkout -b phase-$ARGUMENTS-implementation`
2. Stage all changes: `git add .`
3. Commit with message: "Phase $ARGUMENTS: [brief description of phase deliverables]"
4. Push branch: `git push -u origin phase-$ARGUMENTS-implementation`
5. Merge to main: `git checkout main && git merge phase-$ARGUMENTS-implementation && git push`

Use implementation_plan.md to reference what this phase delivered for the commit message.

## Step 6: Clean Up Plan File

After merge is complete, delete `phase{$ARGUMENTS}_plan.md` if it exists. Just delete it locally - do NOT commit or push this deletion separately. It will be included in the next phase's commit naturally.

## Benefits of This Workflow
- Traceability: Each phase has its own branch in git history
- Rollback capability: Can revert the merge commit if needed
- Clear audit trail: Feature branches document what changed per phase
- Quality gate: Naming conventions checked before merge

## When to Use
- Phase implementation is complete and tested
- User says "commit phase X", "finish phase X", "wrap up phase X"
- User says "phase X is done", "let's commit this phase", "finish up phase X"
- Ready to merge completed work to main

## When NOT to Use
- Work is incomplete or tests are failing
- Still in the middle of implementing (continue with `/execute-phase`)
- Just want a regular commit (use git directly)
