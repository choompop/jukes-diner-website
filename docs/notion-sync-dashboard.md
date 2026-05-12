# Notion Sync Dashboard Tracking

## Setup Status

- [ ] Notion integration created
- [ ] NOTION_API_KEY added to ~/.hermes/.env
- [ ] Notion databases shared with integration
- [ ] Discovery script tested successfully
- [ ] First dry-run completed
- [ ] Idempotency verified (no duplicates)
- [ ] Recurring cron approved and configured

## Current State

**Last Discovery:** Not yet run

**Accessible Databases:** 0

**Planned Cards:** 0

**Last Sync:** Not yet run

**Cards Created:** 0

**Status:**
- Setup: ⚠️ Pending API key configuration
- Discovery: ⏸️ Not run
- Dry Run: ⏸️ Not run
- Production Sync: ⏸️ Not run
- Recurring Cron: ⏸️ Not configured

## Discovery Results

(Will be populated after first discovery run)

## Sync History

(Will be populated after sync executions)

### Format
```
YYYY-MM-DD HH:MM - [DRY RUN | EXECUTE]
  Databases: N
  Cards planned: N
  Cards created: N
  Status: SUCCESS | PARTIAL | FAILED
  Notes: ...
```

## Idempotency Verification

Track duplicate prevention:

```
Database ID → Page ID → Kanban Card ID
---------------------------------------------
(Will be populated to verify idempotency)
```

## Issues and Resolutions

(Track any mapping conflicts, API errors, or sync failures)

## Next Steps

1. **Immediate:** Configure NOTION_API_KEY
2. **Next:** Share Notion databases with integration
3. **Then:** Run discovery script
4. **Review:** Validate planned cards
5. **Execute:** First manual sync
6. **Monitor:** Check for duplicates
7. **Automate:** Setup cron (if approved)

## Metrics to Track

- Total Notion databases accessible
- Total items per database
- Cards created per sync
- Duplicate prevention success rate
- Sync execution time
- API call count (respect 3 req/sec limit)
- Mapping conflicts or errors

## Proposed Cron Schedule

**After successful dry-run approval:**

```yaml
schedule: "*/15 * * * *"  # Every 15 minutes
prompt: "Run Notion to Kanban sync for jukes-dashboard board"
skills: ["notion", "kanban-worker"]
enabled: false  # Enable after approval
```

## Security Checklist

- [x] API key never exposed in logs
- [x] API key never in Kanban cards/comments
- [x] API key never in git commits
- [x] Read-only access only (no Notion writes)
- [ ] Integration permissions reviewed
- [ ] Shared databases audit completed

## Documentation Links

- Full docs: `docs/notion-kanban-sync.md`
- Quick start: `README-notion-sync.md`
- Discovery script: `scripts/notion-discovery.py`
- Sync script: `scripts/notion-kanban-sync.py`
