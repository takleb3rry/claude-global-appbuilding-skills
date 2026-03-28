# Claude Global App-Building Skills

A structured workflow for building full-stack applications with Claude Code—designed for non-developers who want to build professional-grade apps methodically.

## What This Is

This is a collection of 15 Claude Code skills that guide you from initial idea through deployed, tested application. The workflow covers ideation, requirements, technology decisions, phased implementation with test-driven development and adversarial code review, AI governance, and comprehensive testing. It's intentionally methodical—if you're an experienced developer, you may find it slow. But if you're building apps without deep coding experience, this structure keeps you in control of what's being built and why.

## Who It's For

- **Non-developers** who want to build real applications
- **Solo founders** validating product ideas
- **Domain experts** who know their problem space but not software engineering
- **Anyone** who values understanding over speed

## The Workflow

```
IDEATION PHASE (choose one path)
  Simple path:
    /ideation-simple     -> Transform a hunch into a well-understood problem
    /ideation-research   -> Deep market research and assumption mapping
    /ideation-synthesize -> Generate solution hypotheses, prepare for kickoff

  Complex path (3+ business domains):
    /ideation-complex    -> Chunk-based discovery, produces files for /kickoff Pathway A

REQUIREMENTS PHASE
  /kickoff             -> Generate requirements.md, design.md, or per-chunk specs
  /tech-stack          -> Collaborative technology decisions

BUILD PHASE (repeat for each phase)
  /plan-phase N        -> Detailed plan for implementation phase N
  /execute-phase N     -> Execute with TDD, 4-layer evaluation, and adversarial review
  /commit-phase N      -> Git workflow: branch, commit, merge (staging-aware)

QUALITY PHASE
  /harmonize           -> Check naming conventions, add test selectors
  /comprehensive-test  -> Full E2E testing with dual frameworks
  /ai-governance       -> Audit AI integration points, classify risk

DISCIPLINE SKILLS (available any time)
  /diagnose            -> Systematic 4-phase root cause analysis
  /verify              -> Prove it works before claiming it works
```

## What You Get

- **Structured ideation**: Front-load discussions around requirements, market research, and concept validation
- **Test-driven development**: Failing tests before implementation, not after
- **Adversarial review**: Independent subagent reviews code with explicit instructions to distrust the implementer
- **Traceability**: Every requirement traces back to an assumption; every test traces to a requirement
- **Phase-by-phase progress**: Clear checkpoints so you always know where you are
- **Quality gates**: Naming conventions checked before commits, comprehensive testing before deployment
- **AI governance**: Classify every AI integration as deterministic, advisory, or operational

## What's New in v1.3.0

**3 new skills:**
- **`/diagnose`** — Systematic 4-phase root cause analysis (investigate -> pattern analysis -> hypothesis testing -> fix). Includes a hard gate: after 3 failed fix attempts, stops and escalates instead of guessing. 10-entry anti-rationalization table prevents shortcutting.
- **`/verify`** — Lightweight verification gate (IDENTIFY -> RUN -> READ -> CHECK). Bans hedging phrases like "should work" — forces evidence before claims. Referenced by `/diagnose` and `/execute-phase` as an embedded methodology.
- **`/ai-governance`** — Audit AI integration points across a codebase. Classifies every function as DETERMINISTIC, AI-ADVISORY, or AI-OPERATIONAL. Flags anti-patterns (AI doing math, AI enforcing rules, unaudited AI-OPERATIONAL output).

**Major `/execute-phase` upgrades:**
- **Layer 0 (Test-First)**: Write failing tests from acceptance criteria BEFORE implementing. Skippable for structural tasks.
- **Layer 4 (Adversarial Review)**: Dispatches independent subagent reviewer that explicitly distrusts the implementer's self-assessment. Max 2 review loops before escalating to user.
- **Verification language rules**: Bans "should work now", "probably fixes it" — requires command output evidence for every completion claim.
- **Anti-rationalization table**: 5 pre-computed counter-arguments for common process-skipping excuses.

**Anti-rationalization tables added to:**
- `/plan-phase` (4 entries — planning shortcuts)
- `/commit-phase` (3 entries — commit shortcuts)

### Acknowledgments

