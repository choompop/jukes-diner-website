# Kanban External Action Approval Gate - Dashboard Implementation Proposal

## Overview

This document proposes dashboard and database enhancements to make the external action approval requirement visible and trackable on the Kanban board.

## Current State

The approval gate is now enforced via:
- ✅ Agent GOALS.md (jukes-ops-agent profile)
- ✅ Agent SOUL.md (system prompt)
- ⏳ Dashboard visibility (proposed below)
- ⏳ Task labels/metadata (proposed below)

## Proposed: Task Labels System

### Database Schema Addition

Add a `labels` field to the `tasks` table:

```sql
ALTER TABLE tasks ADD COLUMN labels TEXT;
-- Stored as JSON array: ["requires-approval", "external-action", "payment"]
```

### Standard Label Set

**Approval-Related:**
- `requires-approval` — Task requires explicit John approval before completion
- `draft-ready` — Internal draft prepared, awaiting approval
- `approved` — John approved, ready to execute external action

**Action Type:**
- `external-action` — Task involves external-facing communication/action
- `email-outreach` — Customer/vendor email
- `social-post` — Social media publishing
- `payment-op` — Stripe/payment operation
- `public-publish` — Blog/press/announcement

**Safety:**
- `no-auto-execute` — Block autonomous execution
- `review-required` — Requires human review before proceeding

### Example Workflows

**Email Campaign Task:**
```python
kanban_create(
    title="Send GL insurance inquiry to T&L Industries",
    assignee="jukes-ops-agent",
    body="...",
    # Would require extending kanban_create API:
    labels=["requires-approval", "external-action", "email-outreach"]
)
```

**Agent Workflow:**
1. Prepare draft email in workspace file
2. Add `draft-ready` label via `kanban_update_labels(add=["draft-ready"])`
3. Block task: "Draft ready: GL insurance email requires approval"
4. John reviews, adds `approved` label, unblocks
5. Agent sends email
6. Complete with `external-action` metadata

## Proposed: Dashboard Visual Indicators

### Task Card Enhancements

**Label Badges:**
```tsx
{task.labels?.includes('requires-approval') && (
  <Badge variant="warning" className="gap-1">
    <ShieldAlert className="h-3 w-3" />
    Requires Approval
  </Badge>
)}

{task.labels?.includes('draft-ready') && (
  <Badge variant="info" className="gap-1">
    <FileCheck className="h-3 w-3" />
    Draft Ready
  </Badge>
)}

{task.labels?.includes('approved') && (
  <Badge variant="success" className="gap-1">
    <CheckCircle className="h-3 w-3" />
    Approved
  </Badge>
)}
```

**Status Column Highlighting:**
- Tasks with `requires-approval` label show warning icon
- Blocked tasks with `draft-ready` label highlighted differently
- Approved tasks ready for execution marked clearly

### Workflow Board Filters

Add filter buttons:
- "Needs Approval" — Shows tasks with `draft-ready` label
- "External Actions" — Shows tasks with `external-action` label
- "Approved Pending" — Shows tasks with `approved` but not yet completed

### Agent Roster Integration

Add approval queue stats to Agent Roster page:
```typescript
interface AgentStats {
  // ... existing fields
  approvalQueue: {
    draftsReady: number;      // Tasks blocked awaiting approval
    approved: number;          // Approved tasks ready to execute
    requiresApproval: number;  // Total tasks needing approval
  };
}
```

Display as alert badge on ops-agent card when drafts are ready.

## Proposed: API Additions

### New Kanban Tool Methods

**Label Management:**
```python
kanban_update_labels(
    task_id: str,
    add: list[str] = [],
    remove: list[str] = []
) -> dict
# Add/remove labels atomically
```

**Approval Workflow Helpers:**
```python
kanban_request_approval(
    task_id: str,
    draft_location: str,  # Path or comment ID
    action_type: str,     # "email", "social", "payment", etc.
    reason: str
) -> dict
# Convenience wrapper that:
# 1. Adds "draft-ready" label
# 2. Adds approval request comment
# 3. Blocks task with structured reason
```

```python
kanban_grant_approval(
    task_id: str,
    approver: str = "John"
) -> dict
# Convenience wrapper that:
# 1. Adds "approved" label
# 2. Removes "draft-ready" label
# 3. Unblocks task
# 4. Adds approval comment
```

### Hermes CLI Extensions

```bash
# List tasks awaiting approval
hermes kanban list --label draft-ready

# Approve a task
hermes kanban approve <task_id> [--comment "approved, send it"]

# Request approval on current task
hermes kanban request-approval <task_id> \
  --draft workspace/email-draft.md \
  --type email \
  --reason "GL insurance inquiry ready to send"
```

## Implementation Phases

