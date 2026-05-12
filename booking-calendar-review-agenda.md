# Booking Calendar Review with Daniel
**Status:** INTERNAL REVIEW COMPLETE - READY FOR DANIEL CONVERSATION  
**Created:** May 8, 2026  
**Task:** t_f366f4dc  
**Priority:** High (Notion due date: March 3, 2026 - OVERDUE)

---

## Executive Summary

**Problem:** No visible centralized booking calendar exists in the current workspace or Obsidian vault. Daniel is identified as the person who "runs event truck, handles bookings, staffing, cooking, inventory" and is "responsible for booking emails."

**Current State:**
- Event pipeline data exists (4 events with $750 in potential deposits)
- Kevin private event inquiry exists but blocked on missing info
- Duplicate test data in booking-inquiries.json
- No confirmed bookings calendar accessible to this agent
- Daniel's role includes booking management but no shared calendar visible

**Critical Questions for Daniel:**
1. Where is the actual booking calendar maintained? (Google Calendar, Notion, physical calendar, email threads?)
2. What confirmed bookings exist for May-August 2026?
3. Are there any conflicts with the event pipeline (May 9 double-booking)?
4. What's the process for moving from inquiry → confirmed → calendar?

---

## Internal Review Findings

### 1. Event Pipeline Status (From event-pipeline-follow-up-plan.md)

**CRITICAL ALERT - May 9, 2026 Date Conflict:**
- Hendersonville Arts Festival (10:00 CT, $400 deposit)
- Turnip Truck 25th Anniversary Picnic (11:00 CT, $200 deposit)
- DECISION NEEDED: Choose one event

**Event Summary:**

| Event | Date | Status | Deposit | Timeline | Critical Issues |
|-------|------|--------|---------|----------|-----------------|
| Nashville Farmers Market | March 1, 2026 | Follow Up | $0 | PAST (67 days ago) | Why is this still pending? Was it completed/missed? |
| East Nashville Beer Fest | April 11, 2026 | Applied | $150 NOT PAID | 32 days away | URGENT - Need acceptance confirmation + deposit deadline |
| Hendersonville Arts Festival | May 9, 2026 | Applied | $400 NOT PAID | 60 days away | CONFLICT with Turnip Truck same day |
| Turnip Truck 25th Anniversary | May 9, 2026 | Applied | $200 NOT PAID | 60 days away | CONFLICT with Hendersonville. Better brand fit, lower deposit. |

**Total Potential Deposits:** $750 (if all pursued)  
**Recommended Deposits:** $350 (Beer Fest + Turnip Truck)

**Missing Information:**
- Acceptance status for all "Applied" events
- Deposit payment deadlines
- Official contact for Hendersonville
- Current status of Nashville Farmers Market (past date)

### 2. Private Event Inquiry - Kevin

**Source:** https://www.notion.so/Email-invoice-to-Kevin-for-private-event-317abed9226c80edb714e602d8300f70

**Status:** BLOCKED - Missing ALL critical information

**Blocking Items:**
- Kevin's full name, email, phone
- Event date, time, location
- Guest count and service details
- Pricing and deposit terms
- Juke's payment acceptance methods
- Standard policies (cancellation, guest count changes)

**Revenue Risk:** Unknown dollar amount. Professional engagement materials drafted but cannot be populated without basic event details.

**Action Required:** Daniel likely has this information or knows where it lives (email thread, Notion page, text messages).

### 3. Data Integrity Issues

**File:** `/Users/lexi/projects/jukes-diner-website/data/booking-inquiries.json`

**Issue:** Contains 1,345 lines of duplicate test data
- Same 4 test inquiries repeated ~336 times
- All marked "status": "new"
- All created today (May 9, 2026)
- Appears to be test fixture pollution

**Test Inquiries:**
1. John Doe - June 1, 2026 - Wedding rehearsal dinner (50 guests)
2. First Customer - June 1, 2026 (50 guests)
3. Second Customer - July 1, 2026 (75 guests)
4. Test Customer - August 1, 2026 (100 guests)

**Recommendation:** Confirm with Daniel which (if any) are real inquiries vs test data. Clean file to reflect actual pipeline only.

### 4. Calendar Infrastructure - NOT FOUND

**Searched locations:**
- `/Users/lexi/projects/jukes-diner-website/` - No calendar files
- `/Users/lexi/Documents/obsidian-vault/` - No booking or calendar notes
- Data directory - Only test data found

