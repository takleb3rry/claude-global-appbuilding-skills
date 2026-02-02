---
name: ideation-synthesize
description: Generate solution hypotheses and prepare for kickoff - final step in the ideation sequence
argument-hint:
---

# Ideation Synthesis

Generate solution hypotheses, synthesize findings, and prepare for the formal requirements process. This is the final skill in the ideation sequence.

## Prerequisites

- **Web search capability**: This skill researches prior attempts at similar solutions. Ensure you have Brave Search, WebSearch, or equivalent search tools available.
- **Completed /ideation-research**: Requires `ideation.md` with Status = "Research".
- **Write access**: Completes `ideation.md` in the project root.

---

## First Action: Validate Prerequisites

1. **Check for ideation.md** in project root
   - If not found: "This skill requires `/ideation-start` and `/ideation-research` to be completed first. Please start with `/ideation-start`."
   - If found: Read and verify Status field

2. **Check Status**
   - If Status < "Research": "The research phase isn't complete yet. Please run `/ideation-research` first."
   - If Status = "Research": Proceed
   - If Status = "Ready for Kickoff": Ask "Ideation is already complete. Would you like to:"
     - "Proceed to `/kickoff`"
     - "Revise the solution hypotheses (this will update sections 6-8)"

## Context Loading

Read ideation.md and load full context:
- Problem statement and jobs to be done
- User segments with their motivations and barriers
- Competitive landscape and opportunity gaps
- Assumptions log with priority matrix

Summarize: "Based on our discovery and research, we're solving [problem] for [users]. The biggest opportunity gaps are [gaps]. Our highest-risk assumptions are [Test First items]. Let's generate solution hypotheses."

## Phase 1: Solution Hypothesis Generation

### Creative Ideation with SCAMPER

Use SCAMPER prompts to generate diverse solution approaches:

**Substitute**: "What if we replaced [current approach] with something entirely different?"
**Combine**: "What if we combined [solution A] with [solution B]?"
**Adapt**: "What can we borrow from [adjacent domain] and adapt?"
**Modify/Magnify/Minimize**: "What if we made [aspect] much bigger/smaller/different?"
**Put to other use**: "What if the solution served a different purpose than expected?"
**Eliminate**: "What if we eliminated [feature/step] entirely?"
**Reverse/Rearrange**: "What if we did things in the opposite order?"

Walk through at least 3-4 prompts conversationally:
- Present the prompt
- Brainstorm with the user
- Capture ideas that emerge

### Hypothesis Formulation

From the brainstorming, formulate 2-4 distinct solution hypotheses:

For each hypothesis:
- **Name**: Give it a memorable name
- **Description**: What is it? How does it work?
- **Key differentiator**: What makes it different from competitors?
- **Target segment**: Which user segment does it best serve?
- **Validates assumptions**: Which assumptions (A1, A2, etc.) does this approach test?
- **Key risks**: What could go wrong with this approach?

### RESEARCH INTERLUDE: Prior Attempts

For each promising hypothesis:
1. Announce: "Let me search for others who've tried [approach]..."
2. Search for:
   - "[approach/solution type] startup"
   - "[similar product] post-mortem"
   - "[approach] case study"
   - "why [similar product] failed/succeeded"
3. Report: "I found these relevant examples: [summary]"
4. Note lessons learned, pitfalls to avoid, success factors

### Hypothesis Ranking

After exploring all hypotheses, discuss with user:
- "Based on our research and assumptions, I'd recommend [hypothesis] because [reasons]"
- "Here's how I'd rank them: [ranking with brief rationale]"
- Ask: "Does this ranking feel right? Any hypotheses you want to explore further or deprioritize?"

## Phase 2: Final Synthesis

### Open Questions Compilation

Review everything and identify questions that need resolution in /kickoff:

- **Unresolved requirements questions**: Scope, features, constraints not yet decided
- **Technical unknowns**: Architecture, integration, feasibility questions
- **Business model questions**: Pricing, go-to-market, monetization
- **User research gaps**: Things we assumed but should validate with real users

