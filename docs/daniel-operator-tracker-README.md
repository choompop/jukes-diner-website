# Daniel Operator Agreement & IP Ownership Tracker

## Overview

This tracker provides a comprehensive internal dashboard for managing Daniel's operator agreement status, IP/menu/name ownership, lawyer touchpoints, and legal document dependencies.

**Status**: Internal use only - no external parties contacted.

**Last Updated**: 2026-05-09

**Next Review**: 2026-05-16

---

## Dashboard Access

The tracker is available at:

- **File**: `/Users/lexi/projects/jukes-diner-website/data/daniel-operator-tracker.json`
- **Dashboard**: `http://dashboard.jukesdiner.com/dashboard/daniel-operator-tracker` (once deployed)
- **Local Dev**: `http://localhost:3000/dashboard/daniel-operator-tracker`

---

## Structure

### 1. **Risk Flags** (Top Priority Section)

Displays critical and high-priority risks that need immediate attention:

- ❌ **No Written Operator Agreement** (CRITICAL)
- ❌ **Unclear Insurance Coverage** (CRITICAL)  
- ⚠️ **Recipes & Menu IP Vulnerable** (HIGH)
- ⚠️ **Customer Data Could Be Taken on Exit** (MEDIUM)

Each risk includes:
- Severity level (Critical, High, Medium, Low)
- Description of the risk
- Recommended mitigation steps

### 2. **Operator Agreement Status**

Tracks the core legal agreement and related compliance items:

- **Operator Agreement Draft**: Core legal document (BLOCKED - requires lawyer review)
- **Background Check**: Employment verification (NOT STARTED)
- **Liability Insurance Coverage**: Coverage determination (BLOCKED - requires insurance broker consult)

### 3. **IP, Menu & Name Ownership**

Documents ownership of all intellectual property and assets:

