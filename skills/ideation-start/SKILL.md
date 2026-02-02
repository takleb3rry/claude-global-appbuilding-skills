---
name: ideation-start
description: Explore a problem space and understand users - the first step in the ideation sequence
argument-hint: [optional: brief description of your idea or problem]
---

# Ideation Start

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

## Phase 1: Intake & Orientation

**Opening question** (adapt based on $ARGUMENTS if provided):
- "Tell me about what you're thinking about building—what's the spark?"

After the user shares their initial idea, identify the entry type and ensure we have a problem statement, not just a solution.

### RESEARCH INTERLUDE: Initial Landscape Scan

After understanding the basic idea:
1. Announce: "Let me do a quick landscape scan to see what exists in this space..."
2. Search for:
   - "[problem domain] solutions 2025"
   - "competitors for [problem description]"
   - "[industry/domain] tools software"
3. Synthesize findings: "Here's what I found in this space: [summary]. This gives us context for where your idea fits."
4. Connect: Note whether this validates the opportunity or reveals crowded market

## Phase 2: Problem Exploration (Jobs-to-be-Done)

Ask questions to deeply understand the problem. Adapt based on responses—skip questions already answered, dig deeper when complexity emerges.

**Core questions** (~5-7):
- "What job is someone trying to get done when they hit this problem?"
- "Walk me through a day in the life of someone experiencing this problem."
- "How do they solve this problem today? What workarounds do they use?"
- "What's frustrating about the current solutions or workarounds?"
- "When does this problem hurt the most? What triggers the pain?"
- "What happens if they don't solve this problem? What's at stake?"

### RESEARCH INTERLUDE: Pain Point Validation

When the user describes current workarounds or solutions:
1. Announce: "Let me search for what people are saying about [current solution/workaround]..."
2. Search for:
   - "[workaround/tool] reviews complaints"
   - "[problem domain] frustrations reddit"
   - "[tool name] alternatives why switch"
3. Synthesize: "People are talking about this. Here's what they say: [key complaints/wishes]"
4. Connect: "This [confirms/challenges/adds to] what you described..."

## Phase 3: User Understanding (BJ Fogg + Personas)

Understand who experiences this problem and what would drive them to act.

**Core questions** (~4-6):
- "Who experiences this problem most acutely? Paint a picture of them."
- "Are there different types of users who have this problem? How do they differ?"
- "What would motivate someone to try a new solution? (What's the promise?)"
- "What might stop them from switching even if they're frustrated? (Ability barriers)"
- "What event or moment might trigger them to seek a solution? (The prompt)"

### RESEARCH INTERLUDE: User Sentiment Research

When identifying target users:
1. Announce: "Let me search for how [user type] talk about their challenges..."
2. Search for:
   - "[user type] workflow challenges"
   - "[user type] [domain] problems reddit"
   - "[job title/role] daily frustrations"
3. Synthesize: "Here's what [user type] are saying about their work/challenges: [insights]"
4. Connect: Enrich the persona understanding with real voices

## Output: Create/Update ideation.md

After completing the three phases, create or update `ideation.md` in the project root with sections 1-3:

```markdown
# Ideation: [Project Name - derive from conversation]

## Meta
- Status: Start
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
| [date] | Pain point validation | [sources] | [findings] |
| [date] | User sentiment | [sources] | [findings] |
```

## Completion

After generating ideation.md:

1. **Present summary**: "Here's what we've discovered about the problem and users: [brief summary]"

2. **Highlight key insights**: Call out the most important findings from research

3. **Next step**: "The start phase is complete. When you're ready, run `/ideation-research` to dive deep into the competitive landscape and map out our assumptions."

## When to Use
- Starting ideation on a new idea
- User says "I have an idea", "let's ideate", "help me think through this"
- User describes a problem, solution idea, or market opportunity

## When NOT to Use
- Ideation start already complete (Status ≥ "Start") - use /ideation-research
- Already have formal requirements - use /kickoff directly
