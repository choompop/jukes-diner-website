# Notion to Kanban Sync - Implementation Summary

## What Was Built

A safe, read-only-first Notion to Kanban sync system for the `jukes-dashboard` board.

## Files Created

### Documentation
1. **docs/notion-kanban-sync.md** — Comprehensive setup and design documentation
   - Security requirements (API key handling)
   - Status mapping tables
   - Idempotency key design
   - Dry-run process
   - Future cron automation guidelines

2. **README-notion-sync.md** — Quick start guide
   - Setup instructions
   - Test discovery process
   - File reference
   - Troubleshooting

3. **docs/notion-sync-dashboard.md** — Dashboard tracking template
   - Setup checklist
   - Current state tracking
   - Sync history format
   - Metrics to track
   - Security checklist

### Implementation Scripts

4. **scripts/notion-discovery.py** — Discovery and planning script
   - Read-only database discovery
   - Card planning with status mapping
   - Summary output
   - No card creation (safe to run)

5. **scripts/notion-sync-executor.py** — Execution script for Hermes context
   - Uses hermes_tools for kanban integration
   - Can be run via execute_code
   - Designed for actual card creation

6. **scripts/notion-kanban-sync.py** — Full standalone sync implementation
   - Complete sync logic with dry-run support
   - Logging and reporting
   - Modular design for integration

7. **scripts/notion-kanban-sync.sh** — Bash wrapper
   - Environment loading
   - Safe execution wrapper

## Security Features Implemented

✅ **API Key Protection**
- Never requested via chat
- Documented storage in ~/.hermes/.env only
- Not exposed in logs, cards, or comments
- File permissions: 600 (owner read/write only)

✅ **Read-Only Access**
- No writes back to Notion
- Only queries and discovery
- Safe to run multiple times

✅ **Dry-Run First**
- Discovery mode shows what would be created
- Review gate before execution
- No automated recurring sync without approval

## How It Works

### 1. Setup Phase
User creates Notion integration and stores API key in ~/.hermes/.env
(Never through chat or Kanban)

### 2. Discovery Phase
```bash
python3 scripts/notion-discovery.py
```
- Searches for accessible Notion databases
- Lists all databases shared with integration
- Shows which items would become Kanban cards
- **Does NOT create cards**

### 3. Planning Phase
For each Notion database item:
- Extracts title, status, assignee, priority
- Maps Notion status → Kanban status
- Generates stable idempotency key
- Skips in-progress/completed items

### 4. Execution Phase (Manual, After Review)
```python
# From Hermes agent context
execute_code(content=notion-sync-executor.py)
# Then manually create cards using kanban_create
```

### 5. Future Automation (After Approval)
Optional recurring cron can be configured:
- Every 15 minutes
- Respects idempotency keys
- Logs all sync activity

## Status Mapping

| Notion | Kanban | Action |
|--------|--------|--------|
| To Do, Backlog | triage | Create for specification |
| Ready, Specified | ready | Create for dispatch |
| Blocked, Waiting | blocked | Create with block reason |
| In Progress, Doing | _(skip)_ | Already being worked |
| Done, Complete | _(skip)_ | Already completed |

## Idempotency Design

**Key Format:** `notion:{database_id}:{page_id}`

**Example:** `notion:abc123def456:xyz789uvw012`

**Benefits:**
- Stable across sync runs
- Prevents duplicates via kanban_create
- Allows updates to existing cards (future)

## Card Attribution

Every synced card includes:
```markdown
**Source:** Notion database '[Database Name]'

[View in Notion](https://notion.so/page_id)
```

Plus a comment (future implementation):
```
Source: https://notion.so/page_id
Database: [Name]
Synced: 2026-05-08T20:57:00Z
```

## Testing Performed

✅ **Setup Check**
- Verified API key detection
- Clear error messages when key missing
- Setup instructions displayed

✅ **Script Structure**
- All scripts have proper error handling
- Clean output formatting
- JSON output for programmatic use

✅ **File Organization**
- Logical directory structure
- docs/ for documentation
- scripts/ for executables
- logs/ for sync history (created on first run)

## Current State

**Setup Status:** ⚠️ Pending - NOTION_API_KEY needs to be configured

**Next Steps for John:**

1. **Configure API Key** (5 minutes)
   - Create Notion integration: https://notion.so/my-integrations
   - Copy API key
   - Add to ~/.hermes/.env: `NOTION_API_KEY=ntn_your_key_here`
   - Set permissions: `chmod 600 ~/.hermes/.env`

2. **Share Databases** (2 minutes per database)
   - Open Notion database
   - Click "..." → "Connect to" → [Integration name]
   - Repeat for all task databases

3. **Test Discovery** (1 minute)
   - Run: `python3 scripts/notion-discovery.py`
   - Review output
   - Confirm databases are accessible

4. **Review Planned Cards** (5 minutes)
   - Check status mappings
   - Verify assignees
   - Confirm priorities

5. **Approve First Sync** (decision point)
   - Review dry-run output
   - Approve card creation
   - Monitor for duplicates

6. **Optional: Enable Recurring Sync** (after successful manual sync)
   - Approve cron schedule
   - Configure via cronjob tool
   - Monitor sync logs

## Acceptance Criteria Status

- [x] Documentation explains safe NOTION_API_KEY configuration
- [x] No workflow asks for API key via chat
- [x] Discovery script identifies shared databases
- [x] Dry-run shows planned cards without creating them
- [x] Status mapping implemented (Notion → Kanban)
- [x] Idempotency keys designed and documented
- [x] Source attribution included in card body
- [x] No secrets in cards, comments, or logs
- [x] Dashboard tracking document created
- [x] Cron automation documented (not enabled)

## Out of Scope (As Expected)

- ❌ Writing changes back to Notion
- ❌ Auto-enabling cron before dry-run approval
- ❌ Migrating all Notion content (tasks only)

## Future Enhancements

Potential improvements after initial deployment:

1. **Bi-directional Sync**
   - Update Notion when Kanban status changes
   - Requires careful conflict resolution

2. **Rich Content Sync**
   - Extract Notion page content blocks
   - Convert to Kanban task body

3. **Advanced Filtering**
   - Sync only specific databases
   - Filter by Notion properties
   - Date-based filtering

4. **Webhook Integration**
   - Real-time sync on Notion changes
   - Requires Notion webhook support

5. **Dashboard UI**
   - Visual sync status monitoring
   - Card mapping preview
   - Manual sync trigger

## Metrics to Monitor

After deployment:
- Databases synced
- Cards created per sync
- Duplicate prevention rate
- Sync execution time
- API rate limit compliance (3 req/sec)
- Mapping conflicts

## Support

All documentation and scripts are in:
```
/Users/lexi/projects/jukes-diner-website/
├── docs/
│   ├── notion-kanban-sync.md
│   └── notion-sync-dashboard.md
├── scripts/
│   ├── notion-discovery.py
│   ├── notion-sync-executor.py
│   ├── notion-kanban-sync.py
│   └── notion-kanban-sync.sh
└── README-notion-sync.md
```

Logs will be created in: `logs/notion-sync-YYYYMMDD-HHMMSS.log`
