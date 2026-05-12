# Notion to Kanban Sync Setup

## Overview

This document describes how to safely configure and run a read-only sync from Notion data sources to the Hermes Kanban board (`jukes-dashboard`). The sync discovers tasks in shared Notion databases and creates matching Kanban intake cards without duplicating work.

## Security: API Key Management

**IMPORTANT:** The Notion API key is a secret credential and must NEVER be:
- Pasted into chat messages
- Stored in Kanban cards, comments, or task bodies
- Committed to git repositories
- Included in logs or dashboard output

### Safe Setup Procedure

1. **Create a Notion Integration**
   - Go to https://notion.so/my-integrations
   - Click "New integration"
   - Name it (e.g., "Hermes Kanban Sync")
   - Copy the API key (starts with `ntn_` or `secret_`)

2. **Store API Key Securely**
   ```bash
   # Create or edit ~/.hermes/.env
   echo "NOTION_API_KEY=ntn_your_key_here" >> ~/.hermes/.env
   chmod 600 ~/.hermes/.env
   ```

3. **Share Notion Pages/Databases with Integration**
   - Open the Notion page or database containing tasks
   - Click "..." (three dots menu)
   - Select "Connect to" → Choose your integration name
   - **This step is critical** — unshared pages/databases will not be accessible

4. **Configure Database Filtering (Optional but Recommended)**
   ```bash
   # Add to ~/.hermes/.env to only sync specific databases
   echo "NOTION_SYNC_DATABASES=db_id_1,db_id_2,db_id_3" >> ~/.hermes/.env
   ```
   
   **Why filtering is important:**
   - Prevents historical logs, journals, or workout trackers from syncing as tasks
   - Ensures only actual task databases create Kanban cards
   - Run `--dry-run` first to discover database IDs, then configure allowlist

5. **Verify Setup**
   ```bash
   # The sync script will check for NOTION_API_KEY
   # If missing, it will instruct you to complete steps 1-3
   ./scripts/notion-kanban-sync.sh --check
   ```

## Sync Design

### Database Filtering

To prevent non-task databases (logs, journals, trackers) from creating Kanban cards:

**Environment Variable:** `NOTION_SYNC_DATABASES`

**Format:** Comma-separated list of database IDs to sync

**Example:**
```bash
# In ~/.hermes/.env
NOTION_SYNC_DATABASES=a1b2c3d4-e5f6-4890-ab12-cd34ef567890,x9y8z7w6-v5u4-3210-fe98-dc76ba543210
```

**Discovery Workflow:**
1. Run `--dry-run` without filtering to see all accessible databases
2. Note database IDs from the output
3. Add only task databases to `NOTION_SYNC_DATABASES`
4. Re-run `--dry-run` to verify filtering works
5. Execute sync with confidence

**Known Databases to Exclude:**
- Workouts database (`beee62c3-f2ec-4d87-b202-ab568cdcf0cc`) — historical workout logs
- Atlas OS Nano Scorecard — personal wellness tracking
- Daily journals, event logs, calendars

### Read-Only First Approach

The initial implementation is **read-only only**:
- ✅ Reads Notion databases and data sources
- ✅ Creates/updates Kanban cards based on Notion items
- ❌ Does NOT write changes back to Notion
- ❌ Does NOT automatically enable recurring cron

### Notion to Kanban Mapping

**Task Discovery:**
- Searches accessible Notion databases/data sources for task-like content
- Looks for properties indicating task state: "Status", "State", "To Do", etc.
- Maps Notion item properties to Kanban card fields

**Status Mapping:**
| Notion Status | Kanban Status | Reasoning |
|--------------|---------------|-----------|
| To Do, Todo, Backlog | triage | Needs specification/enrichment |
| Ready, Specified, Assigned | ready | Fully specified, awaiting dispatch |
| In Progress, Doing, Working | (skip) | Already being worked |
| Done, Complete, Shipped | (skip) | Completed, no intake needed |
| Blocked, Waiting | blocked | Needs resolution |

**Field Mapping:**
- **Title:** Notion page/item title → Kanban `title`
- **Body:** Notion rich text content → Kanban `body`
- **Assignee:** Notion "Assignee" property → Kanban `assignee` (if agent profile exists)
- **Priority:** Notion "Priority" property → Kanban `priority` (numeric mapping)
- **Source Link:** Always added as comment with Notion page URL

### Idempotency Keys

To prevent duplicate cards on repeated syncs:

**Key Format:** `notion:{database_id}:{page_id}`

Example: `notion:a1b2c3d4-e5f6:x9y8z7w6-v5u4`

**Implementation:**
- Each Notion item maps to a unique idempotency key
- Kanban `kanban_create` uses this key to prevent duplicates
- Updates to existing Notion items can be detected and synced

### Source Attribution

Every Kanban card created from Notion includes:

1. **Source Comment:**
   ```
   Source: Notion
   Database: [Database Name]
   Page: https://notion.so/[page_id]
   Synced: [ISO timestamp]
   ```

2. **No Sensitive Data:**
   - Comments NEVER contain API keys
   - Comments NEVER contain integration secrets
   - Only public-shareable Notion URLs included

## Dry Run Process

Before creating any Kanban cards:

1. **Discovery Phase:**
   - Search accessible Notion pages/databases
   - List all data sources shared with the integration
   - Output summary of discovered task sources

2. **Mapping Preview:**
   - Show which Notion items would become Kanban cards
   - Display proposed status, assignee, priority mappings
   - Highlight any mapping conflicts or ambiguities

3. **Review Gate:**
   - Human reviews the dry run output
   - Confirms mapping logic is correct
   - Approves actual sync execution

4. **Execution:**
   - Only after approval, create Kanban cards
   - Log created card IDs for verification
   - Report sync results

## Implementation Files

- `scripts/notion-kanban-sync.sh` — Main sync script (bash wrapper)
- `scripts/notion-kanban-sync.py` — Core sync logic (Python)
- `docs/notion-kanban-sync.md` — This documentation
- `logs/notion-sync-YYYYMMDD.log` — Sync execution logs

## Cron Automation (Future)

After successful dry run and manual execution:

1. **Propose Recurring Sync:**
   - Suggest cron schedule (e.g., every 15 minutes)
   - Document `cronjob` tool usage
   - Require explicit approval before enabling

2. **Safety Constraints:**
   - Cron job must respect idempotency keys
   - Must not flood Kanban with duplicates
   - Must handle Notion API rate limits (3 req/sec avg)

3. **Monitoring:**
   - Log sync results to dashboard
   - Alert on failures or mapping errors
   - Track duplicate prevention effectiveness

## Troubleshooting

**"Missing NOTION_API_KEY" Error:**
- Verify `~/.hermes/.env` contains `NOTION_API_KEY=ntn_...`
- Check file permissions: `chmod 600 ~/.hermes/.env`
- Reload environment: `source ~/.hermes/.env`

**"No Accessible Databases Found":**
- Verify Notion pages/databases are shared with integration
- Check integration permissions in Notion settings
- Ensure API key is from the correct integration

**"Duplicate Kanban Cards Created":**
- Idempotency keys may not be working
- Check `kanban_create` calls include `idempotency_key` parameter
- Review sync logs for failed duplicate detection

## Target Board

All synced cards target: **jukes-dashboard**

This is the authoritative board for Juke's Diner operational work.
