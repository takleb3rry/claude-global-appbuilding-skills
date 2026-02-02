# Installation

## Prerequisites

- [Claude Code](https://claude.ai/claude-code) installed and configured
- macOS, Linux, or Windows with WSL

## Installing the Skills

### Option 1: Copy Manually

1. Clone or download this repository
2. Copy the contents of the `skills/` folder to your Claude Code global skills directory:

```bash
# macOS/Linux
cp -r skills/* ~/.claude/skills/

# Windows (PowerShell)
Copy-Item -Recurse skills\* $env:USERPROFILE\.claude\skills\
```

### Option 2: Clone and Symlink

```bash
# Clone the repo
git clone https://github.com/takleb3rry/claude-global-appbuilding-skills.git

# Create symlinks for each skill
cd claude-global-appbuilding-skills/skills
for skill in */; do
  ln -sf "$(pwd)/$skill" ~/.claude/skills/
done
```

This approach lets you pull updates with `git pull`.

## Verify Installation

Open Claude Code and type `/` to see available skills. You should see:

- `/ideation-start`
- `/ideation-research`
- `/ideation-synthesize`
- `/kickoff`
- `/tech-stack`
- `/plan-phase`
- `/execute-phase`
- `/commit-phase`
- `/harmonize`
- `/comprehensive-test`

## Configuration

### Web Search (Required for Ideation Skills)

The ideation skills (`/ideation-start`, `/ideation-research`, `/ideation-synthesize`) use web search to validate ideas against market reality. Ensure you have:

- Brave Search MCP server configured, OR
- WebSearch tool available in your Claude Code setup

### Comprehensive Test Configuration

Before using `/comprehensive-test`, update the configuration section in the skill to match your project:

```
LOCAL_WEB_URL      = http://localhost:5173      # Your local dev server
LOCAL_API_URL      = http://localhost:3000      # Your local API server
PRODUCTION_URL     = [YOUR_PRODUCTION_URL]      # Your deployed app URL
```

## Updating Skills

If you used Option 2 (symlink):

```bash
cd path/to/claude-global-appbuilding-skills
git pull
```

If you used Option 1 (copy), re-copy the updated skills:

```bash
cp -r skills/* ~/.claude/skills/
```

## Uninstalling

Remove the skill folders from `~/.claude/skills/`:

```bash
rm -rf ~/.claude/skills/ideation-start
rm -rf ~/.claude/skills/ideation-research
rm -rf ~/.claude/skills/ideation-synthesize
rm -rf ~/.claude/skills/kickoff
rm -rf ~/.claude/skills/tech-stack
rm -rf ~/.claude/skills/plan-phase
rm -rf ~/.claude/skills/execute-phase
rm -rf ~/.claude/skills/commit-phase
rm -rf ~/.claude/skills/harmonize
rm -rf ~/.claude/skills/comprehensive-test
```

## Troubleshooting

### Skills not appearing

- Ensure the folder names match exactly (case-sensitive on Linux/macOS)
- Check that each skill folder contains a `SKILL.md` file
- Restart Claude Code after adding skills

### Web search not working

- Verify your MCP server configuration includes Brave Search
- Check that your API keys are set correctly

### Ideation skills failing

- The skills require `ideation.md` to progress through the sequence
- Run `/ideation-start` first to create the initial file
- Check the Status field in `ideation.md` matches the expected state
