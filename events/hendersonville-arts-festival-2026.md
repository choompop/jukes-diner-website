# Hendersonville Arts Festival - Event Intake

**Status:** HOLD - Scheduling Conflict  
**Last Updated:** 2026-05-08  
**Internal Owner:** TBD - Awaiting conflict resolution

---

## Event Details

**Event Name:** Hendersonville Arts Festival  
**Event Date:** Saturday, May 9, 2026 at 10:00 AM (CT)  
**Location:** Sanders Ferry Park, Hendersonville, TN  
**Application Status:** Applied

---

## Financial Terms

**Vendor Fee Structure:** 15% of gross sales at the event  
**Deposit Required:** $400  
**Deposit Status:** NOT PAID  
**Deposit Received:** False

---

## Source & Traceability

**Notion URL:** https://www.notion.so/Hendersonville-Arts-Festival-308abed9226c808289d0de22083188ee  
**Idempotency Key:** notion:306abed9-226c-8054-99a9-000b2fb2b9ef:308abed9-226c-8082-89d0-de22083188ee  
**Import Date:** 2026-05-08  
**Database:** Event Pipeline

---

## Missing Information

**Critical Blockers:**
- [ ] Event organizer contact person (name, email, phone)
- [ ] Application confirmation or reference number
- [ ] Deposit payment deadline
- [ ] Scheduling conflict resolution (May 9 conflict with Turnip Truck 25th Anniversary)

**Operational Details Needed:**
- [ ] Vendor setup time and load-in window
- [ ] Booth/space dimensions and layout
- [ ] Power availability (110V access for warming equipment)
- [ ] Water access
- [ ] Expected attendance / foot traffic estimate
- [ ] Event hours (start/end times for vending)
- [ ] Parking and load-in/load-out logistics
- [ ] Insurance requirements
- [ ] Health permit requirements specific to event

---

## Decision Context

### Scheduling Conflict (BLOCKER)

**Conflict:** Juke's has TWO applications for May 9, 2026:
1. **Hendersonville Arts Festival** (this event)
   - Location: Sanders Ferry Park, Hendersonville, TN (30 miles NE of Nashville)
   - Deposit: $400
   - Fee: 15% of sales
   - Event type: Arts festival
   
2. **Turnip Truck 25th Anniversary Picnic** (competing event)
   - Location: Nashville (local, closer to home base)
   - Deposit: $200 (50% lower)
   - Fee: TBD
   - Event type: Grocery/community celebration
   - Brand fit: Stronger alignment (local, sustainability-focused grocer)

**Recommendation from prior analysis:** Choose Turnip Truck due to:
- Better brand alignment with local/sustainable values
- Lower financial risk ($200 vs $400 deposit)
- Nashville location (lower travel/logistics costs)
- Stronger community connection

**Action Required:** Owner (John) must make final call before either event can proceed.

---

## Next Steps (Conditional on Conflict Resolution)

### If Hendersonville is CHOSEN:
1. **Contact organizer** to confirm application status
2. **Request official vendor packet** with logistics, insurance, and permit requirements
3. **Pay $400 deposit** by deadline (TBD - need to obtain)
4. **Cancel/withdraw** Turnip Truck application
5. **Assign event coordinator** to manage logistics, staffing, menu, and operations

### If Turnip Truck is CHOSEN (recommended):
1. **Withdraw this application** from Hendersonville Arts Festival
2. **Archive this card** or move to "Not Pursuing" status
3. **Proceed with Turnip Truck** event pipeline

### If BOTH are declined:
1. **Document reason** for future reference
2. **Archive both event cards**
3. **Update event sourcing criteria** if these events don't match Juke's strategy

---

## Acceptance Criteria for Next Worker

**If event proceeds after conflict resolution:**
- [ ] Event organizer contact obtained and documented
- [ ] Deposit deadline confirmed and payment scheduled
- [ ] Full vendor packet received and reviewed
- [ ] Insurance and permit requirements identified
- [ ] Event logistics plan drafted (staffing, menu, equipment, transport)
- [ ] Financial projection completed (expected revenue vs costs)
- [ ] Event assigned to operations coordinator

**If event is declined:**
- [ ] Withdrawal notice sent to organizer (if required)
- [ ] Card archived with documented reason
- [ ] Competing event (Turnip Truck) prioritized or also declined

---

## Internal Notes

**Brand Fit Assessment:**
- Arts festival demographic may skew older/traditional vs Juke's target (younger, food-forward)
- Hendersonville is 30 miles from Nashville - requires travel logistics
- 15% of sales fee is standard but should be evaluated against expected volume

**Operational Considerations:**
- Saturday event - staffing availability?
- May 9 is 60 days out (as of March 10, 2026) - timeline is tight if deposit/logistics not resolved soon
- Need to verify if this is indoor/outdoor event (weather contingency)

**Reference Documents:**
- See `/Users/lexi/projects/jukes-diner-website/event-pipeline-follow-up-plan.md` for comparative analysis with other May events
- See `/Users/lexi/projects/jukes-diner-website/booking-calendar-review-agenda.md` for scheduling conflict details

---

## Metadata

**Created:** 2026-05-08  
**Created By:** jukes-social-agent (kanban task t_1eefb226)  
**Record Type:** Event Intake  
**Pipeline Stage:** Applied (On Hold - Conflict)  
**Timezone Note:** Event time 10:00 AM is Central Time (CT)
