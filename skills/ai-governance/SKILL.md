---
name: ai-governance
description: Audit an existing application or guide a new build for AI governance — classifying every function as DETERMINISTIC, AI-ADVISORY, or AI-OPERATIONAL, identifying risk, and recommending hardening. Use when the user asks to "audit AI usage", "check governance", "review where AI is used", "assess AI risk", "governance review", "lock down AI", or when planning a new feature that involves AI and the user wants to understand where AI should vs. shouldn't be used. Also use when the user wants to evaluate whether a component should use AI or deterministic code.
argument-hint: "audit | guide | compare"
---

# AI Governance — Audit & Build Guidance

Evaluate where an application uses AI, where it uses deterministic code, and whether the boundary between them is drawn correctly. Produces actionable findings, not just observations.

---

## Core Framework: Five Execution Layers

Every software function falls into one of five layers. The audit classifies each function and checks whether the implementation matches the layer's requirements.

### Layer 1 — Orchestration
**Question:** What steps execute and in what order?
**Rule:** Must be deterministic code (state machines, cron triggers, routing logic). AI must never decide execution sequence for business-critical paths.
**What to look for:** State machines, workflow engines, cron jobs, routing tables, sequential pipeline steps, event handlers.
**Red flag:** An LLM deciding "what to do next" in a multi-step business process without a deterministic backbone.

### Layer 2 — Action Gating
**Question:** What tools/APIs to call and with what parameters?
**Rule:** If AI proposes an action, a deterministic validator must gate it before execution. Validate: type correctness, range constraints, permission scope, idempotency.
**What to look for:** Tool-use configurations, API call patterns, MCP tool definitions, agent tool access lists, parameter validation on tool inputs.
**Red flag:** AI-proposed tool calls or API requests that execute without structural validation. Especially: write operations gated only by LLM judgment.

### Layer 3 — Output Schema Enforcement
**Question:** What does the output format look like?
**Rule:** Every AI output that feeds downstream logic must be schema-enforced (Pydantic, JSON schema, constrained decoding). Free-text is acceptable only for human-consumed advisory output.
**What to look for:** Pydantic response models, JSON schema validation, structured output configurations, constrained decoding settings.
**Red flag:** AI output parsed with string manipulation or regex instead of schema validation. AI-generated JSON trusted without validation before DB write.

### Layer 4 — Content Correctness
**Question:** Is the output content actually right?
**Rule:** Deterministic calculations must be code. AI handles judgment under ambiguity (synthesis, interpretation, recommendations). Never let AI perform arithmetic, date math, unit conversions, or rule evaluation that could be coded.
**What to look for:** Risk calculations, financial computations, compliance checks, data transformations, aggregations — anything where a wrong answer looks identical to a right answer.
**Red flag:** AI performing calculations that could be deterministic code. Financial totals computed by LLM. Compliance status determined by AI judgment rather than rule evaluation. Any function where incorrect output propagates silently downstream.

### Layer 5 — Post-Execution Audit
**Question:** Did the result violate any business rules?
**Rule:** After AI-generated content is stored or acted upon, deterministic checks should verify invariants. AI-powered audits (semantic consistency checks) are a valuable second layer but must not replace deterministic post-checks.
**What to look for:** Audit tables, append-only logs, post-write validation, invariant checks, reconciliation jobs.
**Red flag:** AI output stored with no post-execution verification. No audit trail on AI-generated artifacts. No mechanism to detect when AI output contradicts the data it was given.

---

## Function Classification Taxonomy

Every function in the system must be classifiable as one of:

| Classification | Definition | Governance Requirement |
|---------------|------------|----------------------|
| **DETERMINISTIC** | Code executes it, every time, identically. No AI involved. | Standard software testing (unit, integration, E2E). |
| **AI-ADVISORY** | AI generates output that a human reviews before acting. | Acceptable risk if human is qualified to evaluate. Audit trail recommended. |
| **AI-OPERATIONAL** | AI generates output that the system or user acts on without full review. | Requires deterministic pre-validation (Layer 2), schema enforcement (Layer 3), and post-execution audit (Layer 5). This is the highest-risk category. |

