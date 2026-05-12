# External Action Approval Gate — Implementation Summary

**Task:** Add approval gate for Kanban external actions (t_2b5e7444)  
**Completed:** 2026-05-08  
**Agent:** jukes-ops-agent

## What Was Built

Added mandatory approval gates across the Hermes agent system to ensure all external-facing actions (email, social media, customer communication, payments, publishing) require explicit John approval before execution.

## Changes Made

### 1. Agent Operating Instructions Updated

**File:** `/Users/lexi/.hermes/profiles/jukes-ops-agent/GOALS.md`

Added "External Action Approval Gate" section defining:
- **Covered actions:** Email, social media, customer/vendor communication, payments, public publishing
- **Workflow:** Draft → Block task → Wait for approval → Execute → Complete
- **Boundaries:** Never send first and notify after; approval must precede action

**File:** `/Users/lexi/.hermes/profiles/jukes-ops-agent/SOUL.md`

Added critical boundary emphasizing:
- Internal draft required first
- Explicit approval required before execution
- Task blocking until approval received
- Draft completion is NOT task completion

### 2. Cron Job Template Created

**File:** `/Users/lexi/.hermes/profiles/jukes-ops-agent/templates/cron-external-action-template.md`

Comprehensive template for creating cron jobs with external action constraints:
- **Use cases:** Email campaigns, social posting, payment processing, publishing
- **Workflow specification:** Draft internally, block for approval, wait for John
- **Examples:** Customer inquiry monitoring, social media scheduling, data collection
- **Checklist:** Pre-creation verification steps

**Reference added to GOALS.md** so agents know to load this template when creating cron jobs.

### 3. Dashboard Enhancement Proposal

**File:** `/Users/lexi/projects/jukes-diner-website/docs/kanban-approval-gate-proposal.md`

Detailed proposal for future dashboard enhancements (NOT YET IMPLEMENTED):

**Proposed Features:**
- Task labels system: `requires-approval`, `draft-ready`, `approved`, `external-action`
- Dashboard visual indicators: Badge overlays, filter buttons, approval queue stats
- API convenience methods: `kanban_request_approval()`, `kanban_grant_approval()`
- Hermes CLI extensions: `hermes kanban approve <task_id>`

**Implementation Phases:**
- ✅ **Phase 1 (COMPLETE):** Agent instruction updates
- ⏳ **Phase 2 (PROPOSED):** Dashboard labels and visibility
- ⏳ **Phase 3 (PROPOSED):** API convenience helpers
- ⏳ **Phase 4 (FUTURE):** Cron job safeguards

**Decision Points for John:**
1. Should we implement dashboard labels now or defer until workflow is proven?
2. Should we extend Kanban schema with labels column or use metadata JSON?
3. Should we create convenience helpers or keep manual workflow?

**Recommendation:** Defer Phase 2+ until approval workflow is tested in practice.

## Acceptance Criteria Status

- ✅ **Agent goals state external actions require draft first:** GOALS.md section added
- ✅ **Workflow requires explicit approval before execution:** SOUL.md + GOALS.md both enforce
- ✅ **Dashboard/Kanban label changes proposed:** Comprehensive proposal document created
- ✅ **Cron prompt updated for approval rule:** Template created, referenced in GOALS.md
- ✅ **Wording clarifies approval happens BEFORE action:** Explicit in both GOALS.md and SOUL.md

## How It Works Now

### Agent Behavior (Immediate Effect)

When jukes-ops-agent receives a task involving external actions:

1. **Recognizes scope:** Task involves email/social/customer/payment/publishing
2. **Prepares draft:** Creates internal draft in Kanban comment or workspace file
3. **Blocks task:** Calls `kanban_block(reason="Draft ready: [type] requires approval before [action]")`
4. **Waits:** Task status → `blocked`, agent stops
5. **John reviews:** Reads draft, approves via unblock + comment
6. **Executes:** Agent executes external action ONLY after approval received
7. **Completes:** Task marked done with summary of what was sent/posted/published

### Cron Job Creation (When Needed)

When creating a cron job that might trigger external actions:

