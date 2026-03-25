---
name: diagnose
description: Systematic root cause analysis for bugs and failures. Use when something is broken, failing, or behaving unexpectedly — not for quick typos or obvious one-line fixes. Trigger on "diagnose this", "root cause", "why is this broken", "this isn't working", "investigate this error", "what's causing this", "trace this issue". Also use when /execute-phase Layer 1 or Layer 2 fails twice on the same task.
---

# Diagnose

Find the root cause. Fix the root cause. Prove the fix works. Do not guess.

---

## Phase 1: Root Cause Investigation

Complete this phase before forming any hypothesis. No fixes, no theories — only evidence.

1. **Read the error completely.** Full stack trace, full log output. Don't skim. Don't stop at the first line that looks relevant.

2. **Reproduce consistently.** Run the failing command or scenario. If it doesn't fail reliably, you don't understand the trigger yet — vary inputs until you find the pattern.

3. **Check recent changes.** Run `git diff` and `git log --oneline -10`. Correlate the failure with what changed. If the failure started after a specific commit, that's your search space.

4. **Trace backward through the call chain.** Start at the error location and trace the data flow backward, level by level. Write it down explicitly:

```
Level 1: Error at [file:line] — [what failed]
Level 2: Called by [file:line] — [what it passed]
Level 3: Data came from [file:line] — [how it was constructed]
Level 4: That value originated at [file:line] — [source: DB query / API call / user input / config]
Level 5: Root input — [the actual source of the bad state]
```

Adapt depth to the problem. Stop when you reach the source of the incorrect state.

5. **For multi-component systems** (frontend + API + database, or service-to-service): Add diagnostic logging at every component boundary BEFORE analyzing. Run the failing scenario once with instrumentation. Collect evidence from all boundaries. THEN analyze. Don't assume which component is at fault.

**Phase 1 is complete when:** You can state where the incorrect state originates and how it propagates to the error site. If you can't, keep investigating.

---

## Phase 2: Pattern Analysis

1. **Find working examples.** Search the codebase for similar code that works correctly. Same pattern, different module. Same API, different caller.

2. **Diff working vs. broken.** List every difference — imports, argument order, types, middleware, configuration, environment. Don't assume any difference is irrelevant.

3. **Check documentation.** If the failure involves a library, framework, or external API, read the relevant docs. Don't rely on memory of how it works.

**Phase 2 is complete when:** You have a concrete comparison between working and broken code, with differences enumerated.

---

## Phase 3: Hypothesis and Testing

1. **Form one specific hypothesis.** State it explicitly: "I think [X] because [Y]." Not "it might be" — commit to a specific, testable claim.

2. **Test with the smallest possible change.** One variable at a time. If the hypothesis involves two potential causes, isolate and test each separately.

3. **If the hypothesis is wrong:** Discard it cleanly. Form a NEW hypothesis from the evidence. Do not stack a second fix on top of a failed first fix — revert the failed attempt, then try the new approach from a clean state.

4. **Track your attempts.** Mentally note: Attempt 1 — [hypothesis] — [result]. Attempt 2 — [hypothesis] — [result]. This prevents re-trying the same thing.

**Phase 3 is complete when:** You have a confirmed hypothesis — a change that makes the failure disappear, and you understand WHY it works.

### Hard Gate: 3-Fix Limit

If three fix attempts have failed, **STOP.** Do not attempt fix #4. Instead:

> "I've tried three approaches and none resolved the root cause:
>
> 1. [Attempt 1] — [why it failed]
> 2. [Attempt 2] — [why it failed]
> 3. [Attempt 3] — [why it failed]
>
> This suggests the issue may be architectural rather than a local bug. Here's what I think is actually going on: [assessment].
>
> Options:
> 1. [Different architectural approach]
> 2. [Workaround with tradeoffs stated]
> 3. [More investigation in a specific direction]
>
> Which direction do you want to take?"

---

## Phase 4: Implementation

1. **Write a failing test first.** Create a test that reproduces the bug — it should fail with the current code and pass after the fix. This proves the fix actually addresses the problem and prevents regression.

2. **Implement the fix.** Target the root cause identified in Phase 3. One fix, one cause. If you find yourself fixing multiple things, you haven't isolated the root cause.

3. **Run the full relevant test suite.** Not just the new test — run related tests to verify no regressions.

4. **Verify with the `/verify` checklist.** Before declaring the bug fixed:
   - IDENTIFY: What command proves the fix works? (the test suite, the original failing scenario, a specific curl/request)
   - RUN: Execute it
   - READ: Read the full output
   - CHECK: Does it confirm the fix? State the evidence. If not, return to Phase 3.

   Do not say "fixed" without this evidence.

---

## Anti-Rationalization Table

If you catch yourself thinking any of these, stop and follow the counter-action.

| If you're thinking... | Do this instead |
|---|---|
| "It's probably just X" | "Probably" means you haven't traced it. Complete Phase 1 before theorizing. |
| "Let me just try this quick fix" | Quick fixes without diagnosis create new bugs. Trace first, fix second. |
| "I already know what's wrong" | Then the 5-level trace will take 30 seconds. Do it anyway. Your confidence is not evidence. |
| "This worked before, it must be something else" | Check `git diff`. "Worked before" means something changed. Find what. |
| "I'll add some error handling to be safe" | Error handling is not a fix. It's a mask. Find why the error happens, don't catch and suppress it. |
| "The error message is misleading" | Maybe. But trace through the code to confirm. Don't dismiss the error — disprove it with evidence. |
| "This is a framework/library bug" | Possible but unlikely. Verify by reproducing outside your code first. 95% of the time, it's your code. |
| "I need to refactor this whole thing" | Not during diagnosis. Fix the bug first. Refactoring is a separate task. |
| "Let me restart from scratch on this part" | Rewriting masks the bug instead of understanding it. The bug will likely reappear in the rewrite. Diagnose first. |
| "This is too complex to trace" | Break it into smaller segments. Trace one component boundary at a time. Complexity is not an excuse to guess. |

---

## When to Use

- Something is broken, failing, or behaving unexpectedly
- `/execute-phase` Layer 1 or Layer 2 has failed twice on the same task
- User says "diagnose", "root cause", "why is this broken", "trace this"
- A test passes locally but fails in CI (environment-dependent bug)
- A feature works in isolation but fails when integrated

## When NOT to Use

- Obvious one-line fix (typo, missing import, wrong variable name) — just fix it
- The problem is "I don't know how to build X" — that's design, not debugging
- Performance optimization — different methodology
- The bundled `/debug` skill is available for quick, informal debugging sessions where the full 4-phase process is overkill
