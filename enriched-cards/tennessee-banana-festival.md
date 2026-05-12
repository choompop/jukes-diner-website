# Tennessee Banana Festival - Event Pipeline Card

**Status:** Deposit Paid (INCONSISTENT - Deposit NOT Received)  
**Event Type:** Festival Vendor Opportunity  
**Owner:** Daniel (Event Truck Operations Lead)  
**Priority:** HIGH (deposit inconsistency requires immediate attention)

---

## Event Details

**Event Name:** Tennessee Banana Festival

**Date & Time:** June 27, 2026 @ 10:00 AM (Central Time)

**Days Until Event:** 49 days (as of May 8, 2026)

**Location:**  
Putnam County Fairgrounds  
Cookeville, TN

**Contact:**  
southernmarketplaceevents@gmail.com

**Event Type:** Public festival with vendor booths

---

## Financial Terms

**Deposit Requirements:**
- Deposit amount: $175 USD
- **Notion Status:** "Deposit Paid"
- **Deposit Received Flag:** ❌ FALSE (deposit_received = false)
- **⚠️ INCONSISTENCY:** Status shows "Deposit Paid" but deposit_received checkbox is unchecked

**Total Cost:**
- Vendor fee: $175 deposit (likely vendor booth fee or application deposit)
- Additional fees: To be determined

---

## Current Status & Critical Issue

**Notion Status:** Deposit Paid

**⚠️ CRITICAL DISCREPANCY:**

The Notion record shows contradictory information:
1. **Status field:** "Deposit Paid" (purple status)
2. **Deposit Received checkbox:** Unchecked (false)

**Possible Explanations:**
1. Status was updated to "Deposit Paid" but checkbox wasn't ticked (data entry error)
2. Deposit was sent but not yet received/confirmed by organizer
3. Status was changed prematurely before payment was actually made
4. Checkbox reflects whether Juke's received a deposit (reversed logic)

**Financial Risk:**
- If deposit was NOT actually paid, vendor slot may be at risk
- If deposit WAS paid but not tracked, possible duplicate payment or lost proof
- 49 days to event - enough time to resolve, but action needed soon

---

## Next Step

**Action:** Verify actual deposit payment status with organizer

**Owner:** Daniel (with John approval for external communication)

**Recommended Approach:**

**⚠️ DO NOT SEND WITHOUT JOHN'S APPROVAL ⚠️**

**Channel:** Email  
**Recipient:** southernmarketplaceevents@gmail.com  
**Subject:** Juke's Diner - Deposit Confirmation for Tennessee Banana Festival

**Draft Message:**
```
Hi,

This is John from Juke's Diner. We submitted a vendor application for the 
Tennessee Banana Festival on June 27th at Putnam County Fairgrounds.

Could you please confirm:

1. Status of our vendor application
2. Whether our $175 deposit has been received
3. Any additional requirements or next steps before the event

We want to make sure we're squared away well in advance.

Thanks,
John Jukes
Juke's Diner
[contact info]
```

**Follow-Up Actions:**

1. **Confirm Internal Payment Records**
   - Trigger: Before contacting organizer
   - Owner: John or bookkeeper
   - Action: Check bank/credit card statements for $175 payment to this event

2. **Update Notion Pipeline**
   - Trigger: After deposit status confirmed
   - Owner: jukes-ops-agent
   - Action: Either check deposit_received box OR change status away from "Deposit Paid"

3. **Process Deposit Payment**
   - Trigger: If deposit was never paid
   - Owner: John
   - Approval Required: Yes

4. **Gather Event Logistics**
   - Trigger: After deposit verification complete
   - Owner: Daniel
   - Details needed: Load-in time, space allocation, equipment requirements, menu restrictions

---

## Acceptance Criteria Checklist

- [x] Card includes event name: Tennessee Banana Festival
- [x] Card includes event date/time: 2026-06-27 10:00 AM CT
- [x] Card includes event location: Putnam County Fairgrounds in Cookeville, TN
- [x] Card includes contact: southernmarketplaceevents@gmail.com
- [x] Card preserves Notion URL and idempotency key (see Source & Traceability below)
- [x] Card calls out deposit inconsistency: Status = "Deposit Paid" vs Deposit Received = False
- [x] Card has internal owner: Daniel (Event Operations Lead)
- [x] Card has concrete acceptance criteria and next step: Verify deposit payment status
- [x] No external messages sent or payments made without approval

---

## Source & Traceability

**Notion URL:**  
https://www.notion.so/Tennessee-Banana-Festival-308abed9226c80969c06d2e4130d1540

**Notion Database:** Event Pipeline

**Idempotency Key:**  
`notion:306abed9-226c-8054-99a9-000b2fb2b9ef:308abed9-226c-8096-9c06-d2e4130d1540`

**Import Date:** ~May 8, 2026 (based on sync logs)

**Notion Fields Captured:**
- Event Name: Tennessee Banana Festival (title field)
- Event Date: 2026-06-27T10:00:00.000-05:00 (date field with timezone)
- Event Location: Putnam County Fairgrounds in Cookeville, TN (rich_text field)
- Contact Name: southernmarketplaceevents@gmail.com (rich_text with mailto link)
- Status: Deposit Paid (status field, purple)
- Deposit Fee: $175 (number field)
- Deposit Received: false (checkbox field)
- Phone: null
- Email: null
- Deposit Due Date: null
- Estimated Revenue: null
- Notes: [] (empty rich_text)

