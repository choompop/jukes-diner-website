# Agent Roster Feature

## Overview
The Agent Roster page displays all Hermes AI agents working on Juke's operating system, their missions, active tasks, and current status.

## Components

### Data Generation
- `scripts/generate-agent-roster.mjs` - Reads from:
  - `/Users/lexi/.hermes/profiles/*/GOALS.md` for agent missions and rules
  - `/Users/lexi/.hermes/kanban.db` for active task assignments
- Outputs to `data/agent-roster.json`
- Runs automatically before each build via package.json

### Data Model
```json
{
  "generated_at": "ISO timestamp",
  "profile_count": 9,
  "total_active_tasks": 1,
  "unassigned_tasks": [...],
  "agents": [
    {
      "profile": "jukes-coding-agent",
      "mission": "Build dashboard.jukesdiner.com...",
      "working_rules": ["- Work only from Kanban cards", ...],
      "guardrails": ["- Never commit secrets", ...],
      "active_tasks": [
        {
          "id": "t_abc123",
          "title": "Build feature X",
          "status": "running",
          "priority": 88
        }
      ],
      "task_count": 1
    }
  ]
}
```

### UI Component
- `app/dashboard/agents/page.tsx` - Main roster page
  - Stats cards: active agents, active tasks, busy agents
  - Expandable agent cards showing mission, rules, guardrails, and tasks
  - Task status indicators (running, ready, blocked)
  - Unassigned tasks warning panel

### Navigation
- Added to dashboard sidebar under "Main" section
- Route: `/dashboard/agents`
- Icon: Bot (lucide-react)

## Testing
- `tests/agent-roster.test.mjs` - Tests data model structure and validation
- Run with `npm test`

## Commands
```bash
# Generate roster data manually
npm run generate-roster

# Build (auto-generates roster)
npm run build

# Run tests
npm test
```

## Public Access
- Data file accessible at `/data/agent-roster.json` via symlink in public/
- Auto-refreshed on build
- Client-side fetch in dashboard component

## Acceptance Criteria ✅
- [x] Page visible under dashboard navigation
- [x] Reads from structured local JSON (agent-roster.json)
- [x] Shows agent roster with profile missions
- [x] Shows active GOALS.md summary (mission, rules, guardrails)
- [x] Shows which Kanban task each agent is working on
- [x] Tests cover the roster model
- [x] npm test passes
- [x] npm run build passes