Frame each as a question for the requirements phase.

### Recommendation Summary

Write a clear recommendation:
- Which hypothesis to pursue
- Why this hypothesis (connects to assumptions, gaps, user needs)
- Key risks to monitor
- Critical assumptions to validate early

### Complete Research Log

Ensure all research conducted across all three skills is captured in the Research Log.

## Output: Complete ideation.md

Update sections 6-8 of ideation.md:

```markdown
## 6. Solution Hypotheses

### Hypothesis 1: [Name] (Recommended)
- **Description**: [What it is and how it works]
- **Key Differentiator**: [What makes it unique vs competitors]
- **Target Segment**: [Primary user segment]
- **Validates Assumptions**: [A1, A4, etc.]
- **Key Risks**: [What could go wrong]
- **Prior Art**: [Similar attempts found in research, lessons learned]

### Hypothesis 2: [Name]
- **Description**: [What it is and how it works]
- **Key Differentiator**: [What makes it unique]
- **Target Segment**: [Primary user segment]
- **Validates Assumptions**: [A2, A3, etc.]
- **Key Risks**: [What could go wrong]
- **Prior Art**: [Similar attempts, lessons]

### Hypothesis 3: [Name] (if applicable)
...

### Recommendation
**Pursue Hypothesis 1 ([Name])** because:
- [Reason 1: connects to key opportunity gap]
- [Reason 2: validates highest-risk assumptions]
- [Reason 3: best fit for target users]

Key risks to monitor: [list]
Critical assumptions to validate early: [A1, A4]

## 7. Open Questions for /kickoff

### Requirements Questions
- [ ] [Scope/feature question]
- [ ] [Constraint question]

### Technical Questions
- [ ] [Architecture/feasibility question]
- [ ] [Integration question]

### Business Questions
- [ ] [Pricing/monetization question]
- [ ] [Go-to-market question]

### User Research Gaps
- [ ] [Assumption to validate with users]
- [ ] [Behavior to observe/test]

## 8. Research Log
| Date | Topic | Source | Key Findings |
|------|-------|--------|--------------|
| [date] | Landscape scan | [sources] | [findings] |
| [date] | Pain point validation | [sources] | [findings] |
| [date] | User sentiment | [sources] | [findings] |
| [date] | Competitive analysis | [sources] | [findings] |
| [date] | Market trends | [sources] | [findings] |
| [date] | Assumption validation | [sources] | [findings] |
| [date] | Prior attempts | [sources] | [findings] |
```

Also update:
- Meta.Status → "Ready for Kickoff"
- Meta.Last Updated → today's date
- Increment Meta.Sessions if this is a continuation

## Completion

After completing ideation.md:

1. **Present the recommendation**:
   - "Based on our ideation process, I recommend pursuing [Hypothesis Name]."
   - Brief summary of why

2. **Highlight what's ready**:
   - "Your ideation document captures [N] user segments, [N] assumptions (with [N] high-priority), and [N] solution hypotheses."
   - "The research log documents [N] searches across landscape, competition, users, and prior attempts."

3. **Highlight what's still open**:
   - "There are [N] open questions to resolve during requirements."
   - Call out the most critical ones

4. **Next step**: "You're ready for the formal requirements process. Run `/kickoff ideation.md` to begin. The kickoff will use your ideation work to accelerate the requirements gathering."

5. **Traceability note**: "During kickoff, your assumption IDs (A1, A2, etc.) will be referenced in requirements so you can trace each requirement back to the underlying assumption it addresses."

## When to Use
- After completing /ideation-research
- User says "synthesize", "generate solutions", "ready for kickoff prep"
- Ready to move from research to solution definition

## When NOT to Use
- Research phase not complete - use /ideation-research first
- Just need quick brainstorming - do it conversationally
- Already in formal requirements - continue with /kickoff
