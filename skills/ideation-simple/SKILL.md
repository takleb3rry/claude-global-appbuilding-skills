---
name: ideation-simple
description: Explore a problem space and understand users - the first step in the ideation sequence
argument-hint: "optional: brief description of your idea or problem"
---

# Ideation Simple

Transform a hunch into a well-understood problem with clear user personas. This is the first skill in the ideation sequence.

## Prerequisites

- **Web search capability**: This skill uses web search to validate ideas against market reality. Ensure you have Brave Search, WebSearch, or equivalent search tools available.
- **Write access**: Creates `ideation.md` in the project root.

---

## First Action: Check for Existing Ideation

Check if `ideation.md` exists in the project root.

**If it exists**, ask the user:
- "I found an existing ideation document. Would you like to:"
  - "Continue where we left off"
  - "Start fresh (this will replace the existing document)"

**If starting fresh or no file exists**, proceed with intake.

## Entry Point Detection

The user may come with different starting points. Detect which type:

1. **Problem observed**: They describe a pain point or frustration
   - Example: "I'm frustrated with how I track my time at work"
   - Proceed directly to problem exploration

2. **Solution idea**: They describe something they want to build
   - Example: "I want to build a timesheet app"
   - IMPORTANT: Backtrack to the underlying problem first
   - Ask: "Interesting! Before we dive into the solution, help me understand—what problem does this solve? What's frustrating about the current state?"

3. **Market opportunity**: They describe a gap or trend
   - Example: "Remote work teams need better tools"
   - Explore who specifically has this need and what pain they experience

## Phase 1: Intake & Problem Understanding

**Opening question** (adapt based on $ARGUMENTS if provided):
- "Tell me about what you're thinking about building—what's the spark?"

After the user shares their initial idea, identify the entry type and ensure we have a problem statement, not just a solution. Ask adaptively — if the user is forthcoming, fewer questions are needed. Dig deeper only when the picture is unclear. Goal: understand what job someone is trying to get done, how they solve it today, and what's frustrating about that.

### RESEARCH INTERLUDE: Landscape Scan

Once you have a clear sense of the basic problem:
1. Announce: "Let me do a quick landscape scan to see what exists in this space..."
2. Search for:
   - "[problem domain] solutions"
   - "competitors for [problem description]"
3. Synthesize findings: "Here's what I found: [summary]. This gives us context for where your idea fits."
4. Note whether this validates the opportunity or reveals a crowded market.

## Phase 2: User Understanding (BJ Fogg)

Understand who experiences this problem most and what would drive them to act. Ask adaptively — you're trying to understand:

- **Who** experiences this problem most acutely, and whether there are meaningfully different user types
- **Motivation**: What's the promise of a better solution? Why would they want it?
- **Ability barriers**: What friction might stop them from switching even if they're frustrated?
- **Potential prompts**: What event or moment might trigger them to seek a solution?

Don't ask all of these as a list. Surface them through natural conversation, following where the user leads.

## Stopping Criteria

Before writing ideation.md, confirm you have:
- [ ] A clear problem statement (not just a solution idea)
- [ ] At least one user segment with enough context to describe them
- [ ] A rough sense of current alternatives

If any of these are missing, ask one more targeted question to fill the gap before proceeding.

## Output: Create/Update ideation.md

After the conversation has enough depth, create or update `ideation.md` in the project root with sections 1-3:

```markdown
# Ideation: [Project Name - derive from conversation]

## Meta
- Status: Simple
- Last Updated: [today's date]
- Sessions: 1

## 1. Origin
- **Entry Type**: [Problem | Solution | Opportunity]
- **Initial Statement**: [verbatim what user first said]
- **Refined Problem Statement**: [clear problem statement after exploration]

## 2. Jobs to be Done
- **Primary Job**: [the main job users are hiring a product to do]
- **Related Jobs**: [adjacent jobs that might be addressed]
- **Current Alternatives**: [how users solve this today - list with notes]
- **Switching Triggers**: [what would make them try something new]

## 3. User Segments

### Segment 1: [Name based on role/context]
- **Context**: [when/where they experience the problem]
- **Motivation**: [why they'd want a solution - the promise]
- **Ability Barriers**: [what might stop them - friction points]
- **Potential Prompts**: [what triggers action - moments of need]

### Segment 2: [If identified]
- **Context**: ...
- **Motivation**: ...
- **Ability Barriers**: ...
- **Potential Prompts**: ...

## 4. Market Landscape
[To be completed by /ideation-research]

## 5. Assumptions Log
[To be completed by /ideation-research]

## 6. Solution Hypotheses
[To be completed by /ideation-synthesize]

## 7. Open Questions for /kickoff
[To be completed by /ideation-synthesize]

## 8. Research Log
| Date | Topic | Source | Key Findings |
|------|-------|--------|--------------|
| [date] | Landscape scan | [sources] | [findings] |
```

## Completion

After generating ideation.md:

1. **Present summary**: "Here's what we've discovered about the problem and users: [brief summary]"

2. **Highlight key insights**: Call out the most important findings from the landscape scan

3. **Next step**: "The simple phase is complete. When you're ready, run `/ideation-research` to dive deep into the competitive landscape and map out our assumptions."

## When to Use
- Starting ideation on a new idea
- User says "I have an idea", "let's ideate", "help me think through this"
- User describes a problem, solution idea, or market opportunity

## When NOT to Use
- Ideation simple already complete (Status ≥ "Simple") - use /ideation-research
- Already have formal requirements - use /kickoff directly