---

## Internal Notes

### Context from Event Pipeline Review

This event is one of multiple festival vendor opportunities imported from Notion's Event Pipeline database. Based on the event pipeline follow-up plan and enriched card conventions established May 8, 2026:

- Daniel handles event bookings, truck staffing, and operations
- Multiple events were in "Applied" or "Deposit Paid" status with incomplete tracking
- Deposit payment verification was identified as a recurring data integrity issue
- Event organizers often don't confirm receipt of deposits promptly

### Why This Event Is HIGH Priority

1. **Financial Ambiguity:** $175 is material enough to track carefully
2. **Timeline:** 49 days is enough time to resolve but not infinite
3. **Vendor Slot Risk:** If deposit wasn't paid, slot may be forfeited
4. **Data Quality:** This inconsistency pattern may exist on other events

### Brand & Market Fit

**Positive Indicators:**
- Festival format aligns with Juke's vendor experience
- Cookeville is ~80 miles east of Nashville (drivable day trip)
- "Banana Festival" suggests quirky/fun vibe that matches brand personality
- Summer festival timing (late June) aligns with food truck season

**Questions to Resolve:**
- Expected attendance/foot traffic
- Other food vendors (competition for Nashville hot chicken)
- Power/water availability at vendor site
- Allowed menu items or restrictions

### Related Events (From Same Pipeline)

Based on enriched-cards directory and event-pipeline context:
- St Patrick's Parade Nashville (March 14, 2026 - marked Lost)
- East Nashville Beer Fest (April 11, 2026 - Applied, $150 deposit)
- Multiple summer 2026 festivals with $150-$400 deposits

### Lessons Applied from Other Cards

From the St Patrick's Parade Nashville card:
- "Lost" events should be archived quickly to avoid pipeline bloat
- Deposit deadlines need calendar reminders
- Application submission dates should be tracked

From the East Nashville Beer Fest card:
- Time-sensitive events need immediate follow-up
- Draft external communications internally first
- Owner assignment should be explicit

### Process Improvement Opportunities

**For This Event:**
1. Implement "deposit verification" step before marking status as "Deposit Paid"
2. Use deposit_received checkbox as source of truth, not status field
3. Attach payment receipts/confirmations to Notion page
4. Set calendar reminder for 30 days before event to gather logistics

**For Event Pipeline System-Wide:**
1. Add "Payment Confirmed Date" field to track when organizer confirms receipt
2. Add "Payment Method" field (check, credit card, Venmo, etc.)
3. Add "Payment Confirmation Number" field for traceability
4. Create automation: when deposit_received = true, auto-update status to "Deposit Paid"

---

## Administrative Actions

**Recommended Immediate Actions:**

1. **Verify Internal Payment Records** (Next 24 hours)
   - Check bank/CC statements for $175 payment to Southern Marketplace Events or similar
   - Search email for payment confirmations related to Tennessee Banana Festival
   - Ask John/bookkeeper if they recall making this payment

2. **Contact Event Organizer** (After internal verification, within 48 hours)
   - Use draft email above (with John's approval)
   - Request written confirmation of deposit receipt
   - Request vendor packet/logistics information

3. **Update Notion Record** (After deposit status confirmed)
   - If deposit WAS paid: Check deposit_received box, attach proof
   - If deposit was NOT paid: Change status to "Applied" or "To Pay Deposit"
   - Add note with resolution date and outcome

4. **Escalate If Needed** (If no response within 1 week)
   - Try phone contact if available
   - Check event website/social for alternate contact methods
   - Consider this a learning moment about organizer responsiveness

**Do NOT:**
- Send external communication without John's approval
- Process duplicate $175 payment without verifying first payment status
- Change Notion status without confirming actual deposit situation
- Assume deposit was paid just because status field says so

---

## Risk Assessment

**Low Risk Scenarios:**
- Deposit was paid, checkbox just wasn't ticked (data entry error) → Quick fix
- Deposit was paid, organizer slow to process/confirm → Follow-up resolves

**Medium Risk Scenarios:**
- Deposit was never paid, status updated by mistake → Need to pay ASAP to secure slot
- Deposit was paid but no proof/confirmation → May need to request duplicate receipt

**High Risk Scenarios:**
- Deposit was never paid, vendor slot was forfeited → May not be able to participate
- Deposit was paid to wrong account/lost → May need to dispute or re-pay

**Mitigation:**
- Internal payment verification (within 24 hours) eliminates most uncertainty
- 49-day buffer provides adequate time to resolve even worst-case scenario
- Direct communication with organizer is fastest path to ground truth

---

## Tags

`vendor-event` `deposit-inconsistency` `high-priority` `festival` `cookeville` `needs-verification` `daniel-owner`

---

**Card Enriched By:** jukes-social-agent  
**Enrichment Date:** May 8, 2026 21:45 UTC  
**Source Task:** t_03e15f36  
**Specification By:** jukes-librarian