---

## Mode: AUDIT

When the user asks to audit an existing application:

### Step 1: Explore the Codebase

Use the Explore agent to map:
1. **AI integration points** — Where are LLM API calls made? What models are used? What prompts are sent? What tools does the AI have access to?
2. **Business logic** — Where are calculations, state machines, data pipelines, compliance rules, financial computations?
3. **Validation layers** — Pydantic models, DB constraints, input validation, schema enforcement on AI outputs.
4. **Orchestration** — How is control flow managed? State machines, cron jobs, routers, sequential pipelines.
5. **Audit mechanisms** — Append-only logs, audit tables, post-execution checks, reconciliation jobs.

### Step 2: Classify Every AI Touchpoint

For each place AI is invoked, determine:
- **What classification?** DETERMINISTIC / AI-ADVISORY / AI-OPERATIONAL
- **Which layer?** 1–5
- **Is the boundary drawn correctly?** Should this be AI or code?
- **What validates the AI output?** Schema? Human review? Nothing?

### Step 3: Produce the Audit Report

Output a structured assessment:

```markdown
## AI Governance Audit: [App Name]

### Classification Map
| Component | Classification | Layer | Validated By | Risk |
|-----------|---------------|-------|-------------|------|
| [name]    | AI-OPERATIONAL | 4     | None        | HIGH |
| [name]    | DETERMINISTIC  | 1     | N/A         | LOW  |

### Findings (ordered by risk)

#### FINDING-1: [Title]
- **Component:** [file:line or module]
- **Current classification:** [AI-OPERATIONAL / AI-ADVISORY / DETERMINISTIC]
- **Issue:** [What's wrong with the current boundary]
- **Recommendation:** [Specific fix — e.g., "Add deterministic post-validator that checks X before DB write"]
- **Effort:** [Low / Medium / High]

### Summary
- Total AI touchpoints: N
- DETERMINISTIC: N (should be AI: N, correctly deterministic: N)
- AI-ADVISORY: N (acceptable: N, should be DETERMINISTIC: N)
- AI-OPERATIONAL: N (properly gated: N, ungated: N — these are findings)
```

### Step 4: Prioritize

Rank findings by:
1. **Silent propagation risk** — Can wrong AI output flow downstream without detection? (Highest priority)
2. **Blast radius** — How many downstream systems/decisions depend on this output?
3. **Reversibility** — Can the damage be undone? (Append-only artifacts are lower risk than mutable state)
4. **Frequency** — How often does this function execute? (Daily > quarterly)

---

## Mode: GUIDE

When the user is planning a new feature or application and wants governance guidance:

### Step 1: Understand the Feature

Ask (or determine from context):
1. What does this feature do?
2. What data does it consume and produce?
3. Who or what acts on its output?
4. What happens if the output is wrong?

### Step 2: Recommend Classification

For each component of the feature, recommend:
- **Use DETERMINISTIC when:** The logic can be fully specified as rules. The output must be identical every time. Wrong output propagates silently. Financial calculations, compliance checks, state transitions, data transformations, API integrations with known schemas.
- **Use AI-ADVISORY when:** The task requires judgment, synthesis, or interpretation. A qualified human reviews the output before acting. Narrative summaries, recommendations, analysis, draft communications.
- **Use AI-OPERATIONAL when (minimize this):** The task requires judgment AND the output must be acted on without human review (e.g., real-time classification, auto-routing). Always pair with: deterministic pre-validation + schema enforcement + post-audit.

### Step 3: Define the Governance Requirements

For each AI-OPERATIONAL component, specify:
- What deterministic pre-validator is needed
- What schema enforcement applies
- What post-execution audit checks for
- What the fallback is if the AI fails or produces invalid output

