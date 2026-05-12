# Event Intake Records

This directory contains enriched intake records for vendor events, bookings, and catering opportunities synced from the Notion Event Pipeline.

## Purpose

Each intake record provides:
- Complete event details (date, time, location, contact)
- Financial status (deposits, fees, payment status)
- Internal ownership and responsibility assignment
- Next steps and acceptance criteria
- Draft communications (flagged for approval)
- Source metadata and idempotency keys

## Structure

Each event has two files:
- `{event-slug}.json` - Machine-readable structured data
- `{event-slug}.md` - Human-readable card for dashboard/Obsidian

## Current Intake Records

### Active / Urgent

1. **East Nashville Beer Fest** (Priority: HIGH, Urgency: URGENT)
   - Files: `east-nashville-beer-fest.json`, `east-nashville-beer-fest.md`
   - Status: Applied
   - Event Date: April 11, 2026 (32 days away)
   - Deposit: $150 NOT PAID
   - Next Step: Confirm acceptance and deposit deadline
   - Notion ID: `308abed9-226c-803f-a0d7-f7fb0d1d8fad`

## Workflow

1. **Enrichment** - Agent creates structured record from Notion sync
2. **Owner Assignment** - Internal owner assigned (or flagged for decision)
3. **Action Definition** - Next steps defined with clear acceptance criteria
4. **Approval Gate** - External communications drafted but require approval
5. **Dispatch** - Ready for assigned owner to execute

## Metadata Standards

All records include:
- Idempotency key (Notion ID format: `notion:{page_id}`)
- Notion source URL
- Enrichment timestamp and agent
- Related documents
- Tags for filtering

## Notes

- **DO NOT** send external communications without explicit approval
- **DO NOT** process payments or deposits without authorization
- **DO NOT** modify Notion source records unless part of sync workflow
- All financial actions require John's approval
- Priority and urgency flags guide dispatch order

---

**Last Updated:** 2026-05-08 21:44 UTC  
**Maintained By:** jukes-social-agent
