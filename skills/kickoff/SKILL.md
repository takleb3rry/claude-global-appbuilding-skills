---
name: kickoff
description: Initialize a new project by analyzing source documents and generating requirements.md and design.md
argument-hint: [path-to-requirements-doc-or-notes]
---

# Project Kickoff

Analyze the provided source document(s) and guide me through generating foundational project documents.

## First Action: Detect Input Pathway

Check the project root for existing inputs, **in this order**:

### Pathway A: Chunk Discovery Files

Check if numbered chunk discovery files exist (e.g., `1-*-discovery.md`, `2-*-discovery.md`).

**If chunk discovery files exist**:
1. Announce: "I found chunk discovery files. I'll use the deep discovery pathway to generate per-chunk specs."
2. Read ALL of the following (if they exist):
   - All `N-*-discovery.md` files
   - `decisions.md` — decision rationale log
   - `dependencies.md` — cross-chunk impacts
   - `../company_facts.md` — organization-level source of truth (shared across projects)
   - `company_facts.md` — project-level copy (fallback if parent-level doesn't exist)
   - Any standalone integration specs (e.g., `*-spec.md`, `*-data-spec.md`) referenced by discovery files
   - `discovery-docs/` — scan for extracted reference documents (e.g., `*EXTRACTION*.md`, `*FACTS*.md`)
3. For each chunk, assess discovery completeness:
   - **Complete**: Has resolved questions, clear decisions recorded in decisions.md, ready for spec
   - **Partial**: Some questions explored, some still open — flag gaps to the user
   - **Not started**: Only a stub — skip for now, note it in output
4. Proceed to **Chunk Spec Generation** (below)

### Pathway B: Ideation File

**If no chunk discovery files exist**, check if `ideation.md` exists in the project root.

**If ideation.md exists and Status = "Ready for Kickoff"**:
1. Read ideation.md thoroughly
2. Announce: "I found your ideation document. I'll use it to accelerate the requirements process."
3. Extract and note:
   - Problem statement and jobs to be done
   - User segments (saves Customer Perspective questions)
   - Competitive landscape (saves Business Perspective questions)
   - Assumptions with IDs (A1, A2, etc.) — these will be referenced in requirements
   - Recommended solution hypothesis
   - Open questions to address
4. Many standard questions can be skipped if answered in ideation
5. Focus questioning on the "Open Questions for /kickoff" section
6. Proceed to **Ideation Spec Generation** (below — produces requirements.md + design.md)

### Pathway C: Standard Kickoff (no prior inputs)

**If neither chunk discovery files nor ideation.md exist**: Proceed with standard kickoff process.
1. Read any provided source documents ($ARGUMENTS)
2. Run the questioning process (below)
3. Proceed to **Ideation Spec Generation** (below — produces requirements.md + design.md)

---

## Source Documents

$ARGUMENTS

**First action** (Pathways B and C): Read the provided document(s) thoroughly. Extract:
- Core problem being solved
- Target users and their needs
- Key features and capabilities
- Constraints (regulatory, technical, budget)
- Success criteria
- Any gaps requiring clarification

## Questioning Process (Pathways B and C only)

After analyzing the source docs, ask clarifying questions **one at a time**. Wait for my answer before asking the next question. Adapt based on my responses — skip questions already answered, dig deeper when complexity emerges.

Progress through three perspectives (~20 questions total):

### Business Perspective (~7 questions)
- Organization context and mission
- Who pays for this / who benefits?
- What does success look like in 6 months?
- Budget and timeline constraints
- Who are the key stakeholders and decision-makers?
- What's the competitive landscape — are there alternatives users currently use?
- What are the risks if this project fails or is delayed?

### Engineering Perspective (~7 questions)
- Scale expectations (users, data volume)
- Compliance/regulatory requirements
- Integration with existing systems
- Who maintains this long-term?
- What's the expected data lifecycle (retention, archival, deletion)?
- Are there performance requirements (latency, throughput, availability)?
- What existing infrastructure or tech constraints should we work within?

### Customer Perspective (~6 questions)
- What's the #1 pain point this solves?
- Walk me through a typical user's day with this tool
- What would make users abandon this for something else?
- How do users currently solve this problem (workarounds)?
- What's the learning curve expectation — should this be intuitive or power-user focused?
- Are there different user segments with different needs?

---

## Chunk Spec Generation (Pathway A)

For each chunk with complete discovery, generate a spec file: `N-chunk-name-spec.md`

**Before generating each spec**, ask the user:
- "I'm ready to generate the spec for Chunk N: [name]. Any concerns or areas you want me to pay special attention to?"
- If the user has no concerns, proceed. Generate one spec at a time and get approval before moving to the next.

### 14-Section Spec Template

Each chunk spec follows this structure. Sections can be marked N/A or kept minimal when the chunk doesn't warrant depth in that area — the template ensures nothing is forgotten, not that every section is lengthy.

#### 1. Problem Statement
What problem does this chunk solve? Include evidence (user complaints, compliance gaps, operational inefficiencies). Grounded in the actual organization's situation, not generic. Reference company_facts.md and discovery findings.

#### 2. Goals
**User Goals** — what specific named users get (use real names from company_facts.md or discovery). **Business Goals** — what the organization gets. Each goal should be concrete enough that you could test whether it was achieved.

#### 3. Non-Goals
What is explicitly out of scope for this chunk, and why. Reference which other chunk owns each excluded concern (e.g., "Revenue recognition policy is a Chunk 2 decision"). This section prevents scope creep and clarifies boundaries.

#### 4. Design Principles
3-5 guiding principles for this chunk's design. Derived from decisions.md entries and organizational philosophy. These resolve ambiguity during implementation when the spec doesn't cover a specific case. Example: "Warn but don't block — the system guides users but never prevents them from proceeding."

#### 5. User Stories
Organized by persona and workflow area. Include edge cases and error states. Format: "As [named person], I want [capability] so that [benefit]." Pull personas from company_facts.md (staff/users section).

#### 6. Requirements
Prioritized into three tiers:

**P0 (Must-Have)** — cannot ship without. If any P0 is cut, the chunk cannot fulfill its core function.
**P1 (Nice-to-Have)** — significant improvement, fast-follow candidate. Include "Why P1 (not P0)" explanation.
**P2 (Future Consideration)** — architectural awareness only. Include "Architectural Consideration" noting what the design must not preclude.

Each requirement has:
- **Unique ID** (e.g., GL-P0-001, REV-P1-003) — chunk prefix + priority tier + number
- **Requirement statement**
- **Acceptance criteria** — specific, testable. Use real data from discovery where available (dollar amounts, account names, actual rates, specific people). Prefer Given/When/Then format for behavioral requirements; checkbox format for structural requirements.
- **Decision reference** — D-XXX from decisions.md (if applicable)

#### 7. Correctness Properties
Formal invariants that must hold across all valid states. Format: "For any [scope], [invariant that must be true]." Each property references which requirements it validates.

Examples:
- "For any GL entry, total debits SHALL equal total credits across all transaction lines." (validates GL-P0-001)
- "For any fund with restriction type 'Restricted', expenses posted to that fund SHALL trigger an automatic net asset release entry." (validates GL-P0-005)

These are directly testable assertions. Aim for 4-8 properties per chunk. If a property can't be tested, it's too vague.

#### 8. Business Logic Flows
Step-by-step workflows describing WHAT happens and WHEN (not UI/HOW). Numbered steps. Cover happy path and key branches. Use the format:

```
Flow: [Name]
Trigger: [What initiates this flow]
Preconditions: [What must be true before this flow runs]

1. [Step]
2. [Step]
   - If [condition]: [branch]
   - Otherwise: [continue]
3. [Step]

Postconditions: [What is true after this flow completes]
```

These translate directly into implementation logic.

#### 9. Error Handling Strategy
How the system handles user errors vs. system errors for this chunk's domain. Use tables:

| Error Type | System Response |
|------------|----------------|
| [specific error] | [specific response] |

Include philosophy statement (e.g., "Never lose user work", "Warn but don't block", "Fail loudly on data integrity issues").

#### 10. Success Metrics
**Primary metric** with specific target, measurement method, and evaluation timing. Use real numbers where available (dollar thresholds, time targets, accuracy percentages).

**Secondary metrics** — additional measures that indicate success.

**Lagging indicators** — tracked over time (3-6-12 months) to validate the chunk is delivering sustained value.

Each metric should specify: target value, how it's measured, when it's evaluated, and what action to take if the target is missed.

#### 11. Open Questions
Two categories:

**Blocking** — must answer before build starts. Each has: question, impact if unresolved, owner (who can answer this).

**Non-blocking** — can resolve during implementation. Each has: question, impact, owner, and default assumption if not resolved.

#### 12. Risks and Mitigations
Categorized **High / Medium / Low** based on likelihood x impact.

Each risk has:
- **Likelihood**: High / Medium / Low
- **Impact**: High / Medium / Low
- **Mitigation**: Specific actions (not generic "monitor the situation")
- **Decision Reference**: D-XXX if the risk relates to a specific decision

Ground risks in the actual project — not generic risk boilerplate. "Fund accounting implementation errors create compliance exposure" is specific. "The system might have bugs" is not.

#### 13. Timeline Considerations
- **Hard deadlines** tied to real business events (property closing, fiscal year end, board meeting, filing deadline). Pull from company_facts.md compliance calendar.
- **Dependencies** on other chunks or external parties
- **Suggested phasing** if the chunk has natural P0 -> P1 -> P2 build stages

#### 14. Decision Cross-Reference
Table mapping decision IDs from decisions.md to spec sections:

| Decision ID | Summary | Spec Section |
|-------------|---------|--------------|
| D-XXX | [brief] | [requirement ID] |

Provides traceability: any requirement can be traced back to the rationale in decisions.md.

### Gap-Filling Questions (Pathway A)

After reading all discovery files, identify gaps that the chunk discovery may not have covered — particularly **engineering and technical concerns** that business-focused discovery tends to miss:

- Performance requirements (latency, data volume, concurrent users)
- Data retention and archival policies
- Error recovery and data integrity guarantees
- Testability considerations

Ask these as targeted questions (not the full 20-question process). Skip any already answered in discovery files or decisions.md.

### Output (Pathway A)

One spec file per chunk with complete discovery:
- `1-chunk-name-spec.md`
- `2-chunk-name-spec.md`
- etc.

Generate one spec at a time. Present a summary after each, get approval, then proceed to the next.

After all specs are generated, inform the user:
"All chunk specs are complete. Next step: run `/tech-stack` to make technology decisions and generate the implementation plan. The /plan-phase skill will read all chunk specs to design build phases that cut across chunks."

---

## Ideation Spec Generation (Pathways B and C)

After gathering sufficient information via questioning, generate two documents in the project root:

### requirements.md

Structure:
1. **Introduction** — Project context, organization, what we're building and why (this replaces a separate product.md)
2. **Glossary** — Domain-specific terms with definitions
3. **Requirements** — Numbered requirements, each containing:
   - **Traces to** (if ideation.md exists): Reference assumption IDs (e.g., "A1, A4") that this requirement addresses
   - User story: "As [role], I want [capability], so that [benefit]"
   - Acceptance criteria using "THE System SHALL..." format
   - Number criteria within each requirement (1, 2, 3...)

**Traceability**: When ideation.md exists, every requirement should trace back to at least one assumption. This creates the chain: Assumption -> Requirement -> Test

### design.md

Structure:
1. **Overview** — Restate the problem and solution approach
2. **Key Design Principles** — 3-5 guiding principles derived from requirements
3. **Technology Approach** — Placeholder section noting that `/tech-stack` will populate this
4. **Correctness Properties** — Universal rules derived from requirements that must hold across all valid inputs. Format: "For any [scope], [invariant that must be true]." Each property should reference which requirements it validates.
5. **Business Logic Flows** — Key workflows describing WHAT happens and WHEN (not HOW/UI)
6. **Error Handling Strategy** — How the system handles user errors vs system errors
7. **Testing Strategy** — Approach to unit tests and property-based tests

### Output (Pathways B and C)

Two files in project root:
- `requirements.md`
- `design.md`

---

## Review Process

After generating spec documents (any pathway):
1. Present a summary of what was created
2. Ask if I want to review any document in detail
3. Iterate on feedback until I approve

## Next Step

After approval, inform me to run `/tech-stack` to make technology decisions and generate the implementation plan.

## When to Use
- Starting a brand new project
- User says "kickoff", "start a new project", "initialize project", "new project"
- User says "let's go through the discovery process", "help me think through this project", "I need to scope out a project", "let's define what we're building"
- Have requirements docs or notes that need to be formalized
- **After completing the ideation sequence** (/ideation-start -> /ideation-research -> /ideation-synthesize)
- **After completing chunk-based discovery** (discovery files + decisions.md present)

## When NOT to Use
- Project already has per-chunk specs (N-*-spec.md) or requirements.md + design.md
- Just need to make technology decisions (use `/tech-stack`)
- Ready to start implementing (use `/plan-phase`)
- **Still in ideation phase** — complete /ideation-synthesize first
- **Still in discovery phase** — complete chunk discovery files first
