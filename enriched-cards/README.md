# Enriched Event Pipeline Cards

This directory contains fully enriched event intake cards that have been imported from Notion and enhanced with internal context, owner assignments, and clear next steps.

## Purpose

When events are imported from Notion via the notion-kanban-sync script, they arrive with minimal information - typically just a title, basic status, and a link back to the Notion page. This directory contains the "enriched" versions with:

- Full event details (date, time, location, contact)
- Financial terms (fees, deposits, payment status)
- Internal owner assignments
- Clear next step with rationale
- Acceptance criteria checklists
- Source/traceability information
- Internal notes and context

## Structure

Each enriched card follows this template:

1. **Header:** Event name, status, owner, priority
2. **Event Details:** Date, time, location, type
3. **Financial Terms:** Fees, deposits, costs
4. **Current Status & History:** Why this status, timeline
5. **Next Step:** Single concrete action with owner
6. **Acceptance Criteria:** Checklist from original spec
7. **Source & Traceability:** Notion URL, idempotency key
8. **Internal Notes:** Context, lessons, related events
9. **Administrative Actions:** Recommended next steps

## Current Cards

### tennessee-banana-festival.md
**Status:** Deposit Paid (INCONSISTENT - Deposit NOT Received)  
**Owner:** Daniel (Event Operations)  
**Next Step:** Verify deposit payment status with organizer  
**Key Facts:**
- June 27, 2026 event (49 days away)
- $175 deposit fee
- Critical inconsistency: Status="Deposit Paid" but deposit_received=false
- Requires immediate verification to avoid vendor slot risk
- Cookeville, TN location (80 miles from Nashville)

### st-patricks-parade-nashville.md
**Status:** Lost  
**Owner:** Daniel (Event Operations)  
**Next Step:** Archive as closed/lost (event date passed)  
**Key Facts:**
- March 14, 2026 event (past)
- 15% of sales fee structure
- No deposit ever received
- Application never accepted

## Owner Conventions

Based on internal systems and event pipeline conventions:

- **Daniel** - Event truck operations lead, handles bookings, staffing, cooking, inventory
- **jukes-ops-agent** - Default assignee for operational follow-up
- **jukes-social-agent** - Social media, booking intake, and response quality

## Status Definitions

- **Lost:** Application rejected or not pursued; event may be past
- **Applied:** Application submitted, awaiting acceptance
- **Follow Up:** Needs clarification or decision before proceeding
- **Confirmed:** Accepted, deposit paid, on calendar

## Integration Points

These enriched cards serve as the "source of truth" for:

1. **Dashboard Display:** /app/dashboard/bookings shows event pipeline status
2. **Kanban Board:** Tasks created for follow-up actions
3. **Slack Alerts:** #jukes-growth channel notifications
4. **Decision Support:** Daniel's event selection and deposit prioritization

## Maintenance

- **Archive past events:** Monthly cleanup of past-dated Lost/Declined events
- **Update on status change:** When Notion status changes, re-enrich card
- **Link to outcomes:** If event happens, link to post-event report

## See Also

- `/Users/lexi/projects/jukes-diner-website/event-pipeline-follow-up-plan.md` - Active events follow-up plan
- `/Users/lexi/projects/jukes-diner-website/booking-calendar-review-agenda.md` - Calendar review findings
- `/Users/lexi/projects/jukes-diner-website/scripts/notion-kanban-sync.py` - Import automation
