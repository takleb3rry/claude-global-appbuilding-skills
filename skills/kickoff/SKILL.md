---
name: kickoff
description: Initialize a new project by analyzing source documents and generating requirements.md and design.md
argument-hint: [path-to-requirements-doc-or-notes]
---

# Project Kickoff

Analyze the provided source document(s) and guide me through generating foundational project documents.

## First Action: Check for Ideation

**Before reading source documents**, check if `ideation.md` exists in the project root.

**If ideation.md exists and Status = "Ready for Kickoff"**:
1. Read ideation.md thoroughly
2. Announce: "I found your ideation document. I'll use it to accelerate the requirements process."
3. Extract and note:
   - Problem statement and jobs to be done
   - User segments (saves Customer Perspective questions)
   - Competitive landscape (saves Business Perspective questions)
   - Assumptions with IDs (A1, A2, etc.) - these will be referenced in requirements
   - Recommended solution hypothesis
   - Open questions to address
4. Many standard questions can be skipped if answered in ideation
5. Focus questioning on the "Open Questions for /kickoff" section

**If ideation.md doesn't exist or was not used**: Proceed with standard kickoff process below.

## Source Documents

$ARGUMENTS

**First action**: Read the provided document(s) thoroughly. Extract:
- Core problem being solved
- Target users and their needs
- Key features and capabilities
- Constraints (regulatory, technical, budget)
- Success criteria
- Any gaps requiring clarification

## Questioning Process

After analyzing the source docs, ask clarifying questions **one at a time**. Wait for my answer before asking the next question. Adapt based on my responses—skip questions already answered, dig deeper when complexity emerges.

Progress through three perspectives (~20 questions total):

### Business Perspective (~7 questions)
- Organization context and mission
- Who pays for this / who benefits?
- What does success look like in 6 months?
- Budget and timeline constraints
- Who are the key stakeholders and decision-makers?
- What's the competitive landscape—are there alternatives users currently use?
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
- What's the learning curve expectation—should this be intuitive or power-user focused?
- Are there different user segments with different needs?

## Document Generation

After gathering sufficient information, generate two documents in the project root:

### requirements.md

Structure:
1. **Introduction** - Project context, organization, what we're building and why (this replaces a separate product.md)
2. **Glossary** - Domain-specific terms with definitions
3. **Requirements** - Numbered requirements, each containing:
   - **Traces to** (if ideation.md exists): Reference assumption IDs (e.g., "A1, A4") that this requirement addresses
   - User story: "As [role], I want [capability], so that [benefit]"
   - Acceptance criteria using "THE System SHALL..." format
   - Number criteria within each requirement (1, 2, 3...)

**Traceability**: When ideation.md exists, every requirement should trace back to at least one assumption. This creates the chain: Assumption → Requirement → Test

### design.md

Structure:
1. **Overview** - Restate the problem and solution approach
2. **Key Design Principles** - 3-5 guiding principles derived from requirements
3. **Technology Approach** - Placeholder section noting that `/tech-stack` will populate this
4. **Correctness Properties** - Universal rules derived from requirements that must hold across all valid inputs. Format: "For any [scope], [invariant that must be true]." Each property should reference which requirements it validates.
5. **Business Logic Flows** - Key workflows describing WHAT happens and WHEN (not HOW/UI)
6. **Error Handling Strategy** - How the system handles user errors vs system errors
7. **Testing Strategy** - Approach to unit tests and property-based tests

## Review Process

After generating both documents:
1. Present a summary of what was created
2. Ask if I want to review either document in detail
3. Iterate on feedback until I approve both documents

## Output

Two files in project root:
- `requirements.md`
- `design.md`

## Next Step

After approval, inform me to run `/tech-stack` to make technology decisions and generate the implementation plan.

## When to Use
- Starting a brand new project
- User says "kickoff", "start a new project", "initialize project", "new project"
- User says "let's go through the discovery process", "help me think through this project", "I need to scope out a project", "let's define what we're building"
- Have requirements docs or notes that need to be formalized
- **After completing the ideation sequence** (/ideation-start → /ideation-research → /ideation-synthesize)

## When NOT to Use
- Project already has requirements.md and design.md
- Just need to make technology decisions (use `/tech-stack`)
- Ready to start implementing (use `/plan-phase`)
- **Still in ideation phase** - complete /ideation-synthesize first