### Phase 1: Agent Instruction (COMPLETE)
- ✅ Updated GOALS.md with approval gate workflow
- ✅ Updated SOUL.md with critical boundary
- ✅ No code changes required
- ✅ Works immediately via agent instruction-following

### Phase 2: Dashboard Visibility (PROPOSED)
- [ ] Add `labels` column to tasks table
- [ ] Implement label badge rendering in task cards
- [ ] Add filter buttons for approval states
- [ ] Update Agent Roster with approval queue stats

### Phase 3: API Convenience (PROPOSED)
- [ ] Implement `kanban_update_labels` tool
- [ ] Implement `kanban_request_approval` helper
- [ ] Implement `kanban_grant_approval` helper
- [ ] Add Hermes CLI approval commands

### Phase 4: Cron Job Safeguards (FUTURE)
- [ ] Cron job template variable: `{EXTERNAL_ACTION_GATE}`
- [ ] Auto-inject approval gate reminder into cron prompts
- [ ] Require `--allow-external-actions` flag for cron jobs involving external ops

## Cron Job Considerations

### Current State
- Zero active cron jobs (verified via `cronjob list`)
- No immediate cron update needed

### When Cron Jobs Are Created

Any cron job that could trigger external actions must include the approval gate in its prompt:

**Example Cron Prompt Template:**
```markdown
## Task
Monitor Slack #flo-notifications channel for customer inquiries. 
Summarize new inquiries and prepare draft responses.

## Critical Constraint
EXTERNAL ACTION APPROVAL GATE: 
- Draft all responses internally (Kanban comment or workspace file)
- NEVER send responses directly
- Block the task or create a child task with "requires-approval" label
- Wait for John's explicit approval before any customer communication
```

**Implementation:**
- Add this template to `~/.hermes/profiles/jukes-ops-agent/templates/cron-external-action-template.md`
- Reference in GOALS.md under "Skills to add"
- Load template when creating cron jobs via `skill_view`

## Testing Checklist

### Agent Behavior Verification
- [ ] Create test task: "Send test email to staging account"
- [ ] Verify agent prepares draft first
- [ ] Verify agent blocks task before sending
- [ ] Verify agent waits for approval
- [ ] Verify agent only sends after explicit approval

### Dashboard Visibility
- [ ] Labels appear on task cards
- [ ] Filter buttons work correctly
- [ ] Agent Roster shows approval queue
- [ ] Badge colors/icons render properly

### API Functionality
- [ ] `kanban_update_labels` adds/removes labels correctly
- [ ] `kanban_request_approval` creates proper approval request
- [ ] `kanban_grant_approval` unblocks and marks approved
- [ ] CLI commands work as documented

## Success Metrics

1. **Zero Premature Actions:** No external-facing actions executed without explicit approval
2. **Visible Pipeline:** John can see approval queue at a glance on dashboard
3. **Clear Workflow:** Agents consistently follow draft → block → approval → execute pattern
4. **Audit Trail:** All approvals logged in task comments and events

## Files Modified/Created

**Modified:**
- `/Users/lexi/.hermes/profiles/jukes-ops-agent/GOALS.md`
- `/Users/lexi/.hermes/profiles/jukes-ops-agent/SOUL.md`

**Created:**
- `/Users/lexi/projects/jukes-diner-website/docs/kanban-approval-gate-proposal.md` (this file)

**Future (Phase 2+):**
- `lib/kanban-labels.ts` — Label management utilities
- `app/dashboard/workflow/components/TaskLabels.tsx` — Label badge components
- `app/api/kanban/labels/route.ts` — Label update API endpoint
- `~/.hermes/profiles/jukes-ops-agent/templates/cron-external-action-template.md`

## Related Documentation

- `/Users/lexi/projects/jukes-diner-website/docs/notion-kanban-sync.md` — Kanban sync patterns
- `/Users/lexi/projects/jukes-diner-website/AGENT_ROSTER_IMPLEMENTATION.md` — Agent roster architecture
- Hermes Kanban schema: `~/.hermes/kanban.db` (tasks, task_events, task_comments tables)

## Approval Decision Points

This proposal requires John's decision on:

1. **Should we implement Phase 2 (dashboard labels) now or later?**
   - Now = visual tracking immediately available
   - Later = agent instruction enforcement sufficient for now

2. **Should we extend the Kanban schema with labels column?**
   - Alternative: Store labels in task metadata JSON field (no schema change)
   - Trade-off: Schema column = easier queries, metadata = more flexible

3. **Should we create convenience helpers (`kanban_request_approval`) or keep it manual?**
   - Manual = agent calls `kanban_comment` + `kanban_block` + label management separately
   - Helper = simpler agent code, less verbose

**Recommendation:** Implement Phase 1 only (agent instructions) immediately. Defer Phase 2+ until we observe the approval workflow in practice and identify friction points worth automating.

---

**Status:** Phase 1 COMPLETE. Agent goals and boundaries updated to enforce approval gate.
