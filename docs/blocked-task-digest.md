# Blocked Task Notification Digest

## Overview

The blocked task notification digest provides dashboard visibility into Hermes Kanban tasks that are blocked and require John's input. This feature integrates with the existing librarian blocker workflow to surface blockers in a read-only, safe-for-operators format.

## Implementation

### Components

**1. Data Access Layer** (`lib/hermes-blocked-tasks.mjs`)
- Queries the Hermes kanban database (`~/.hermes/kanban.db`)
- Reads tasks with `status='blocked'` or `outcome='blocked'`
- Extracts blocker information from task runs and comments
- Sanitizes output to prevent exposure of secrets (API keys, tokens, passwords)
- Formats timestamps for human-friendly display

**2. Dashboard Pages**
- `/dashboard/blocked-tasks` - Full blocked tasks digest page
- `/dashboard/workflow` - Integrated digest section showing up to 6 blocked tasks

**3. Navigation**
- Added "Blocked Tasks" link to the "Hermes / Kanban" section in the sidebar
- Link uses `AlertTriangle` icon for visual consistency

### Data Sources

The digest reads directly from the Hermes kanban database:

```
~/.hermes/kanban.db
├── tasks (task metadata, status, assignee, priority)
├── task_runs (blocking runs with outcome='blocked', summary)
├── task_comments (librarian context, blocker details)
└── task_events (blocked event timestamps for notifications)
```

### Blocker Information Extraction

The system extracts structured blocker information from:

**From `task_runs.summary`**
- Primary blocker reason when agent calls `kanban_block(reason="...")`

**From `task_comments`**
- `Blocker: <description>` - What's missing
- `Decision needed: <question>` - Alternative blocker format
- `Format: <answer format>` - Suggested answer structure
- Context from non-blocker comment paragraphs

### Secret Sanitization

All displayed text passes through sanitization to redact:
- API keys (patterns like `sk_live_*`, `pk_test_*`, `api_*`, `token_*`)
- Bearer tokens
- Password assignments (`password=*`, `pwd:*`)
- Base64-encoded credentials (40+ char base64 strings)
- SSH/RSA private keys

**Example:**
```
Input:  "Need API key sk_live_51Hxyz123 for Stripe"
Output: "Need API key [REDACTED_KEY] for Stripe"
```

## Dashboard UI

### Blocked Tasks Digest Page

**Header Section**
- Task count and urgent count statistics
- Clear call-to-action explaining what's needed

**Task Cards**
Each blocked task shows:
- Task ID (e.g., `t_abc123`)
- Title
- Assignee (agent profile)
- Priority badge (Urgent, High, Medium, Normal, Low)
- Missing information (sanitized blocker reason)
- Suggested answer format (if provided)
- Context (first non-blocker comment paragraph)
- Timestamps:
  - Blocked time (when task entered blocked state)
  - Last notified time (when John was last notified)
- Link to view task in workflow board

**Help Section**
- Instructions on how to unblock a task
- Security note about secret redaction

### Workflow Page Integration

The workflow page (`/dashboard/workflow`) now includes a prominent blocked tasks section that appears when any tasks are blocked:

- Shows up to 6 blocked tasks in a grid
- Red/urgent visual treatment for high visibility
- "View All Blocked Tasks" button linking to full digest
- Shows overflow count if more than 6 tasks blocked

## Acceptance Criteria Status

- [x] The Hermes dashboard includes a blocked lane or digest for tasks requiring John
- [x] Each listed blocked task shows the task ID
- [x] Each listed blocked task shows the assignee
- [x] Each listed blocked task shows the exact missing information needed to unblock it
- [x] Each listed blocked task shows the suggested answer format (when available)
- [x] Each listed blocked task shows the last notified timestamp (when available)
- [x] No secret values are displayed in the digest or lane
- [x] The digest integrates with the existing librarian blocker workflow

## Integration with Librarian Workflow

The digest is designed to work seamlessly with the existing librarian blocker workflow:

1. **Agent blocks task** - Calls `kanban_block(reason="...")`
2. **Librarian enriches** - Adds structured comments with context
3. **Dashboard surfaces** - Digest extracts and displays blocker info
4. **John unblocks** - Provides answer via Slack/Kanban/system
5. **Agent resumes** - Dispatcher spawns agent to continue work

The digest is read-only and does not modify Kanban state. It simply surfaces existing blocker data in an operator-friendly format.

## Files Added/Modified

### New Files
- `lib/hermes-blocked-tasks.mjs` - Data access and sanitization
- `app/dashboard/blocked-tasks/page.tsx` - Full digest page
- `tests/hermes-blocked-tasks.test.mjs` - Test suite (11 tests, all passing)
- `docs/blocked-task-digest.md` - This documentation

### Modified Files
- `app/dashboard/workflow/page.tsx` - Added digest section
- `app/dashboard/components/DashboardLayout.tsx` - Added nav link

## Testing

**Test Coverage** (11 tests, all passing)

Database query tests:
- ✓ Find blocked tasks by status
- ✓ Extract blocker info from comments
- ✓ Redact API keys and secrets
- ✓ Handle tasks with multiple comments
- ✓ Track last notified timestamp
- ✓ Handle tasks with no comments
- ✓ Sort blocked tasks by priority

Sanitization tests:
- ✓ Redact API keys
- ✓ Redact Bearer tokens
- ✓ Redact passwords
- ✓ Preserve non-secret content

## Future Enhancements

**Not in scope for this task:**
- Notification delivery channels beyond dashboard
- Ability to unblock tasks from the dashboard
- Integration with Slack/messaging for unblocking
- Filtering/sorting controls on the digest page
- Historical view of resolved blockers

These could be added in future iterations based on operator feedback.

## Usage Example

**Agent blocks task:**
```python
kanban_block(
    task_id="t_abc123",
    reason="Need approval for live Stripe Connect setup"
)

kanban_comment(
    task_id="t_abc123",
    body="Decision needed: Approve or deny live account creation\n\nFormat: Reply 'approve' or 'deny' in Slack"
)
```

**Dashboard displays:**
- **Missing Information**: Need approval for live Stripe Connect setup
- **Suggested Answer Format**: Reply 'approve' or 'deny' in Slack
- **Assignee**: jukes-finance-agent
- **Priority**: Urgent

**John unblocks:**
- Sees digest on dashboard
- Replies "approve" in Slack
- Librarian or operator marks task unblocked
- Finance agent resumes work

## Security Considerations

- All blocker text passes through `sanitizeForDisplay()` before rendering
- No direct mutation of Kanban state from dashboard
- Database queries are read-only (`readonly: true`)
- Secret patterns are redacted but full data remains in Kanban DB for agents
- No PII exposure beyond what's intentionally added to blocker messages
