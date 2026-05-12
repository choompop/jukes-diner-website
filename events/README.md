# Event Pipeline - Active Events

This directory contains enriched event intake records for Juke's Diner vendor opportunities.

## Status Categories

- **Applied**: Application submitted, awaiting response
- **Hold**: On hold due to scheduling conflict, budget, or other blocker
- **Confirmed**: Deposit paid, vendor packet received, ready for ops planning
- **In Progress**: Event date approaching, logistics in motion
- **Completed**: Event finished, post-event review needed
- **Declined**: Application withdrawn or event not pursued

## Active Events (May 2026)

### On Hold - Scheduling Conflicts

**May 9, 2026** - TWO CONFLICTING APPLICATIONS
- [Hendersonville Arts Festival](./hendersonville-arts-festival-2026.md) - $400 deposit, 15% sales fee, Hendersonville TN
- Turnip Truck 25th Anniversary Picnic - $200 deposit, Nashville (RECOMMENDED)

**Decision Required:** Owner must choose ONE May 9 event before either can proceed.

---

## File Structure

Each event has:
- **Markdown file** (`eventname-YYYY.md`) - Human-readable intake with context, missing info, next actions
- **JSON file** (`eventname-YYYY.json`) - Machine-readable data for dashboards, automation, reporting

## Usage

**For Operations Team:**
Read the `.md` file for full context, decision background, and next steps.

**For Dashboards/Automation:**
Parse the `.json` file for structured data (dates, financials, status, blockers).

**For Owner (John):**
Review events marked "HOLD" or "Decision Required" — these need your call before proceeding.

---

## Next Actions

1. **Resolve May 9 conflict** - Choose Turnip Truck OR Hendersonville (recommend Turnip Truck)
2. **Assign internal owner** to each confirmed event (operations coordinator)
3. **Track missing information** - Contact organizers to fill gaps
4. **Monitor deposit deadlines** - Don't lose confirmed events due to missed payment windows
