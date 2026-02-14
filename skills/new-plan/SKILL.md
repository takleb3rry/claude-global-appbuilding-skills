---
name: new-plan
description: Scaffold a new implementation plan document with a proven template structure
argument-hint: <feature-name>
---

# Skill: new-plan

Scaffold a new implementation plan document with a proven template structure.

## Usage

```
/new-plan [feature-name]
```

Example: `/new-plan user-notifications`

## Behavior

When invoked, create a new plan file in the project's `docs/` directory using the template below. Ask the user for:
1. Feature/fix name (if not provided as argument)
2. Brief problem statement (one sentence)

Then generate `docs/[FEATURE-NAME]-PLAN.md` with the template populated.

## Template

```markdown
# [Feature Name] — Plan

**Status:** Discovery
**Last Updated:** [Today's Date]
**Author:** [User] + Claude
**Traces to:** [Ask user or leave as TBD]

> **Protocol**: This section is auto-updated before session end. Start new sessions with: `@docs/[THIS-FILE].md Continue.`

---

## 1. Problem Statement

[User's brief problem statement]

---

## 2. Discovery

### Questions

1. [Generate 3-5 relevant discovery questions based on the problem]

### Responses

*(To be filled during discovery)*

### Synthesis

*(To be written after discovery)*

---

## 3. Design Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D1 | TBD | |

---

## 4. Requirements

### P0: Must Have

*(To be defined after discovery)*

### P1: Nice to Have

### P2: Future

---

## 5. Data Model

*(If applicable — schema changes, migrations)*

---

## 6. Implementation Plan

### Phase 1: [TBD]

| Task | Status | Notes |
|------|--------|-------|
| | 🔲 | |

---

## 7. Verification

*(How to test that it works)*

---

## 8. Session Progress

### Session 1: [Today's Date] (Discovery)

**Completed:**
- [x] Created plan document
- [ ] Discovery Q&A

**Next Steps:**
- [ ] Complete discovery questions
- [ ] Synthesize findings
- [ ] Define requirements
```

## AI-Friendly Patterns

Remind the user of these conventions:

- **Tables over prose** for decisions, tasks, file lists
- **Numbered IDs** for cross-reference (D1, REQ-XX-1)
- **Status markers**: ✅ ⏳ 🔲 (not prose like "in progress")
- **File paths inline**: `src/lib/foo.ts` not "the foo module"
- **Session boundaries**: Track what was done THIS session
- **Critical context at edges**: Summary at top, next steps at bottom

## After Creation

After creating the plan file, suggest:
1. "Let's start discovery. I'll ask you questions about [problem]."
2. Or if the user prefers: "You can also provide context and I'll generate discovery questions."
