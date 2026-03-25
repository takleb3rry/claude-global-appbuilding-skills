---
name: verify
description: Lightweight verification gate — prove a claim before making it. Use when finishing ad-hoc work, one-off fixes, or any time you're about to say "done" or "fixed" outside of /execute-phase. Trigger on "verify this works", "prove it", "check your work", "does this actually work". Also referenced inline by /diagnose (Phase 4) and /execute-phase (completion criteria) as an embedded methodology.
---

# Verify

Prove it works. Then say it works. Never the other way around.

---

## The Checklist

### 1. IDENTIFY
What command(s) would prove the claim you're about to make? Name them explicitly.
- Test suite: `npm test`, `pytest`, `vitest run [file]`
- Build: `npx tsc --noEmit`, `npm run build`
- Specific behavior: `curl`, browser check, database query
- If you can't name a command that proves it, you can't claim it.

### 2. RUN
Execute the command(s). No dry runs. No "I would run." Actually run it.

### 3. READ
Read the full output. Don't skim. Don't stop at the first green line. Look for:
- Partial failures buried in passing output
- Warnings that indicate the test isn't testing what you think
- Skipped tests that cover the relevant behavior

### 4. CHECK
Does the output confirm the claim?
- **Yes:** State the claim with the evidence. "Fixed — `vitest run src/auth` passes 12/12 tests including the new regression test."
- **No:** Do not restate the claim with caveats. Investigate. Return to the work.

---

## Language Rules

| Instead of... | Use... |
|---|---|
| "Should work now" | [run the command, show the output] |
| "I believe this resolves it" | [run the test, cite the result] |
| "That should be fine" | [verify it, state what you verified] |
| "This probably fixes it" | [prove it fixes it] |
| "Done!" (before evidence) | [show evidence, then state completion] |

If you can't point to command output that proves the claim, the claim isn't ready.
