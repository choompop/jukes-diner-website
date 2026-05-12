# Notion to Kanban Sync

## Quick Start

### 1. Setup Notion API Access

**Never paste your API key into chat or Kanban cards!**

```bash
# 1. Create Notion integration
open https://notion.so/my-integrations

# 2. After creating integration and copying the API key:
echo "NOTION_API_KEY=ntn_your_actual_key_here" >> ~/.hermes/.env
chmod 600 ~/.hermes/.env

# 3. Share Notion databases with your integration
#    In Notion: Database → ... → Connect to → [Your Integration Name]
```

### 2. Test Discovery

```bash
cd /Users/lexi/projects/jukes-diner-website
python3 scripts/notion-discovery.py
```

This will:
- ✅ Verify NOTION_API_KEY is configured
- 🔍 Search for accessible Notion databases
- 📋 Show which Kanban cards would be created
- ❌ **NOT create any cards** (read-only discovery)

### 3. Review the Plan

The discovery script outputs:
- List of accessible databases
- Proposed Kanban cards with status, assignee, priority
- Summary by status (triage, ready, blocked)

### 4. Execute Sync (Manual)

After reviewing the discovery output, create cards manually:

```bash
# The sync creates cards using the Kanban API
# Each card includes:
# - Stable idempotency key (prevents duplicates)
# - Link back to Notion source
# - Appropriate status mapping
```

## Files

- `docs/notion-kanban-sync.md` — Full documentation
- `scripts/notion-discovery.py` — Discovery and planning script
- `scripts/notion-kanban-sync.py` — Full sync implementation (for integration)
- `scripts/notion-kanban-sync.sh` — Bash wrapper
- `logs/` — Sync execution logs

## Status Mapping

| Notion Status | → Kanban Status | Note |
|--------------|----------------|------|
| To Do, Backlog | triage | Needs specification |
| Ready, Specified | ready | Awaiting dispatch |
| Blocked, Waiting | blocked | Needs resolution |
| In Progress | _(skip)_ | Already being worked |
| Done, Complete | _(skip)_ | Completed |

## Security

- ✅ API key stored only in `~/.hermes/.env`
- ✅ No secrets in Kanban cards, comments, or logs
- ✅ Read-only access to Notion (no writes back)
- ✅ Dry-run first approach

## Next Steps

After successful discovery:

1. ✅ Review planned cards
2. ✅ Manually execute first sync
3. ✅ Verify no duplicates created
4. ⏰ Optionally setup recurring cron (after approval)

## Troubleshooting

**"No databases found"**
- Verify databases are shared with integration in Notion
- Check integration permissions

**"NOTION_API_KEY not found"**
- Verify `~/.hermes/.env` exists and contains key
- Check file permissions: `ls -la ~/.hermes/.env`

**"Duplicate cards created"**
- Check idempotency key implementation
- Review sync logs in `logs/`

## Target Board

All synced cards go to: **jukes-dashboard**
