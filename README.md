# Claude Global App-Building Skills

A structured workflow for building full-stack applications with Claude Code—designed for non-developers who want to build professional-grade apps methodically.

## What This Is

This is a collection of 11 Claude Code skills that guide you from initial idea through deployed, tested application. The ideation phase now supports both a simple conversational path and a structured chunk-based discovery path for complex projects. The workflow is intentionally methodical—if you're an experienced developer, you may find it slow. But if you're building apps without deep coding experience, this structure keeps you in control of what's being built and why.

## Who It's For

- **Non-developers** who want to build real applications
- **Solo founders** validating product ideas
- **Domain experts** who know their problem space but not software engineering
- **Anyone** who values understanding over speed

## The Workflow

```
IDEATION PHASE (choose one path)
  Simple path:
    /ideation-simple     → Transform a hunch into a well-understood problem
    /ideation-research   → Deep market research and assumption mapping
    /ideation-synthesize → Generate solution hypotheses, prepare for kickoff

  Complex path (3+ business domains):
    /ideation-complex    → Chunk-based discovery, produces files for /kickoff Pathway A

REQUIREMENTS PHASE
  /kickoff             → Generate requirements.md, design.md, or per-chunk specs
  /tech-stack          → Collaborative technology decisions

BUILD PHASE (repeat for each phase)
  /plan-phase N        → Detailed plan for implementation phase N
  /execute-phase N     → Execute the plan with 3-layer evaluation per task
  /commit-phase N      → Git workflow: branch, commit, merge (staging-aware)

QUALITY PHASE
  /harmonize           → Check naming conventions, add test selectors
  /comprehensive-test  → Full E2E testing with dual frameworks
```

## What You Get

- **14 months → 4-6 hours**: Build professional apps in a fraction of the time
- **Structured ideation**: Front-load discussions around requirements, market research, and concept validation
- **Traceability**: Every requirement traces back to an assumption; every test traces to a requirement
- **Phase-by-phase progress**: Clear checkpoints so you always know where you are
- **Quality gates**: Naming conventions checked before commits, comprehensive testing before deployment

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
| `/kickoff` | Structured discovery → requirements.md + design.md, or per-chunk specs from discovery files |
| `/tech-stack` | Guided technology decisions with tradeoff explanations |
| `/plan-phase N` | Detailed execution plan for phase N |
| `/execute-phase N` | Step-by-step implementation with 3-layer evaluation (tests + UI + acceptance criteria) |
| `/commit-phase N` | Git workflow with convention and DB migration checking (staging-branch aware) |
| `/harmonize` | Scan for convention violations, add test selectors |
| `/comprehensive-test` | Dual E2E frameworks (Playwright + Cypress), MSW integration tests |

## Prerequisites

- **Claude Code** (the CLI tool from Anthropic)
- **Web search capability** (Brave Search or equivalent) for ideation skills
- **Git** for version control
- **Node.js** for most web projects

## My Experience

I built these skills because I'm not a developer, but I wanted to build professional applications. The structured approach adds some ceremony, but every time I've used it, the ideation phase greatly improved my concept before I started building. The plan→execute→commit cycle keeps me in touch with what's being built—even when the code itself is beyond my understanding.

The tedium is the price of legibility. And for a non-coder, legibility is everything.

## License

MIT License - see [LICENSE](LICENSE)

## Author

Created by [@takleb3rry](https://github.com/takleb3rry)