---

## Mode: COMPARE

When the user wants to evaluate whether a specific component should use AI or deterministic code:

Ask these four questions:
1. **Can the logic be fully specified as rules?** If yes → DETERMINISTIC. Don't use AI for things you can code.
2. **Does wrong output look identical to right output?** If yes → DETERMINISTIC (or AI with mandatory post-audit). Silent failures are the most dangerous.
3. **Who acts on this output?** If a human reviews it → AI-ADVISORY is acceptable. If the system acts on it automatically → AI-OPERATIONAL, requires full gating.
4. **What's the cost of being wrong?** If low (draft email, research summary) → AI is fine. If high (financial posting, clinical dosing, compliance filing) → DETERMINISTIC unless the task genuinely requires judgment that can't be coded.

---

## Anti-Patterns to Flag

1. **AI doing math:** LLMs computing totals, averages, percentages, date differences, unit conversions. Always code these.
2. **AI enforcing rules:** LLMs checking compliance, validating business logic, enforcing constraints. Code the rules; use AI to audit whether rules were followed.
3. **AI controlling flow:** LLMs deciding what step comes next in a business process. Use state machines; let AI advise within a step.
4. **Guardrails as governance:** Probabilistic classifiers (content filters, safety checks) treated as deterministic gates. Guardrails reduce risk; they don't eliminate it. For critical paths, use deterministic validation.
5. **Unaudited AI-OPERATIONAL output:** AI generates something the system acts on, and no post-execution check exists to verify correctness. This is the single highest-risk pattern.
6. **Coefficient trust without provenance:** Deterministic models using externally-sourced constants (formulas, rates, thresholds, regulatory values) without a `verified_against` reference. The model is deterministic, but if the constants are wrong, it's deterministically wrong — the most dangerous kind of error because it looks trustworthy every time it runs.

---

## Domain-Neutral Examples

These examples are deliberately drawn from different domains to prevent anchoring on any single application type.

**Financial system:** GL posting engine is DETERMINISTIC. AI copilot that explains GAAP treatment is AI-ADVISORY. An AI agent that auto-categorizes transactions is AI-OPERATIONAL — needs a deterministic validator checking account codes exist and debit/credit balance before posting.

**Auth/identity platform:** Role assignment logic is DETERMINISTIC. An AI summarizing user activity for an admin is AI-ADVISORY. An AI deciding whether to flag a login as suspicious is AI-OPERATIONAL — needs a deterministic threshold check (geo, device, time) with AI as a second signal, not the sole gate.

**Education/exam platform:** Question delivery sequence is DETERMINISTIC. AI evaluating free-text student answers is AI-ADVISORY (teacher reviews). AI auto-scoring that determines pass/fail is AI-OPERATIONAL — needs a deterministic rubric matcher with AI handling edge cases, plus human review on borderline scores.

**Health/clinical platform:** Risk model calculations are DETERMINISTIC. AI persona synthesizing data into narrative advice is AI-ADVISORY (user reads and decides). An AI auto-generating a workout plan that gets executed is AI-OPERATIONAL — needs deterministic validation (volume bounds, safety ceilings, baseline compliance) before the plan is stored.

**Data pipeline:** ETL transformations and schema validation are DETERMINISTIC. AI summarizing pipeline health for an operator is AI-ADVISORY. An AI deciding to retry, skip, or escalate a failed pipeline step is AI-OPERATIONAL — needs deterministic rules for retry limits, skip conditions, and escalation thresholds with AI handling only genuinely ambiguous cases.

---

## Output Format

Always end an audit or guide session with a concrete next-steps list:

```markdown
## Next Steps
1. [ ] [Specific action — e.g., "Add deterministic post-validator for X"]
2. [ ] [Specific action]
3. [ ] [Specific action]

Estimated effort: [Low / Medium / High]
Recommended: `/plan-phase` for items 1-3 → `/execute-phase` to build.
```