**Referenced systems (not accessible to agent):**
- Google Calendar (mentioned in vault: "Google Drive OAuth connected (booking email)")
- Notion databases (referenced but no NOTION_API_KEY configured)
- Daniel's personal systems (email, texts, physical calendar?)

**Conclusion:** The actual booking calendar likely lives in one of Daniel's systems that this agent cannot currently access.

---

## Questions for Daniel (Prioritized)

### CRITICAL (Must-Answer)

1. **Where is the master booking calendar?**
   - Google Calendar? Notion? Physical calendar? Email threads?
   - Can you share access or provide a screenshot/export?

2. **What confirmed bookings exist for May-August 2026?**
   - Event name, date, time, location
   - Confirmed guest count
   - Deposit paid? Balance due?
   - Any date holds that aren't confirmed yet?

3. **May 9 conflict - Which event should we pursue?**
   - Hendersonville Arts Festival (10 AM, $400 deposit, Sanders Ferry Park)
   - Turnip Truck 25th Anniversary (11 AM, $200 deposit, East Park Nashville)
   - Agent recommendation: Turnip Truck (brand fit + lower cost)
   - Can the truck do both? (1-hour gap, different locations)

4. **Kevin private event - Where is the event information?**
   - Is it in Notion at https://www.notion.so/Email-invoice-to-Kevin-for-private-event-317abed9226c80edb714e602d8300f70?
   - Do you have it in email or text messages?
   - Can you provide: date, time, location, guest count, pricing agreed?

5. **Nashville Farmers Market - What's the status?**
   - Event date was March 1, 2026 (67 days ago)
   - Was this event completed? Missed? Cancelled?
   - Is this a recurring opportunity we should pursue for future dates?

### IMPORTANT (Process Clarity)

6. **What's the current inquiry → booking workflow?**
   - How do inquiries come in? (email, phone, website form, Instagram DM?)
   - Where do they get tracked?
   - Who handles follow-up?
   - When does something move from inquiry to confirmed?

7. **East Nashville Beer Fest - What's the status?**
   - Event: April 11, 2026 (32 days away)
   - Deposit: $150 not paid
   - Have we been accepted?
   - What's the deposit deadline?

8. **What's in the test data file?**
   - `booking-inquiries.json` has 336 duplicates of 4 test bookings
   - Are any of these real? (John Doe wedding, etc.)
   - Should we clean this file to show only actual pipeline?

### PROCESS IMPROVEMENT

9. **How should booking calendar visibility work going forward?**
   - Should calendar sync to Google Calendar for team visibility?
   - Should Notion be the source of truth?
   - Should dashboard show upcoming confirmed bookings?
   - Who needs access?

10. **What are the critical calendar dates to protect?**
    - Existing confirmed bookings
    - Date holds (not confirmed yet but verbally committed)
    - Blackout dates (truck unavailable, repairs, personal)
    - Trailer Park schedule (if same truck serves both)

---

## Agent Recommendations

### Immediate (Next 48 Hours)

1. **Get calendar access** - Request Daniel share Google Calendar or export current bookings
2. **Resolve May 9 conflict** - Choose Turnip Truck OR Hendersonville (recommend Turnip Truck)
3. **Follow up Beer Fest** - Confirm acceptance + pay $150 deposit if deadline approaching
4. **Clarify Nashville Farmers Market** - Archive if past event was completed/missed
5. **Get Kevin event details** - Need basic info to send invoice/contract

### Short-term (Next 2 Weeks)

6. **Clean data file** - Remove test duplicates from booking-inquiries.json
7. **Pay May 9 deposit** - Once event chosen, pay $200 (Turnip Truck) or $400 (Hendersonville)
8. **Document workflow** - Create shared process: inquiry → follow-up → deposit → confirmed → calendar
9. **Set up calendar integration** - Sync confirmed bookings to dashboard and team visibility

### Long-term (Next Month)

10. **Build booking intake system** - Website form → Notion/Google Calendar → automated follow-up
11. **Create deposit tracking** - Dashboard view of deposits paid, balance due, deadlines
12. **Establish booking policies** - Cancellation, guest count changes, payment terms (formalize in contracts)

---

## Potential Blocker Scenarios

**If Daniel says:**

- **"I keep it in my head/personal notes"** → Need to extract and centralize immediately. Risk of double-bookings and missed deposits.

- **"It's in Google Calendar but I haven't shared it"** → Request share access or export. Set up ongoing sync.

- **"The Notion page has all the info"** → Need NOTION_API_KEY configured to access. Can Daniel grant integration access?

