---
name: ideation-research
description: Deep market research and assumption mapping - second step in the ideation sequence
argument-hint:
---

# Ideation Research

Conduct comprehensive market research and map assumptions. This is the second skill in the ideation sequence.

## Prerequisites

- **Web search capability**: This skill conducts extensive market research. Ensure you have Brave Search, WebSearch, or equivalent search tools available.
- **Completed /ideation-start**: Requires `ideation.md` with Status = "Start".
- **Write access**: Updates `ideation.md` in the project root.

---

## First Action: Validate Prerequisites

1. **Check for ideation.md** in project root
   - If not found: "This skill requires `/ideation-start` to be completed first. Please run `/ideation-start` to begin the ideation process."
   - If found: Read and verify Status field

2. **Check Status**
   - If Status < "Start": "The discovery phase isn't complete yet. Please finish `/ideation-start` first."
   - If Status = "Start": Proceed
   - If Status ≥ "Research": Ask "The research phase was already completed. Would you like to:"
     - "Continue to `/ideation-synthesize`"
     - "Redo the research phase (this will overwrite sections 4-5)"

## Context Loading

Read ideation.md and load context:
- Project name
- Refined problem statement
- Primary job to be done
- Current alternatives
- User segments identified

Summarize: "Based on the discovery phase, we're exploring [problem] for [user segments]. They currently [current alternatives]. Let me research the competitive landscape and help us map our assumptions."

## Phase 1: Market & Competitive Research

### RESEARCH INTERLUDE: Comprehensive Competitive Analysis

This is a research-heavy phase. Announce and execute multiple searches:

1. **Direct Competitors**
   - Announce: "Let me search for direct competitors—products solving this exact problem..."
   - Search for:
     - "[problem domain] software tools 2025"
     - "[problem] app product"
     - "best [solution type] tools"
     - Site-specific: "site:producthunt.com [problem domain]"
     - Site-specific: "site:g2.com [solution type]"
   - For each competitor found, note: name, what they do, apparent strengths/weaknesses

2. **Indirect Competitors**
   - Announce: "Now searching for indirect competitors—adjacent solutions people use..."
   - Search for:
     - "[current workaround] alternatives"
     - "how [user type] [solve problem]"
     - "[related tool category]"
   - Note what jobs these serve and gaps they leave

3. **Market Signals**
   - Announce: "Let me look at market trends and signals..."
   - Search for:
     - "[domain] market trends 2025"
     - "[domain] startup funding"
     - "[domain] industry growth"
   - Note trends, funding activity, growth indicators

4. **Pricing & Business Models**
   - For key competitors identified, search for:
     - "[competitor name] pricing"
     - "[competitor name] vs alternatives"
   - Note pricing tiers, business models

### User Interaction: Competitive Review

After research, present findings:
- "I found [N] direct competitors and [N] indirect alternatives. Here's the landscape: [summary table]"
- Ask: "Did I miss any competitors you're aware of? Any surprises in this list?"
- Incorporate user feedback

### Gap Analysis

Based on research, identify:
- "Here's where existing solutions fall short: [opportunity gaps]"
- Connect gaps to the problem/users from discovery phase

## Phase 2: Assumption Mapping

Extract and categorize all assumptions from the ideation so far.

### Assumption Extraction

Review the conversation and ideation.md to identify implicit assumptions:

**Problem assumptions**: Assumptions about the problem's nature, severity, frequency
- Example: "Users find X frustrating enough to pay for a solution"

**User assumptions**: Assumptions about who users are and how they behave
- Example: "The primary users are [role] who work in [context]"

**Solution assumptions**: Assumptions about what would solve the problem
- Example: "A simpler interface would address the main pain point"

**Market assumptions**: Assumptions about market dynamics
- Example: "The market is growing / underserved / ready for disruption"

### Assumption Rating

For each assumption, rate on two dimensions:

**Importance**: How critical is this to the idea's success?
- High: If wrong, the idea fundamentally doesn't work
- Medium: If wrong, we'd need to pivot significantly
- Low: If wrong, we'd adjust but core idea survives

**Confidence**: How certain are we this is true?
- High: Strong evidence or widely accepted
- Medium: Some evidence but not definitive
- Low: Gut feeling or untested belief

### RESEARCH INTERLUDE: Assumption Validation

For each High Importance / Low Confidence assumption:
1. Announce: "Let me search for evidence about [assumption]..."
2. Search for relevant data, statistics, or perspectives
3. Report: "For this assumption, I found [evidence/counter-evidence]"
4. Adjust confidence rating based on findings

### Assign IDs and Create Priority Matrix

Assign sequential IDs: A1, A2, A3...

Categorize into priority matrix:
- **Test First** (High Importance, Low Confidence): These are existential risks
- **Monitor** (High Importance, High Confidence): Critical but we're confident
- **Validate Later** (Lower priority): Nice to confirm but not urgent

## Output: Update ideation.md

Update sections 4-5 of ideation.md:

```markdown
## 4. Market Landscape

### Direct Competitors
| Competitor | What They Do | Strengths | Weaknesses | Pricing |
|------------|--------------|-----------|------------|---------|
| [Name] | [Description] | [Strengths] | [Weaknesses] | [Pricing model] |
| ... | ... | ... | ... | ... |

### Indirect Competitors
| Solution | How it's used for this job | Gap it leaves |
|----------|---------------------------|---------------|
| [Name/Type] | [Usage] | [Gap] |
| ... | ... | ... |

### Market Signals
- [Trend 1 with source]
- [Trend 2 with source]
- [Funding/growth indicators]

### Opportunity Gaps
- [Gap 1: Description and why it matters]
- [Gap 2: Description and why it matters]

## 5. Assumptions Log

| ID | Assumption | Category | Importance | Confidence | Evidence | Validation Strategy |
|----|------------|----------|------------|------------|----------|---------------------|
| A1 | [Assumption text] | Problem | High | Low | [What we found] | [How to validate] |
| A2 | [Assumption text] | User | High | Medium | [What we found] | [How to validate] |
| A3 | [Assumption text] | Market | Medium | High | [What we found] | [How to validate] |
| A4 | [Assumption text] | Solution | High | Low | [What we found] | [How to validate] |
| ... | ... | ... | ... | ... | ... | ... |

### Priority Matrix
- **Test First** (High Importance, Low Confidence): [A1, A4, ...]
- **Monitor** (High Importance, High Confidence): [A3, ...]
- **Validate Later** (Lower priority): [A2, ...]
```

Also update:
- Meta.Status → "Research"
- Meta.Last Updated → today's date
- Research Log → add entries for all searches conducted

## Completion

After updating ideation.md:

1. **Present summary**:
   - "I've mapped the competitive landscape and identified [N] key assumptions."
   - "The highest-risk assumptions are: [list Test First items]"

2. **Highlight key findings**:
   - Most notable competitor insights
   - Biggest opportunity gaps
   - Most concerning assumptions

3. **Next step**: "The research phase is complete. When you're ready, run `/ideation-synthesize` to generate solution hypotheses and prepare for kickoff."

## When to Use
- After completing /ideation-start
- User says "research the market", "map assumptions", "competitive analysis"
- Ready to move from problem understanding to solution thinking

## When NOT to Use
- Discovery phase not complete - use /ideation-start first
- Already have formal requirements - use /kickoff directly
- Just need a quick competitive scan - do it conversationally