1. **Agent loads template:** `skill_view(name='...')` or reads `templates/cron-external-action-template.md`
2. **Includes approval gate in prompt:** Template ensures cron job knows to draft, not execute
3. **Cron creates drafts:** Recurring job prepares content internally
4. **Cron blocks tasks:** Each run creates/blocks a task with draft, awaiting approval
5. **John approves batches:** Reviews queue of drafts, approves those ready to send

## Testing Recommendations

### Smoke Test: Email Draft Workflow

1. Create test task: "Send test email to staging@example.com"
2. Verify agent behavior:
   - [ ] Agent drafts email text first
   - [ ] Agent blocks task before sending
   - [ ] Block reason clearly states approval needed
   - [ ] Draft visible in comment or workspace file
3. Approve via comment + unblock
4. Verify agent sends ONLY after approval

### Integration Test: Social Media Post

1. Create task: "Post Juke's lunch special to Instagram"
2. Verify workflow:
   - [ ] Agent drafts post copy + hashtags
   - [ ] Agent does NOT post to Instagram
   - [ ] Task blocked with draft ready message
   - [ ] Draft includes copy, timing, media suggestions
3. Approve or edit draft
4. Agent posts after approval

### Cron Job Test: Customer Inquiry Monitor

1. Create cron using `cron-external-action-template.md`
2. Set schedule: Manual trigger first (`hermes cronjob run <id>`)
3. Verify behavior:
   - [ ] Cron reads customer inquiries
   - [ ] Cron drafts responses
   - [ ] Cron does NOT send responses
   - [ ] Cron creates blocked task with drafts
4. If successful, enable recurring schedule

## Files Modified

```
/Users/lexi/.hermes/profiles/jukes-ops-agent/
├── GOALS.md (updated: added External Action Approval Gate section + template reference)
├── SOUL.md (updated: added External Action Approval Gate critical boundary)
└── templates/
    └── cron-external-action-template.md (created: cron job approval workflow template)

/Users/lexi/projects/jukes-diner-website/docs/
└── kanban-approval-gate-proposal.md (created: dashboard enhancement proposal)
```

## What Happens Next

### Immediate (No Action Needed)
- Agent instructions are live immediately
- All future tasks respect the approval gate
- No code deployment required
- No schema changes needed

### When External Action Tasks Arise
- Agent will draft first, block, and wait for approval
- John reviews drafts in Kanban comments/workspace
- John approves via unblock + comment
- Agent proceeds with execution

### If Cron Jobs Are Created
- Use `templates/cron-external-action-template.md` as guide
- Ensure cron prompt includes approval gate language
- Test with single manual run before enabling recurring schedule

### If Dashboard Labels Desired
- Review `/Users/lexi/projects/jukes-diner-website/docs/kanban-approval-gate-proposal.md`
- Decide on Phase 2 implementation (schema + UI)
- Create implementation task for jukes-coding-agent

## Related Tasks

- **Notion sync (t_d25ab438):** Now includes approval awareness (drafts don't auto-execute)
- **GL insurance (t_09ba9b40):** Example of approval gate working (document reviewed, not sent)
- **Agent roster (t_b2e0c397):** Could show approval queue stats if Phase 2 implemented

## Key Insight

The approval gate is **instruction-based**, not **code-enforced**. This means:

**Advantages:**
- ✅ Works immediately without deployment
- ✅ Flexible — applies to any external action
- ✅ Extensible — cron jobs inherit same constraint
- ✅ Observable — approval requests visible as blocked tasks

**Limitations:**
- ⚠️ Relies on agent instruction-following (not a hard technical gate)
- ⚠️ Dashboard doesn't visually highlight approval queue (yet)
- ⚠️ No automated approval workflow helpers (manual comment + unblock)

**Mitigation:**
- Agent GOALS.md and SOUL.md make boundary explicit and prominent
- Cron template ensures recurring jobs respect gate
- Future Phase 2 can add visual tracking when workflow is proven

## Success Metrics

1. **Zero Premature Actions:** No external communication/payments executed without approval
2. **Clear Audit Trail:** All approvals logged in task comments
3. **Predictable Workflow:** Draft → Block → Approve → Execute pattern consistently followed
4. **John's Operational Control:** Retains final say on all customer/vendor/public-facing actions

---

**Implementation Status:** ✅ COMPLETE

All acceptance criteria met. Agent operating instructions updated, cron template created, dashboard proposal documented. Approval gate is live and enforceable immediately.