- **"Most of those event applications were rejected"** → Update pipeline status, remove dead leads, focus on viable opportunities only.

- **"Kevin cancelled"** → Archive that task, no further action needed.

- **"I already paid the deposits"** → Get receipts, update event pipeline plan, track balance due dates.

---

## Draft Message to Daniel (DO NOT SEND - Requires John's Approval)

**Subject:** Booking Calendar Review - Need Your Input

Hi Daniel,

I'm working on getting the booking pipeline and calendar organized for the event truck. A few things need your input before we can move forward:

**URGENT - May 9 Date Conflict:**
We have applications pending for TWO events on May 9:
- Hendersonville Arts Festival (10 AM, $400 deposit)
- Turnip Truck 25th Anniversary (11 AM, $200 deposit)

Which one should we pursue? (My vote: Turnip Truck - better brand fit, lower cost, Nashville location)

**Calendar Questions:**
1. Where do you currently track confirmed bookings? (Google Calendar, Notion, other?)
2. What confirmed events do we have for May-August 2026?
3. Are there any date holds that aren't confirmed yet?

**Event Pipeline Status:**
- East Nashville Beer Fest (April 11) - Accepted? Deposit deadline?
- Nashville Farmers Market (March 1 - past) - Was this completed/missed?
- Kevin private event - Where's the event info? (Need it to send invoice)

**Data Cleanup:**
The booking-inquiries.json file has a ton of duplicate test data. Are any of those real bookings or should we clean it out?

Can we sync up this week to get this straight? Want to make sure we're not missing deposit deadlines or double-booking dates.

Let me know what works for you.

Thanks,
[John's name - DO NOT SEND WITHOUT APPROVAL]

---

## Files Created/Referenced

**Created during this review:**
- `/Users/lexi/projects/jukes-diner-website/booking-calendar-review-agenda.md` (this file)

**Referenced (existing):**
- `/Users/lexi/projects/jukes-diner-website/event-pipeline-follow-up-plan.md`
- `/Users/lexi/projects/jukes-diner-website/drafts/kevin-private-event/BLOCKING-INFO-NEEDED.md`
- `/Users/lexi/projects/jukes-diner-website/data/booking-inquiries.json`
- `/Users/lexi/Documents/obsidian-vault/people/Daniel.md`
- `/Users/lexi/Documents/obsidian-vault/projects/Juke's Diner.md`

---

## Next Steps for This Task

**Option A: Block task for John's decision**
- This agent cannot contact Daniel without John's approval
- Block with reason: "Need John to approve Daniel outreach or provide calendar access directly"
- Wait for John to either:
  - Approve the draft message to Daniel
  - Provide calendar access another way
  - Answer the critical questions directly

**Option B: John provides calendar access**
- If John shares Google Calendar or Notion access
- Agent can review directly and complete the analysis
- No external communication needed

**Option C: John answers questions directly**
- If John knows the current booking status
- Can update this review with confirmed data
- Complete task without needing Daniel conversation

---

## Acceptance Criteria Status

- [x] Current booking calendar has been reviewed for visible conflicts, missing details, or unclear items.
  - **Finding:** No centralized calendar accessible to agent. Event pipeline shows May 9 conflict.
- [x] A list of questions or review points for Daniel has been documented internally.
  - **Documented:** 10 prioritized questions in this file.
- [x] Any external message to Daniel, if needed, is drafted only and not sent without John's explicit approval.
  - **Drafted:** Message above clearly marked DO NOT SEND.
- [ ] Outcome of the review is recorded on the task, including decisions, blockers, and next action.
  - **Next action:** Block task for John's approval on Daniel outreach OR provide calendar access.
- [x] Task reflects the Notion due date of 2026-03-03 and high-priority booking category context.
  - **Noted:** Due date was March 3, 2026 - this review is 67 days overdue. Urgency acknowledged.

---

## Revenue Protection Notes

**At-Risk Revenue:**
- $150 East Nashville Beer Fest deposit (deadline unknown, event <5 weeks out)
- $200 OR $400 May 9 event deposit (need to choose event)
- Kevin private event (unknown amount, completely stalled)

**Total Visible At-Risk:** $350-550 in near-term deposits + unknown Kevin event value

**Calendar visibility is a revenue protection issue:**
- Double-bookings lose deposit money and damage reputation
- Missed deposit deadlines forfeit event opportunities
- Slow response to inquiries (Kevin) reduces conversion
- No shared calendar means coordination failures with team/customers

**This review is complete and ready for John's decision on how to proceed.**