The v1.3.0 discipline upgrades (TDD enforcement, adversarial review, systematic debugging, verification gates, and anti-rationalization tables) were inspired by the [Superpowers](https://github.com/obra/superpowers) project by Jesse Vincent. Superpowers takes a different approach — a full agentic skills framework with session-start enforcement hooks, subagent-driven development, and persuasion-research-backed compliance techniques. We studied its architecture and cherry-picked the techniques that best fit a solo non-developer workflow. If you want a more opinionated, all-in-one framework, check it out.

## Built With These Skills

Everything below was built by a non-developer using this skill set and Claude Code.

### Renewal Initiatives (501(c)(3) nonprofit)
- **[Financial System](https://github.com/renewal-initiatives-inc/financial-system)** — Full double-entry fund accounting system replacing QuickBooks. Plaid bank feeds, Ramp integration, vendor management, 1099s, grant tracking, IRS 990 compliance.
- **[Proposal Rodeo](https://github.com/renewal-initiatives-inc/proposal-rodeo)** — AI-powered grant proposal writing platform. RFP intake, compliance matrix, 5-stage draft pipeline, Red Team review, DOCX export.
- **[Renewal Timesheets](https://github.com/renewal-initiatives-inc/renewal-timesheets)** — Compliance-first youth worker timesheet system enforcing child labor laws across multiple age bands.
- **[Expense Reports](https://github.com/renewal-initiatives-inc/expense-reports-homegrown)** — Expense management with Zitadel SSO and QuickBooks integration.
- **[App Portal](https://github.com/renewal-initiatives-inc/app-portal)** — Internal application portal with unified Zitadel authentication across all org apps.

### Municipal SaaS
- **Plow HQ Website** *(private)* — Public website for a municipal plow management tool enabling New England towns to communicate with, monitor, and plan winter operations with independent plow contractors.
- **Time Well Spent** *(private)* — Timesheet application for Massachusetts agricultural youth employment programs, incorporating complex youth employment conditions, reporting requirements, and work-time limitations.

### Developer Tooling
- **[Zitadel MCP](https://github.com/takleb3rry/zitadel-mcp)** — MCP server for Zitadel identity management — manage users, projects, apps, roles, and service accounts from AI tools.

## Installation

See [INSTALLATION.md](INSTALLATION.md) for setup instructions.

## Quick Start

1. Install the skills (see INSTALLATION.md)
2. Create a new project directory
3. Run `/ideation-simple` (or `/ideation-complex` for large projects) with your idea
4. Follow the workflow through each phase

## Skill Reference

| Skill | Purpose |
|-------|---------|
| `/ideation-simple` | Explore problem space, understand users, create initial ideation.md (simple projects) |
| `/ideation-complex` | Chunk-based business domain discovery for complex projects (3+ domains) |
| `/ideation-research` | Competitive analysis, assumption mapping, market validation |
| `/ideation-synthesize` | Generate solution hypotheses using SCAMPER, prepare for kickoff |
| `/kickoff` | Structured discovery -> requirements.md + design.md, or per-chunk specs from discovery files |
| `/tech-stack` | Guided technology decisions with tradeoff explanations |
| `/plan-phase N` | Detailed execution plan for phase N with anti-rationalization guards |
| `/execute-phase N` | TDD-first implementation with 5-layer evaluation (test-first + tests + UI + acceptance + adversarial review) |
| `/commit-phase N` | Git workflow with convention/DB checks and anti-rationalization guards |
| `/harmonize` | Scan for convention violations, add test selectors |
| `/comprehensive-test` | Dual E2E frameworks (Playwright + Cypress), MSW integration tests |
| `/ai-governance` | Audit, guide, or compare AI integration points for risk and correctness |
| `/diagnose` | 4-phase systematic debugging with 3-fix escalation gate |
| `/verify` | Lightweight verification gate — prove claims with evidence before making them |

## Prerequisites

- **Claude Code** (the CLI tool from Anthropic)
- **Web search capability** (Brave Search or equivalent) for ideation skills
- **Git** for version control
- **Node.js** for most web projects

## My Experience

I built these skills because I'm not a developer, but I wanted to build professional applications. The structured approach adds some ceremony, but every time I've used it, the ideation phase greatly improved my concept before I started building. The plan->execute->commit cycle keeps me in touch with what's being built—even when the code itself is beyond my understanding.

The tedium is the price of legibility. And for a non-coder, legibility is everything.

## License

MIT License - see [LICENSE](LICENSE)

## Author

Created by [@takleb3rry](https://github.com/takleb3rry)
