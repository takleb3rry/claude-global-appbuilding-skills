---
name: tech-stack
description: Walk through technology decisions for a new project collaboratively
argument-hint: [project-description]
---

# Technology Stack Decision Guide

Guide me through selecting a technology stack for this project using a collaborative, educational approach.

## Project Context

$ARGUMENTS

## Your Approach

For each technology category:
1. **Present 2-4 viable options** with clear explanations (avoid jargon where possible)
2. **Explain tradeoffs** in accessible language covering:
   - Learning curve - how quickly can I understand and work with this?
   - Maintenance burden - ongoing effort to keep it running
   - Cost - monthly operational costs
   - Community support - documentation and help availability
   - How it fits with other decisions we've made
3. **Wait for my questions** before proceeding - this is a learning conversation
4. **Provide context** about why certain options fit this specific project's needs
5. **After I decide**, document the decision with rationale

## Decision Categories

Work through these in order, skipping any that don't apply to this project:
1. Backend Language & Framework
2. Database
3. Frontend Framework
4. Local Development Environment
5. Hosting Platform & Deployment Environments
6. File/Document Storage
7. Email Service
8. Authentication Strategy
9. Testing Framework
10. UI/UX Foundations

### Category-Specific Notes

**4. Local Development Environment**
Ask: Mac, Windows, Linux, or mixed team? Using Docker for local dev? WSL for Windows?

Common cross-platform issues to discuss:
- Path separators (`/` vs `\`) → use `path.join()` or forward slashes
- Line endings (LF vs CRLF) → configure `.gitattributes`
- Case sensitivity → be consistent with import casing
- Shell scripts → use npm scripts or cross-env for portability
- Native dependencies → Docker or pre-built binaries help
- Docker mounts on Windows → slower without WSL2

**5. Hosting Platform & Deployment Environments**
First ask: How many environments? Options:
- Local-only (prototyping)
- Dev + Prod (small projects)
- Dev + Staging + Prod (production apps)

Then ask hosting preference. **Important**: If local dev OS differs from production OS and they're not using containers, flag this as a risk—recommend Docker or CI/CD testing on the target platform.

**9. Testing Framework**
After selection, validate:
- Tests run on all team members' OS (from decision #4)
- CI/CD can test on production-target OS (from decision #5)
- If dev OS ≠ prod OS without containers, CI must test on prod-target OS

**10. UI/UX Foundations**
Keep this lightweight - just enough to guide consistent output:
- Accessibility baseline (default: WCAG AA / Section 508)
- Reference site URL (optional) - "keep styling in this visual family"
- Component library choice (shadcn, MUI, Tailwind defaults, none)
- Color scheme preference (light/dark/system)

Ask me upfront if there are categories to skip or add based on the project.

## Recording Decisions

After each decision, append to `technology_decisions.md` in the project root. Create the file if it doesn't exist.

For each decision, document:
- **Decision**: [Name] - [Choice]
- **Date**: [Today's date]
- **Options Considered**: Brief list with 1-line summaries
- **Rationale**: Why this choice fits the project
- **Key Tradeoffs Accepted**: What we're giving up
- **Dependencies**: How this affects other decisions
- **Environment Notes**: Any OS-specific or cross-platform considerations (if applicable)

## Key Principles

- **Understanding over "best practices"** - the goal is to learn WHY certain technologies fit certain problems
- **No rushing** - take time to explain and answer questions
- **Project-specific** - recommendations should fit the actual constraints (budget, team size, compliance, timeline)
- **Honest tradeoffs** - every choice has downsides; be clear about them

## Getting Started

**First action**: Create `technology_decisions.md` in the project root with the initial template (purpose, decision-making philosophy, confirmed constraints section, and decision log header). This ensures the file exists for other commands like `/plan-phase` that reference it.

Then, if I haven't provided project context above, ask me about:
- What does the application do?
- Who are the users and how many?
- Any compliance or security requirements?
- Budget constraints?
- Will I maintain this myself or with a team?
- Any technologies I already know or want to learn?

---

## Phase 2: Implementation Plan Generation

After completing all technology decisions, generate `implementation_plan.md` in the project root.

**Prerequisites**: Confirm these files exist before generating the plan:
- `requirements.md` (from `/kickoff`)
- `design.md` (from `/kickoff`)
- `technology_decisions.md` (from this command)

**Environment check**: If local dev OS differs from production OS and containerization wasn't selected, add an environment mismatch risk to the plan.

**Implementation Plan Structure**:

1. **Overview** - Brief summary of what will be built and the approach
2. **Phase 0: Technology Stack Decisions** - Reference to technology_decisions.md (already complete)
3. **Phases 1-N** - Sequential build phases, each containing:
   - **Goal**: Single sentence describing the phase objective
   - **Tasks**: Numbered list of specific work items
   - **Deliverable**: What's produced when phase is complete
4. **Phase Dependencies** - Visual or textual representation of which phases depend on others
5. **Risk Areas & Mitigation** - Known challenges and how to address them
6. **Success Criteria** - Checklist for determining when the project is complete

**Phase Design Principles**:
- Each phase should be completable in a focused work session
- Early phases establish foundation (scaffolding, data model, auth)
- Middle phases build core features incrementally
- Later phases handle polish (testing, monitoring, deployment)
- Each phase should produce something testable

**After generating the plan**, proceed to Phase 2.5.

---

## Phase 2.5: Create naming_conventions.md

After generating implementation_plan.md, create `naming_conventions.md` in the project root.

**Purpose**: Establish naming conventions early so Claude Code generates consistent code from Phase 1 onward, and `/commit-phase` can check compliance.

**Seed from technology_decisions.md**:

1. **Extract toolset-enforced conventions**:
   - If using Drizzle/Prisma: DB columns = snake_case, TS = camelCase
   - If using Zod: API fields = camelCase
   - If using React: Components = PascalCase, hooks = use prefix
   - If using Playwright/Vitest: Test files = *.test.ts(x)

2. **Always include these required patterns**:
   - data-testid patterns for E2E testing
   - Modal callback standards (onClose, onSubmit)
   - Error state naming (error, fieldErrors)
   - Date/timestamp field naming (*Date vs *At)

3. **Format for Claude Code** (not human-readable):
   - Use code blocks with exact patterns
   - Use tables for quick reference
   - Include "NOT" examples for common mistakes

**Template structure**:
```markdown
# Naming Conventions

Claude: Read this before generating UI components, API routes, or tests.

## UI Foundations

Accessibility: [WCAG AA / Section 508 baseline]
Reference site: [URL or "none specified"]
Component library: [choice from tech decisions]
Color scheme: [light/dark/system]

## REQUIRED: Test IDs
[code block with data-testid patterns]

## REQUIRED: Modal Props
[TypeScript interface with NOT comments]

## REQUIRED: Error State
[code block with NOT comments]

## Naming Patterns
[table of patterns]

## Toolset-Enforced (No Action Needed)
[table based on tech decisions]
```

**After creating naming_conventions.md**, inform user:
"Created naming_conventions.md - Claude Code will reference this when generating code. The /commit-phase skill will check compliance before each phase commit."

Then inform user the next step is `/plan-phase 1` to begin detailed planning for the first implementation phase.

---

## When to Use
- After `/kickoff` is complete
- User says "tech stack", "choose technologies", "what stack should I use"
- User says "what technologies should I use", "help me choose a stack", "let's decide on the tech", "what should I build this with"
- Need to make technology decisions for a new project

## When NOT to Use
- No requirements.md or design.md yet (use `/kickoff` first)
- Technology decisions already made
- Ready to start implementing (use `/plan-phase`)