- **Brand Name Rights**: Juke's Diner name/logo/branding (100% John)
- **Menu & Recipe Ownership**: Recipes, sourcing, "secret sauce" (100% John)
- **Truck & Equipment Ownership**: Physical assets (100% John, Daniel is custodian)
- **Customer Data & Bookings**: Customer lists, sales data (100% Juke's)

### 4. **Lawyer Touchpoints** (No Contact Yet)

Lists legal consultations needed **but NOT YET initiated**:

- **Operator Agreement Legal Review**: Employment/contract lawyer needed ($500-$1,500 est.)
- **IP Protection Legal Review**: IP clauses and trade secret protection ($300-$800 est.)

**⚠️ IMPORTANT**: This section flags legal work needed but does NOT contact lawyers. John initiates when ready.

### 5. **Documents Needed**

Master checklist of all legal documents required:

- **Operator Agreement Template** (BLOCKED - requires lawyer)
- **Standalone NDA** (NOT STARTED - may be redundant with operator agreement)
- **Insurance Requirements Doc** (BLOCKED - requires insurance broker)
- **Background Check Consent** (NOT STARTED)

Each document includes:
- Status (Blocked, Not Started, Pending)
- "Must Include" checklist for content requirements
- Next action item and owner
- Blocker reason if applicable

### 6. **Timeline & Milestones**

Four-phase implementation plan:

**Phase 1**: Legal Consultation & Document Preparation (2-4 weeks)
- Engage lawyer, review agreement template, consult insurance broker

**Phase 2**: Agreement Negotiation & Signatures (1-2 weeks)  
- Present to Daniel, negotiate terms, obtain signatures, background check

**Phase 3**: Insurance & Compliance Finalization (1-2 weeks)
- Update policies, obtain certificates, set up payment structure

**Phase 4**: Operational Handoff & Monitoring (Ongoing)
- Onboarding, equipment handoff, reporting cadence, 30/60/90 day check-ins

---

## How to Use This Tracker

### For John (Business Owner):

1. **Review Risk Flags weekly** - These are the highest-priority exposures.

2. **Use as blocking gate** - Don't proceed with Daniel's operator responsibilities until critical blockers are cleared (lawyer review, insurance confirmation).

3. **Track decision points** - "Open Questions" sections list decisions you need to make (profit share vs salary, liability split, exit terms).

4. **Budget planning** - Estimated costs for lawyer consultations are flagged ($800-$2,300 total estimated).

5. **Insurance consultation** - Use the Insurance Requirements section to prepare for Goosehead consultation (contact: Sarah Miller, (555) 019-8877).

### For Ops Agent:

1. **Update status as blockers clear** - Change item status from "blocked" → "pending" → "documented" as work progresses.

2. **Flag new risks** - Add new risk flags if exposures are discovered.

3. **Track open questions** - Add/remove open questions as they're answered.

4. **Update timeline** - Adjust phase estimates based on actual progress.

5. **Never contact lawyers or external parties** - This tracker is read-only for external touchpoints. Only John initiates contact.

### Status Definitions:

- **BLOCKED**: Cannot proceed without clearing a specific dependency (lawyer review, insurance consult, John decision)
- **NOT STARTED**: Ready to work but not yet initiated
- **PENDING**: Work in progress, waiting on external party
- **DOCUMENTED**: Complete and recorded
- **ACTIVE**: Ongoing process (e.g., monitoring, compliance)

---

## Critical Next Steps (Prioritized)

### Immediate (This Week):

1. ✅ **Tracker created and available for review**
2. ⬜ **John reviews Risk Flags and decides on timeline**
3. ⬜ **John selects employment/contract lawyer for agreement review**
4. ⬜ **John schedules Goosehead Insurance consultation re: operator coverage**

### Short-Term (2-4 Weeks):

5. ⬜ **Lawyer reviews and customizes operator agreement template**
6. ⬜ **Insurance broker confirms coverage model and cost**
7. ⬜ **John makes key decisions** (compensation structure, exit terms, liability split)

### Medium-Term (4-8 Weeks):

8. ⬜ **Present agreement to Daniel and negotiate terms**
9. ⬜ **Obtain Daniel's signature on agreement and NDA**
10. ⬜ **Execute background check**
11. ⬜ **Finalize insurance updates and obtain certificates**

### Long-Term (Ongoing):

12. ⬜ **Operational handoff and 30/60/90 day monitoring**

---

## Integration Points

### Dashboard:

- The tracker is displayed at `/dashboard/daniel-operator-tracker` with:
  - Risk flags prominently featured at top
  - Tabbed sections for each category
  - Expandable cards for each item showing full details
  - Color-coded status badges (red = blocked, yellow = pending, green = documented)
  - Priority indicators (critical, high, medium, low)

### Data Updates:

To update tracker content:

1. Edit `/Users/lexi/projects/jukes-diner-website/data/daniel-operator-tracker.json`
2. Modify item statuses, add open questions, update next actions
3. Add new risk flags or remove mitigated ones
4. Dashboard auto-reflects changes on next page load

### Future Enhancements:

- Link to Google Drive folder for storing signed documents
- Email notifications when blockers are cleared
- Integration with Notion for task tracking
- Automatic reminders for review dates

---

## Out of Scope (Not Covered by This Tracker)

❌ **Contacting lawyers or external parties** - This tracker identifies legal needs but does NOT initiate contact. John must do that.

❌ **Drafting legal language** - The tracker lists what must be included but does NOT draft actual legal text. Lawyer does that.

❌ **Sending emails or legal requests** - This is an internal planning tool only.

❌ **Making legal decisions** - The tracker flags decision points but John/lawyer make final calls.

---

## Security & Confidentiality

⚠️ **INTERNAL USE ONLY** - This tracker contains sensitive business strategy, IP ownership details, and legal planning information.

- **Do NOT share** with Daniel until after lawyer review and John approval
- **Do NOT share** with external parties (vendors, customers, competitors)
- **Do NOT post** on public channels or external dashboards
- **Access control**: Limit to John and trusted ops/admin staff only

Once operator agreement is finalized and signed, Daniel can be given access to his own copy of the final agreement but NOT to this internal planning tracker.

---

## Maintenance Schedule

- **Weekly**: Review risk flags, update statuses as blockers clear
- **Bi-weekly**: Update timeline estimates based on actual progress
- **Monthly**: Add/remove open questions as they're answered or arise
- **After major milestones**: Update entire tracker and archive previous version

**Next Scheduled Review**: 2026-05-16

---

## Questions or Issues?

- **Ops clarifications**: Contact jukes-ops-agent via Hermes kanban
- **Legal questions**: Engage lawyer (flagged in tracker, NOT contacted yet)
- **Insurance questions**: Contact Goosehead Insurance - Sarah Miller, (555) 019-8877
- **Business decisions**: John makes final call

---

**Tracker Version**: 1.0  
**Created By**: jukes-ops-agent  
**Created At**: 2026-05-09  
**Last Modified**: 2026-05-09
