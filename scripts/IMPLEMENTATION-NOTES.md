# Notion Kanban Sync - Implementation Notes

## Summary

Successfully implemented actual kanban card creation in `execute_sync()` method of `scripts/notion-kanban-sync.py`.

## Changes Made

### 1. Updated execute_sync() Method (lines 267-323)

Replaced stubbed TODO comments with working implementation:

- Uses `subprocess.run()` to call `hermes kanban create` CLI
- Includes all required parameters: title, body, assignee, priority, idempotency-key
- Returns JSON response with task_id
- Adds source attribution comment to each created card
- Proper error handling with try/except blocks
- Continues on individual failures (doesn't abort entire sync)

### 2. Key Implementation Details

**Option Chosen:** Shell out to hermes kanban CLI (Option A from task body)
- Clean separation of concerns
- No direct SQLite manipulation required
- Leverages existing CLI infrastructure

**Board Context:** 
- Removed non-existent `--board` flag (doesn't exist in hermes kanban CLI)
- Board context is determined by HERMES environment/profile config
- For jukes-dashboard: board is at `/Users/lexi/.hermes/kanban/boards/jukes-dashboard/`

**Idempotency:**
- Uses `--idempotency-key` parameter in CLI
- Format: `notion:{database_id}:{page_id}` (from existing code)
- Re-running sync will return existing task_id instead of creating duplicates

### 3. Error Handling

- Captures stderr on CLI failures
- Logs JSON parse errors
- Continues processing remaining cards on individual failures
- Returns list of successfully created task_ids

### 4. Source Attribution

Each created card gets a comment with:
- Source URL (Notion page link)
- Database name
- Non-blocking: sync continues if comment fails

## Testing

Created test script: `scripts/test_kanban_create.py`

Test results:
✅ Card creation works
✅ Source comments work  
✅ Idempotency verified (same task_id returned on duplicate)
✅ Test card t_37a51ab0 created and archived

## Usage

```bash
# Dry run (discovery + preview only)
python3 scripts/notion-kanban-sync.py --dry-run

# Execute mode (actually creates cards)
python3 scripts/notion-kanban-sync.py --execute
```

## Prerequisites

Before running `--execute`:

1. **Configure database allowlist** (task t_d61f9896 - priority 100)
   - Set NOTION_SYNC_DATABASES environment variable
   - Prevents syncing personal/sensitive databases
   
2. **Configure assignee validation** (task t_fd92db5f - completed)
   - Set NOTION_SYNC_ALLOWED_ASSIGNEES to restrict valid profiles (optional)
   - Set NOTION_SYNC_DEFAULT_ASSIGNEE to customize fallback (default: jukes-ops-agent)
   - Invalid assignees from Notion will trigger warnings and use fallback
   
3. **NOTION_API_KEY must be set**
   - Script validates this on startup

4. **Correct HERMES board context**
   - Ensure profile is configured for jukes-dashboard board
   - Or set appropriate environment variables

## Next Steps

1. Wait for t_d61f9896 (database allowlist configuration) to complete
2. Run dry-run to verify filtering works correctly  
3. Run execute mode to create actual cards
4. Monitor for duplicates/idempotency behavior
5. Verify source comments appear on created cards

## Files Modified

- `/Users/lexi/projects/jukes-diner-website/scripts/notion-kanban-sync.py` (lines 267-323)

## Files Created

- `/Users/lexi/projects/jukes-diner-website/scripts/test_kanban_create.py` (verification test)
- `/Users/lexi/projects/jukes-diner-website/scripts/IMPLEMENTATION-NOTES.md` (this file)

## Acceptance Criteria Status

- [x] Choose implementation approach (Option A: Shell out to hermes CLI)
- [x] Implement actual card creation in execute_sync()
- [x] Test with test script (verified card creation, comments, idempotency)
- [x] Verify idempotency keys prevent duplicates (✅ confirmed)
- [x] Verify created cards include source attribution comment (✅ confirmed)

## Notes

- The `--board` parameter was removed as it doesn't exist in the hermes kanban CLI
- Board context is implicit based on HERMES environment configuration
- All subprocess calls use `check=False` to allow graceful error handling
- Task IDs are extracted with fallback: `task_data.get('task_id') or task_data.get('id')`

---

## Assignee Validation Feature (t_fd92db5f)

### Summary

Added assignee validation to prevent invalid assignee values from Notion creating cards with non-existent profiles.

### Changes Made

#### 1. Default Allowed Assignees (lines 37-48)

Added `DEFAULT_ALLOWED_ASSIGNEES` constant with all known Juke's Diner profiles:
- jukes-coding-agent
- jukes-editor
- jukes-email-agent
- jukes-finance-agent
- jukes-librarian
- jukes-ops-agent
- jukes-qa-agent
- jukes-research-agent
- jukes-social-agent

#### 2. Initialization Configuration (lines 65-80)

Added three new configuration options in `__init__`:

1. **NOTION_SYNC_ALLOWED_ASSIGNEES** environment variable
   - Comma-separated list of valid profile names
   - If not set, uses DEFAULT_ALLOWED_ASSIGNEES
   - Example: `export NOTION_SYNC_ALLOWED_ASSIGNEES="jukes-coding-agent,jukes-qa-agent"`

2. **NOTION_SYNC_DEFAULT_ASSIGNEE** environment variable
   - Sets fallback assignee for invalid/missing values
   - Default: "jukes-ops-agent"
   - Example: `export NOTION_SYNC_DEFAULT_ASSIGNEE="jukes-ops-agent"`

3. **Self-validation of default assignee**
   - Ensures default assignee is in allowed list
   - Uses first allowed assignee as fallback if not

#### 3. Validation Method (lines 98-115)

Added `_validate_assignee(assignee: Optional[str]) -> str` method:
- Returns assignee if valid
- Returns default_assignee if None or empty string
- Returns default_assignee if not in allowed list
- Logs warning for invalid assignees

#### 4. Integration (lines 232-250, 285)

Modified `map_notion_to_kanban`:
- Calls `_validate_assignee()` after extracting assignee from Notion
- Uses validated_assignee in returned card dictionary
- Removed hardcoded `"jukes-ops-agent"` fallback

### Testing

Created comprehensive test suite with 3 test files:

#### test_assignee_validation.py
Unit tests for validation logic:
- ✅ Valid assignees pass through unchanged
- ✅ Invalid assignees use fallback
- ✅ None/empty assignees use default
- ✅ Environment variable configuration works
- ✅ Integration with map_notion_to_kanban works
- ✅ Default profiles exist in actual filesystem

#### test_integration.py
Integration tests for full flow:
- ✅ Default configuration loads correctly
- ✅ Validation flow with various inputs
- ✅ map_notion_to_kanban integration
- ✅ Environment configuration

#### test_kanban_create.py
Existing test still passes:
- ✅ Card creation works
- ✅ Idempotency works

All tests pass (9 unit tests + 4 integration test suites).

### Documentation Updates

Updated script docstring with:
- Assignee Validation section
- NOTION_SYNC_ALLOWED_ASSIGNEES example
- NOTION_SYNC_DEFAULT_ASSIGNEE example
- Default behavior explanation

### Security Benefits

1. **Prevents typos** - Misspelled assignees in Notion won't create orphaned cards
2. **Explicit allowlist** - Only known profiles can be assigned
3. **Safe fallback** - Invalid assignments gracefully handled with logging
4. **Environment-specific** - Can restrict allowed assignees per environment
5. **Audit trail** - Warnings logged when invalid assignees detected

### Usage Examples

```bash
# Use default configuration (all 9 profiles allowed)
python3 scripts/notion-kanban-sync.py --execute

# Restrict to specific profiles
export NOTION_SYNC_ALLOWED_ASSIGNEES="jukes-coding-agent,jukes-qa-agent"
python3 scripts/notion-kanban-sync.py --execute

# Custom default assignee
export NOTION_SYNC_DEFAULT_ASSIGNEE="jukes-qa-agent"
python3 scripts/notion-kanban-sync.py --execute
```

### Files Modified

- `scripts/notion-kanban-sync.py` (lines 1-39, 52-80, 98-115, 232-250, 285)
- `scripts/IMPLEMENTATION-NOTES.md` (this file)

### Files Created

- `scripts/test_assignee_validation.py` (9 unit tests)
- `scripts/test_integration.py` (4 integration test suites)

### Acceptance Criteria Status

- [x] Define allowed assignee profiles (DEFAULT_ALLOWED_ASSIGNEES constant + env config)
- [x] Validate extracted assignee against allowed list (_validate_assignee method)
- [x] Log warning and use safe fallback for invalid assignees (warnings in _validate_assignee)
- [x] Make default assignee configurable (NOTION_SYNC_DEFAULT_ASSIGNEE env var)
- [x] Tests verify validation works (9 unit + 4 integration tests passing)

