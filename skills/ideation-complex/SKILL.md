---
name: ideation-complex
description: Guide a complex project ideation session through chunk identification, per-chunk discovery, and structured output files ready for /kickoff Pathway A
argument-hint: "project-name-or-description"
---

# Ideation: Complex Path

Guide a complex project through structured business domain discovery. This skill produces
chunk discovery files, decisions.md, dependencies.md, and an assumption log — the exact
inputs that `/kickoff` Pathway A consumes.

**This skill runs in Cowork (headless environment).** No browser or web search. Write
files to disk as discovery progresses. Subagents available if needed.

---

## First Action: Check for Existing Work

Check the current project directory for existing discovery files:

1. Look for `decisions.md`, `dependencies.md`, and `N-*-discovery.md` files
2. Also check for `chunks.md` or any notes file that might indicate a prior session

**If existing files found**:
- Read them all
- Summarize: "I found [N] chunks already identified. Chunks [X, Y] have discovery files. The last decision logged was D-[NNN]."
- Ask: "Where would you like to resume?"
  - Continue next chunk
  - Revisit a specific chunk
  - Add a new chunk
  - Begin wrap-up (check all chunks complete)
- Resume from the appropriate phase below

**If no existing files**:
- If the user provided $ARGUMENTS, use that as the project description
- Otherwise ask: "What are we building? Give me a brief description of the project — what it does, who it's for, and the main problem it solves."
- After getting context, proceed to Phase 0

---

## Phase 0: Chunk Identification

**Goal**: Identify 4-8 business domains for this project. Surface these through structured
questioning before writing anything.

### What chunks are

Chunks are **business domains**, not build phases. They scope discovery conversations —
each chunk should be independently discoverable, meaning you can have a complete
conversation about it without needing to fully resolve another chunk first.

4-8 chunks is the sweet spot. Fewer means too broad for deep discovery; more means
over-decomposition.

### Guiding questions (ask 2-3, adapt based on answers)

Work through these angles to surface natural domain boundaries. **Do not ask all of them
— pick the ones most relevant to the project type. Ask one question at a time and wait
for the answer.**

**Value flows**:
- "Walk me through how value moves through this system — what gets created, processed, and delivered?"
- "What are the distinct categories of activity in this system that each have their own rules or approval paths?"

**Compliance and regulation**:
- "What regulatory or compliance obligations does this system need to support? Each one that has its own reporting, audit trail, or approval workflow is usually a chunk."

**External integrations**:
- "What external systems does this need to connect to? Each integration typically has its own data model, auth, and failure behavior."

**People and workflows**:
- "Who are the different types of people using this system? Do they have fundamentally different workflows, or do they use the same features differently?"

**Operations and lifecycle**:
- "What are the major lifecycle events in this domain? (e.g., onboarding, processing, reconciliation, reporting, archival)"

### Propose initial chunks

After gathering enough context (usually 2-4 rounds of Q&A):

1. Propose a chunk list with names and one-sentence descriptions. Example format:
   ```
   Proposed chunks:
   1. user-management — Account creation, roles, permissions, and authentication
   2. catalog — Product/content creation, editing, and organization
   3. orders — Order lifecycle from submission through fulfillment
   4. notifications — Transactional messaging, preferences, and delivery tracking
   5. reporting — Usage analytics and operational reports
   ```

2. Ask: "Does this capture all the major business domains? What's missing or should be split/merged?"

3. Iterate until the user confirms the chunk list.

### Initialize files

Once the chunk list is confirmed, create the following files:

**decisions.md** (create fresh, or add header if it already exists):
```markdown
# Decisions Log

Chronological log of significant decisions made during discovery.
Format: D-NNN | Date | Decision | Rationale | Affects

---
```

**dependencies.md** (only if 3+ chunks):
```markdown
# Cross-Chunk Dependencies

Tracks how decisions and discoveries in one chunk impact other chunks.
Updated after each chunk's discovery phase.

---
```

Then announce: "I'll work through the chunks in order, starting with the most foundational domain. Ready to begin discovery for Chunk 1: [name]?"

---

## Phase 1: Per-Chunk Discovery

Work through chunks sequentially. For each chunk:

### 1.1 Open the chunk

