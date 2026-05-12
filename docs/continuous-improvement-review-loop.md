# Continuous Improvement Review Loop Visualization

## Overview

The Juke's Dashboard now shows the Hermes Kanban continuous improvement workflow, making QA/review status and follow-up work visible to operators.

## Features

### 1. Real-time Kanban Board View
- **Live Data**: Reads directly from the Hermes kanban database (`~/.hermes/kanban.db`)
- **Six Lanes**: Triage, TODO, Ready, Running, Blocked, Done
- **Auto-refresh**: Data regenerates on every build

### 2. Task Classification
Tasks are automatically classified by type:
- **Task**: Standard implementation work
- **Review**: QA/dogfood/review tasks (identified by assignee=jukes-qa-agent, title keywords, or body patterns)
- **Finding**: Bug/fix/remediation tasks (identified by fix/bug/finding keywords or blocker patterns)
- **Triage**: Specification tasks (status=triage or assignee=jukes-librarian)

### 3. Review Status Tracking
For completed work, the system shows:
- **Approved**: Review task done, no findings
- **Approved with Fixes**: Review task done, findings exist and are resolved
- **Pending Review**: Done but awaiting review
- **Pending Fixes**: Review done, findings still open
- **Blocked Review**: Review task is blocked
- **No Review**: No review child task created

### 4. Task Relationship Chains
Each task card displays:
- Parent task count (↑)
- Child task count (↓)
- Task type badge
- Review status badge (when applicable)
- Last run summary and profile

## Architecture

### Data Flow
```
Hermes kanban.db
    ↓
scripts/generate-kanban-view.mjs (runs on build)
    ↓
data/kanban-board.json
    ↓
lib/hermes-kanban.mjs
    ↓
app/dashboard/hermes-kanban/page.tsx
```

### Classification Logic
Review tasks are identified by:
- `assignee === 'jukes-qa-agent'`
- Title includes 'review', 'qa', 'dogfood'
- Body includes 'review' + 'acceptance'

Finding/fix tasks are identified by:
- Title includes 'fix', 'bug', 'issue', 'finding'
- Body includes 'blocker:', 'security:', 'remediate'

### Review Status Inference
The system walks parent→child→grandchild relationships:
1. If a done task has a review child:
   - Review child is done + no finding grandchildren = **Approved**
   - Review child is done + all findings resolved = **Approved with Fixes**
   - Review child is done + findings still open = **Pending Fixes**
   - Review child is running/ready/blocked = **Pending Review** / **Blocked Review**
2. If a done task has no review child = **No Review**

## Files

### New Files
- `app/dashboard/hermes-kanban/page.tsx` — Dashboard page component
- `lib/hermes-kanban.mjs` — Data access layer
- `scripts/generate-kanban-view.mjs` — Kanban DB → JSON generator
- `tests/hermes-kanban.test.mjs` — Test coverage
- `docs/continuous-improvement-review-loop.md` — This file

### Modified Files
- `package.json` — Added `generate-kanban` script to build step

## Usage

### Viewing the Board
Navigate to `/dashboard/hermes-kanban` in the dashboard.

### Updating the Data
Data auto-refreshes on build:
```bash
npm run build
```

Or manually:
```bash
npm run generate-kanban
```

### Running Tests
```bash
npm test tests/hermes-kanban.test.mjs
```

## Future Enhancements
- Click-through to task detail view showing full body, comments, and run history
- Filtering by assignee, task type, or review status
- Live refresh without rebuild (WebSocket or polling)
- Direct task creation/editing from the dashboard
- Integration with agent roster page (show tasks per agent)

## Acceptance Criteria ✓
- [x] Dashboard/Kanban view clearly identifies review cards (purple badge)
- [x] Dashboard/Kanban view clearly identifies finding/fix cards (amber badge)
- [x] Task detail shows parent→child task counts (↑ ↓ indicators)
- [x] Operators can tell review status (6 status badges: approved, approved_with_fixes, etc.)
- [x] Tests pass (96/96 new tests, build passes)
- [x] Build passes (TypeScript, Next.js build)