State: "Let's explore **Chunk [N]: [name]**. [One-sentence reminder of what this chunk covers.]"

Ask an opening question appropriate to the domain type. Examples by domain type:
- Core data/records: "Walk me through the lifecycle of the main record in this domain — what creates it, what changes it, what closes it out?"
- User/workflow: "Walk me through a typical [user type]'s interaction with this part of the system — start to finish."
- Reporting/compliance: "What specific outputs does this domain need to produce — reports, exports, filings — and who receives them?"
- Integration: "What data flows between [external system] and ours, in which direction, and what triggers the exchange?"

### 1.2 Discovery Q&A

Conduct deep Q&A for this chunk. Ask **one question at a time**. Wait for the answer before
continuing. Adapt the question sequence based on what you learn. **Do not recite a
fixed list of questions** — flow naturally. The goal is to surface:

**Business rules** — What are the rules governing this domain?
- Invariants that must always be true ("an order cannot ship without a confirmed payment method")
- Policies and approval gates ("requests over a threshold require manager sign-off")
- Classification rules ("items tagged as hazardous require a different fulfillment path")
- Exception handling ("if a record is submitted after the cutoff, it routes to manual review")

Probe with:
- "Is there ever an exception to that rule?"
- "What happens when [edge case]?"
- "Who enforces that rule — is it automated or manual?"

**Entities and data** — What gets created, read, updated, and deleted?
- What are the core records in this domain?
- What are their key fields and states?
- What's the lifecycle of the main record type?

Probe with:
- "Can [record] ever be deleted, or only archived/voided?"
- "What triggers a status change?"
- "How long does this data need to be retained?"

**User stories** — Who does what, when, why?
- Name specific people where possible ("Sarah enters expenses daily")
- Cover the main workflow AND the exceptions
- Include the approval/review path

Probe with:
- "What does [role] do when something goes wrong?"
- "Who reviews this before it's finalized?"
- "What's the difference between a [role A] and a [role B] for this?"

**Constraints** — What limits the solution?
- Regulatory requirements ("HIPAA requires audit logs for all record access")
- Performance ("search results must return in under 500ms")
- Organizational ("two people own this system and neither is technical")
- Technical ("must integrate with the existing identity provider")

**Open questions** — What's unresolved?
- "What's still unclear or undecided about this domain?"
- "What decisions need to happen before we can build this?"

### 1.3 Surface assumptions

As significant assumptions emerge during Q&A, log them in real time (don't wait until
the end). When you notice an assumption, say:

"That's an assumption worth logging. Let me add it to this chunk's assumption log."

Assign the next sequential ID (A1, A2, A3... continuing across all chunks from the
previous chunk's last ID). Rate it:

**Importance**: How critical is this to the chunk's viability?
- High: If wrong, this chunk fundamentally doesn't work or must be redesigned
- Medium: If wrong, significant rework — but the core approach survives
- Low: If wrong, adjust details — core design is unaffected

**Confidence**: How certain are we this assumption is true?
- High: Strong evidence, established practice, or user confirmed it explicitly
- Medium: Reasonable basis but not verified
- Low: Gut feeling, untested belief, or contradicted by something we heard

Record the assumption in the discovery file as you go (see format below). Adjust rating
if the conversation produces evidence.

### 1.4 Log decisions in real time

When a significant decision is made during the conversation — a choice between
alternatives, a scope boundary set, a policy confirmed — log it immediately.

Say: "That's a significant decision — let me capture it."

Append to decisions.md:
```markdown
## D-[NNN] — [Short title]

**Date**: [today]
**Decision**: [What was decided — one or two sentences]
**Rationale**: [Why this choice, including alternatives considered]
**Affects**: [Chunk names or downstream concerns impacted]

---
```

Increment D-NNN sequentially across all chunks. After logging, continue the conversation.

### 1.5 Check completeness before closing the chunk

When the conversation feels complete for this chunk, do a quick completeness check:

"Before we move on, let me make sure we've covered the key areas for [chunk name]:

- Business rules: [brief summary of what was captured, any gaps?]
- Key entities: [brief summary]
- User workflows: [brief summary]
- Constraints: [brief summary]
- Open questions remaining: [list any]

Does anything feel underdeveloped or unresolved?"

Address any gaps the user identifies. Then ask if they're ready to close the chunk.

### 1.6 Write the discovery file

After the chunk conversation feels complete, write `N-chunk-name-discovery.md`. Use the
chunk's number and short name from the confirmed chunk list.

**Discovery file format**:

```markdown
# Chunk [N]: [Name]

## Overview
[2-4 sentences: what this domain covers, why it exists, who it serves]

## Business Rules
[Numbered list of rules, invariants, and policies. Be specific — include numeric
thresholds, named roles, regulatory/policy citations if mentioned.]

1. [Rule]
2. [Rule]
   - Exception: [if applicable]

## Key Entities
[The main data objects in this domain. For each: name, purpose, key states/lifecycle,
retention requirements if mentioned.]

**[Entity name]**: [Description. States: draft → submitted → approved → posted.]

## User Workflows

### [Workflow name]
**Who**: [Named person or role]
**Trigger**: [What initiates this]
**Steps**: [Numbered]
**Edge cases**: [What happens when it goes wrong]

[Repeat for each major workflow]

## Constraints
- **Regulatory**: [Any compliance requirements]
- **Performance**: [Any timing/throughput requirements]
- **Organizational**: [Staff capacity, tool constraints]
- **Integration**: [Dependencies on other systems]

## Cross-Chunk Dependencies
[How this chunk affects or depends on other chunks. Will be reflected in dependencies.md.]
- **→ [Other chunk]**: [What this chunk sends or impacts]
- **← [Other chunk]**: [What this chunk needs from another]

## Open Questions

**Blocking** (must answer before build):
| # | Question | Impact if unresolved | Owner |
|---|----------|---------------------|-------|
| 1 | [Question] | [Impact] | [Who] |

**Non-blocking** (can resolve during implementation):
| # | Question | Default assumption |
|---|----------|-------------------|
| 1 | [Question] | [What we'll assume] |

## Decisions Made
[References to decisions.md entries that originated in this chunk's discovery.]
- D-[NNN]: [Brief summary]
- D-[NNN]: [Brief summary]

## Assumptions Log

| ID | Assumption | Category | Importance | Confidence | Evidence | Priority |
|----|------------|----------|------------|------------|----------|----------|
| A[N] | [Assumption] | [Problem/User/Solution/Domain] | High/Med/Low | High/Med/Low | [What supports or contradicts this] | Test First / Monitor / Validate Later |

### Priority Legend
- **Test First**: High Importance + Low Confidence — existential risks, validate before building
- **Monitor**: High Importance + High Confidence — critical but we're confident; watch for surprises
- **Validate Later**: Lower priority — nice to confirm but not blocking
```

### 1.7 Update dependencies.md (if 3+ chunks)

After writing the discovery file, update dependencies.md with any cross-chunk impacts
discovered in this chunk:

```markdown
## From Chunk [N]: [Name]

| Decision | What was decided | Affects | Impact |
|----------|-----------------|---------|--------|
| D-[NNN] | [Brief] | [Chunk name] | [Specific impact on that chunk] |
```

If no cross-chunk impacts were found, note: "No cross-chunk impacts identified in Chunk [N] discovery."

### 1.8 Transition to next chunk

Announce: "Chunk [N] discovery complete. Discovery file written: `[N]-[name]-discovery.md`"

If more chunks remain: "Ready to move to Chunk [N+1]: [name]? Or do you want to revisit anything in [current chunk]?"

If this is the last chunk: proceed to Phase 2 (Wrap-Up).

---

## Phase 2: Wrap-Up and Handoff

After all chunks have discovery files:

### 2.1 Cross-chunk assumption review

Scan all assumption logs across all chunks. Identify:
- **Duplicate assumptions** (same assumption appeared in multiple chunks — merge and keep the ID that appeared first, note the duplicate in the other chunk)
- **Conflicting assumptions** (two chunks assumed opposite things — flag for resolution)
- **High-priority cluster** (if 3+ "Test First" assumptions cluster around the same theme — that's a signal worth surfacing)

Present: "Across all [N] chunks, I've logged [X] assumptions. The highest-priority ones are:
[list Test First items with IDs and chunk source]

Any of these concern you before we move to /kickoff?"

### 2.2 Decision log completeness

Quick scan of decisions.md. Confirm:
- All major scope decisions are logged
- Decisions that affect multiple chunks reference both in the "Affects" field
- No obvious gaps (major decisions discussed but not captured)

If gaps found: "I noticed we made a decision about [X] but I don't see it in decisions.md. Let me capture it now." Log it.

### 2.3 Dependencies review (if file exists)

If dependencies.md exists, review for completeness. Ask:
"Looking at the dependency map — are there any cross-chunk impacts we discussed but didn't capture?"

Update if needed.

### 2.4 Final file checklist

Confirm the following files exist and are complete:

```
[project directory]/
  decisions.md            ✓ All major decisions logged with D-IDs
  dependencies.md         ✓ Cross-chunk impacts captured (or skipped — 1-2 independent chunks)
  1-[name]-discovery.md   ✓
  2-[name]-discovery.md   ✓
  ...
  N-[name]-discovery.md   ✓
```

### 2.5 Handoff message

Present:

"Discovery is complete. Here's what's ready for /kickoff:

**Chunks completed** ([N] of [N]):
[List each chunk with one-sentence status]

**Decisions logged**: [X] entries (D-001 through D-[NNN])

**Assumptions identified**: [X] total
- Test First (highest risk): [list IDs]
- Monitor: [list IDs]
- Validate Later: [count]

**Open questions to resolve before build**:
[List any blocking open questions from across all chunks]

**Next step**: Run `/kickoff` in Claude Code from this project directory. It will detect
the chunk discovery files and use Pathway A to generate per-chunk specs. It may ask
targeted gap-filling questions about engineering concerns (performance, data retention,
error recovery) that business-focused discovery tends to undercover."

---

## Methodology Reference

### Chunking heuristics (embedded — do not reference CONVENTIONS.md)

Four signals that indicate a natural chunk boundary:

1. **Value flows** — how value moves through the system (creation, processing, delivery,
   reporting) — distinct stages with their own rules tend to be natural chunk boundaries
2. **Compliance boundaries** — each regulatory obligation with its own reporting or
   audit trail is typically a chunk
3. **Integration boundaries** — each external system has its own data model, auth,
   and failure behavior
4. **Workflow boundaries** — when users have fundamentally different workflows (not
   just different permissions to the same workflow), that often signals a boundary

Keep chunks **independently discoverable**: you should be able to have a complete
conversation about one chunk without needing to resolve another first. Dependencies
are tracked, not blocked on.

### Discovery order

Start with the most foundational domain — the chunk that everything else builds on.
For most systems: core data model / user management / primary workflow first. Work outward from
there, updating dependencies.md after each chunk before moving to the next.

### What "complete discovery" means (for /kickoff's assessment)

A chunk is ready for spec when:
- Business rules are enumerated (not just gestured at)
- Key entities and their lifecycles are named
- Main user workflows are documented with edge cases
- Open questions are categorized as blocking or non-blocking
- Cross-chunk dependencies are captured
- All significant decisions are logged in decisions.md

A chunk is "partial" when major questions remain open or only the surface was explored.
Flag partial chunks to the user before closing.

---

## Session Management Notes

Complex ideation often spans multiple sessions. At the start of any resumed session:

1. Read all existing files to rebuild context
2. Identify the last completed chunk and the last D-ID and A-ID assigned
3. Continue A-ID numbering sequentially (don't restart at A1 in a new session)
4. Continue D-ID numbering sequentially
5. Summarize state to the user before resuming

---

## When to Use

- User says "complex ideation", "let's do discovery", "I need to break this project into chunks"
- Project has 3+ distinct business domains requiring deep exploration
- Team expects 20-30 rounds of discovery questions before they're ready to spec
- Output will feed into `/kickoff` Pathway A (chunk-based spec generation)

## When NOT to Use

- Simple project with clear requirements → use `/kickoff` directly (Pathway C)
- Medium project with some domain depth but no chunking needed → use `/ideation-simple` + `/ideation-synthesize` → `/kickoff` Pathway B
- Already have chunk discovery files → go straight to `/kickoff` Pathway A
- Just need market research or assumption mapping → use `/ideation-research`
