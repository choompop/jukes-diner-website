# Booking Automation Roadmap & Dashboard Requirements
## Juke's Diner Internal Platform

**Created:** 2026-05-08  
**Owner:** jukes-ops-agent  
**Purpose:** Consolidate booking forms, contracts, COIs, and calendar workflows into one internal platform

---

## EXECUTIVE SUMMARY

**Current State:** Bookings managed via email + Google Calendar. Daniel handles manually.  
**Target State:** Integrated dashboard with automated intake → contract generation → COI tracking → calendar sync  
**Primary Users:** Daniel (Regional Manager), future franchisees, John (oversight)  
**Timeline:** 3-phase rollout over 8-12 weeks

---

## 1. CURRENT-STATE BOOKING WORKFLOW

### How Bookings Work Today

**Intake:**
- Booking requests arrive via email (contact@jukesdiner.com, wafflewheelsdiner@gmail.com)
- Daniel monitors inbox manually
- No structured intake form — freeform email requests
- Missing: automated triage, required field validation

**Qualification:**
- Daniel manually extracts: event date, location, guest count, event type
- Informal back-and-forth to gather missing details
- Pricing calculated manually (no calculator)
- Quote sent via email reply

**Contract & COI:**
- No contract template in use
- COI (Certificate of Insurance) managed separately
  - Current provider: Goosehead Insurance (Sarah Miller, 555-019-8877)
  - COI requirement: Name "Juke's Diner Franchise LLC" as additionally insured
  - Manual request per event/venue when needed
- No digital signature workflow
- No document storage system

**Calendar:**
- Events added manually to Google Calendar (wafflewheelsdiner@gmail.com)
- Calendar embedded on public website (jukesdiner.com/find-us)
- No internal-only view with booking status

**Handoffs:**
- Daniel coordinates: booking confirmation → prep checklist → event execution → follow-up
- No task automation or team notifications
- Over-reliance on Daniel's memory and manual tracking

### Current Pain Points
1. **Manual data entry** — Re-typing event details across email, calendar, prep docs
2. **Missing information** — No required fields = back-and-forth delays
3. **No pipeline visibility** — Can't see booking funnel (inquiry → quote → confirmed)
4. **Document chaos** — COIs and contracts (when used) stored in email/Drive with no index
5. **Pricing inconsistency** — No standardized calculator
6. **Scalability blocker** — Process doesn't work for multiple operators/franchisees

---

## 2. TARGET-STATE AUTOMATED BOOKING WORKFLOW

### End-to-End Flow (Vision)

```
PUBLIC FORM → DASHBOARD INBOX → QUALIFICATION → QUOTE → CONTRACT → COI → CALENDAR → PREP
```

### Step-by-Step Target Process

#### A. Public Booking Form
**Trigger:** Customer visits jukesdiner.com/book (new page)

**Fields (required):**
- Event type (dropdown: Wedding, Corporate, Birthday, Brewery/Public, School, Other)
- Event date
- Event time (start)
- Location (address or venue name)
- Estimated guest count
- Contact name
- Contact email
- Contact phone

**Fields (optional):**
- Duration (hours)
- Service style (full service, self-serve, buffet)
- Menu preferences/dietary needs
- Budget range
- Additional notes

**Action:** Form submission creates booking record in dashboard with status: "New Inquiry"

#### B. Dashboard Booking Inbox
**User:** Daniel (or assigned operator)

**View:** Table of booking inquiries with columns:
- Status (New, Quoted, Contract Sent, Confirmed, Completed, Cancelled)
- Customer name
- Event type
- Event date
- Guest count
- Quote value
- Actions (View Details, Send Quote, Mark Status)

**Filters:**
- Status
- Date range
- Event type
- Assigned operator (for multi-location future)

**Action:** Click inquiry to open detail view

#### C. Booking Detail View & Qualification
**Display:**
- All submitted form fields
- Contact info (with click-to-call, click-to-email)
- Pricing calculator (pre-filled with guest count, duration from form)
- Internal notes field (for Daniel's context)
- Event timeline (inquiry date, quote sent date, contract sent date, confirmed date)

**Pricing Calculator (embedded):**
- Guest count (from form, editable)
- Duration (hours)
- Menu tier (Standard, Premium, Custom)
  - Standard: Burger + Fries
  - Premium: Burger + Fries + Shake
  - Custom: manual pricing
- Travel distance (miles from base location)
- Service fee toggle
- **Output:** Suggested quote (real-time calculation)

**Formula (baseline):**
```
Base = Guest Count × Menu Tier Price
Travel = Distance > 20 miles ? (Distance - 20) × $2/mile : $0
Service Fee = Base × 15%
Total Quote = Base + Travel + Service Fee
```

**Menu Tier Pricing (example, needs John's input):**
- Standard: $12/person
- Premium: $18/person
- Custom: manual entry

**Action:** Generate quote → Send quote email to customer

#### D. Contract Generation
**Trigger:** Booking status changed to "Contract Sent"

**Process:**
1. Auto-populate contract template with:
   - Customer name, contact info
   - Event date, time, location
   - Guest count, menu tier
   - Quote amount
   - Payment terms (deposit, balance due date)
   - Cancellation policy
   - Liability waiver
2. Generate PDF
3. Send via DocuSign or HelloSign (digital signature)
4. Customer signs electronically
5. Signed contract auto-filed in dashboard under booking record

**Contract Template Requirements:**
- Standard terms (Juke's Diner Franchise LLC legal entity)
- Payment schedule (50% deposit, 50% due 7 days before event — **needs John approval**)
- Cancellation/refund policy (**needs John input**)
- Food safety waiver
- Venue access requirements
- Equipment/power requirements

**Blocker:** No contract template exists today. Needs legal review (Joel Buckberg, Baker Donnelson).

#### E. COI (Certificate of Insurance) Tracking
**Trigger:** Contract signed → COI requested (for certain event types)

**COI Requirements (per venue/event type):**
- Corporate events: COI required (venue asks for it)
- Weddings: Often required
- Breweries/public events: Sometimes required
- Private parties: Rarely required

**Process:**
1. Dashboard flags events requiring COI (based on event type or venue)
2. Operator requests COI from Goosehead Insurance (Sarah Miller)
   - Booking details auto-populated in request template
   - Additional insured: "Juke's Diner Franchise LLC" + venue name (if required)
3. COI received (PDF) → uploaded to dashboard under booking record
4. Status updated: "COI on File"

**Dashboard COI Management:**
- Upload COI PDF (linked to booking)
- View all COIs in separate tab (searchable by event, date, venue)
- Expiration tracking (flag if COI expires before event date)
- Reusable COIs (if same venue hosts multiple events)

**Current COI Provider:**
- Goosehead Insurance
- Agent: Sarah Miller
- Phone: (555) 019-8877
- Coverage: General Liability ($1M/$2M), Commercial Auto ($1M CSL)
- Named Insured: Juke's Diner Franchise LLC

#### F. Google Calendar Sync
**Trigger:** Booking status = "Confirmed"

**Process:**
1. Auto-create Google Calendar event on wafflewheelsdiner@gmail.com
2. Event details:
   - Title: "[EVENT TYPE] - [CUSTOMER NAME]" (e.g., "Wedding - Sarah Jenkins")
   - Date/Time: from booking
   - Location: event address
   - Description: Guest count, menu tier, internal notes
   - Internal-only fields: quote amount, contract status, COI status (NOT public)
3. Public calendar (jukesdiner.com/find-us) shows title, date, location only
4. Dashboard calendar view shows full details including revenue

**Two-Way Sync:**
- Dashboard changes → update Google Calendar
- Cancellations → remove from calendar (or mark "Cancelled" in title)

**Future Enhancement (Phase 3):**
- Read existing Google Calendar events into dashboard (backfill historical bookings)

#### G. Event Prep Checklist
**Trigger:** Event date within 7 days → auto-generate prep checklist

**Checklist Items (example, needs Daniel input):**
- [ ] Confirm final guest count (72 hours before)
- [ ] Prep shopping list (menu tier × guest count)
- [ ] Vehicle/equipment check
- [ ] Confirm event location access (parking, power, setup time)
- [ ] Assign staff (if applicable)
- [ ] Load truck day-of

**Dashboard View:**
- "Upcoming Events" widget on home screen
- Click event → see prep checklist
- Check off items as completed
- Notifications (optional): 7 days out, 3 days out, 1 day out

---

## 3. REQUIRED DOCUMENTS & ASSETS

### Legal Documents
| Document | Status | Owner | Notes |
|----------|--------|-------|-------|
| **Booking Contract Template** | ❌ Not Created | John + Joel Buckberg (lawyer) | Must include: payment terms, cancellation policy, liability waiver, equipment/access requirements |
| **COI Request Template** | ⚠️ Partial (insurance-request-TL-industries.md) | jukes-ops-agent | Exists for T&L Industries (Justin), needs genericized for all events |
| **Cancellation/Refund Policy** | ❌ Not Defined | John | Required for contract and website |
| **Liability Waiver Language** | ❌ Not Created | Joel Buckberg (lawyer) | Food safety, venue damage, equipment liability |

**Legal Blocker:** Joel Buckberg owed $11k (unpaid until Justin funding cleared). May need advance payment or alternate lawyer.

### Pricing Assets
| Asset | Status | Owner | Notes |
|-------|--------|-------|-------|
| **Menu Tier Pricing** | ⚠️ Placeholder | John + Daniel | Standard/Premium/Custom price per person (currently using placeholder $12/$18) |
| **Travel Fee Policy** | ⚠️ Placeholder | John | Currently: $2/mile beyond 20 miles (needs confirmation) |
| **Service Fee %** | ⚠️ Placeholder | John | Currently: 15% (needs confirmation) |
| **Deposit/Payment Terms** | ❌ Not Defined | John | Recommendation: 50% deposit at signing, 50% due 7 days before event |
| **Minimum Booking Size** | ❌ Not Defined | Daniel + John | Is there a minimum guest count or minimum revenue? |

### Operational Assets
| Asset | Status | Owner | Notes |
|-------|--------|-------|-------|
| **Event Prep Checklist** | ❌ Not Created | Daniel | Step-by-step checklist for 7 days before → day-of event |
| **Shopping List Template** | ❌ Not Created | Daniel | Per-person ingredient quantities for menu tiers |
| **Equipment Checklist** | ❌ Not Created | Daniel | Truck equipment, tables, serving supplies |
| **Venue Requirements Doc** | ❌ Not Created | Daniel | Power, parking, setup time, access gates |

### Insurance Assets
| Asset | Status | Owner | Notes |
|-------|--------|-------|-------|
| **Master COI (Juke's Diner Franchise LLC)** | ⚠️ Unknown | John | Need to confirm: Does Juke's have a master GL policy? Or only per-operator? |
| **COI Request Workflow** | ⚠️ Partial | jukes-ops-agent | insurance-request-TL-industries.md covers T&L Industries; needs event-specific variant |
| **Venue COI Requirements Matrix** | ❌ Not Created | Daniel | Which venues/event types require COI? (Corporate always, weddings often, private parties rarely) |

---

## 4. INTERNAL DASHBOARD MODULES

### Module 1: Booking Inbox
**Purpose:** Triage and manage incoming booking requests

**Features:**
- Table view of all inquiries (status, customer, event date, guest count, quote)
- Filters: Status, Date Range, Event Type, Operator (future multi-location)
- Search: Customer name, location, event type
- Bulk actions: Mark as quoted, mark as spam
- New booking badge (unread count)

**Data Fields (per booking):**
- ID (auto-generated)
- Status (New Inquiry, Quoted, Contract Sent, Confirmed, Completed, Cancelled)
- Customer name, email, phone
- Event type, date, time, location
- Guest count, duration (hours)
- Menu tier, dietary notes
- Quote amount (calculated or manual)
- Internal notes
- Timestamps: inquiry created, quote sent, contract sent, confirmed, event date, completed
- Assigned operator (for multi-location)
- Files: contract (PDF), COI (PDF), signed contract (PDF)

**Status Workflow:**
```
New Inquiry → Quoted → Contract Sent → Confirmed → Completed
                  ↓
              Cancelled (any stage)
```

**UI Mockup (exists):** /app/dashboard/bookings/page.tsx (lines 58-88)  
**Current State:** Hardcoded placeholder data (Sarah Jenkins, TechCorp, Mike Ross)

---

### Module 2: Contracts & COIs
**Purpose:** Manage legal documents per booking

**Tab 1: Contracts**
- List of all contracts (linked to bookings)
- Columns: Booking ID, Customer, Event Date, Contract Status (Draft, Sent, Signed), Date Signed
- Actions: Generate Contract, Send for Signature, Download PDF, View Signed Copy
- Digital Signature Integration: DocuSign or HelloSign API

**Tab 2: COIs (Certificates of Insurance)**
- List of all COIs (linked to bookings)
- Columns: Booking ID, Event Date, Venue, COI Status (Requested, On File, Expired), Expiration Date
- Actions: Request COI (email template to Goosehead), Upload COI PDF, Download PDF
- Expiration Alerts: Flag COIs expiring within 30 days

**File Storage:**
- Store contract PDFs and COI PDFs in `/data/bookings/[booking-id]/` (local) or cloud (AWS S3, Google Drive)
- Link files to booking record in database

**UI Mockup (exists):** /app/dashboard/bookings/page.tsx (line 120-124)  
**Current State:** Placeholder "INTEGRATING..." message

---

### Module 3: Pricing Calculator
**Purpose:** Generate quotes in real-time

**Inputs:**
- Guest count (required)
- Duration (hours, default: 3)
- Menu tier (Standard, Premium, Custom)
- Travel distance (miles from base, auto-calculated from address if possible)
- Service fee (toggle, default: on)

**Calculation (live update):**
```javascript
const basePrice = guestCount * menuTierPrice[tier];
const travelFee = distance > 20 ? (distance - 20) * 2 : 0;
const serviceFee = includeServiceFee ? basePrice * 0.15 : 0;
const totalQuote = basePrice + travelFee + serviceFee;
```

**Output:**
- Suggested Quote: $X,XXX.XX
- Breakdown:
  - Base (guests × tier): $X,XXX
  - Travel (miles × rate): $XXX
  - Service fee (15%): $XXX
- Editable: Allow manual override
- Save quote to booking record
- Generate quote email (template with breakdown)

**UI Mockup (exists):** /app/dashboard/bookings/page.tsx (lines 91-118)  
**Current State:** Static placeholder ($1,850 hardcoded), no calculation logic

**Integration Needs:**
- Store menu tier pricing in config (database or .env)
- Store travel rate and service fee % in config
- Auto-calculate distance from event address (Google Maps API or similar)

---

### Module 4: Google Calendar Integration
**Purpose:** Sync confirmed bookings to public/internal calendars

**Features:**
- Auto-create calendar event on booking confirmation
- Two-way sync: Dashboard ↔ Google Calendar
- Public calendar (jukesdiner.com/find-us): Show title, date, location only
- Internal calendar (dashboard view): Show full details (guest count, revenue, status)

**Calendar Views:**
- **Month View:** See all confirmed events
- **Week View:** Upcoming events with prep status
- **List View:** Filterable/searchable event log

**Google Calendar Setup:**
- Account: wafflewheelsdiner@gmail.com (existing)
- OAuth: google-workspace skill (currently incomplete per session search)
  - Blocker: Missing `google_client_secret.json` and `google_token.json`
  - Resolution: Complete Google Cloud Console OAuth setup

**Event Fields (Google Calendar):**
- Summary: "[EVENT TYPE] - [CUSTOMER NAME]"
- Date/Time: from booking
- Location: event address
- Description: Guest count, menu tier, quote, internal notes, prep checklist link
- Visibility: Public (title/date/location) vs Private (full details)

**UI Mockup (exists):** /app/dashboard/bookings/page.tsx (line 120-124)  
**Current State:** Placeholder "INTEGRATING..." message

**Tech Debt:**
- Dashboard currently shows hardcoded events (Sarah Jenkins wedding, TechCorp corporate, Mike Ross birthday)
- Need to replace with real data from database + Google Calendar sync

---

### Module 5: Booking Dashboard (Home/Overview)
**Purpose:** At-a-glance pipeline health and next actions

**Widgets:**
1. **Pipeline Summary**
   - New Inquiries (count)
   - Quoted (count)
   - Awaiting Contract Signature (count)
   - Confirmed Bookings (count)
   - Revenue This Month (sum of confirmed bookings)
   - Revenue Next 30 Days (sum of upcoming events)

2. **Upcoming Events (Next 7 Days)**
   - Event name, date, guest count
   - Prep status: Not Started, In Progress, Ready
   - Click to view prep checklist

3. **Action Items**
   - Inquiries awaiting quote (> 24 hours old)
   - Contracts sent but not signed (> 3 days)
   - COIs needed (event within 14 days, no COI on file)
   - Events within 7 days (prep reminder)

4. **Recent Activity**
   - Last 10 booking events (inquiry received, quote sent, contract signed, event completed)

**Access Control (future):**
- Multi-operator: Each operator sees only their bookings
- Admin (John): Sees all bookings across all operators/locations

---

## 5. DEPENDENCIES & INTEGRATIONS

### A. Google Calendar OAuth
**Status:** ❌ Incomplete  
**Blocker:** Missing `google_client_secret.json` and `google_token.json`  
**Resolution Steps:**
1. Go to Google Cloud Console (console.cloud.google.com)
2. Create project (or use existing: "Juke's Diner Dashboard")
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials (Desktop or Web App)
5. Download `client_secret.json` → rename to `google_client_secret.json`
6. Run OAuth flow to generate `google_token.json` (via google-workspace skill)
7. Store credentials securely (.env.local, not committed to git)

**Account:** wafflewheelsdiner@gmail.com  
**Skill Reference:** `google-workspace` (exists in Hermes skills)

---

### B. Digital Signature Service
**Status:** ❌ Not Configured  
**Options:**
1. **DocuSign** (industry standard, $10-40/month per user)
2. **HelloSign** (Dropbox, $15/month per user, simpler API)
3. **PandaDoc** ($19-49/month, includes contract templates + e-sign)
4. **Adobe Sign** (enterprise, overkill for Juke's)

**Recommendation:** HelloSign (balance of cost, simplicity, API quality)

**Integration Requirements:**
- API key
- Template upload (booking contract)
- Webhook for signature completion (updates booking status in dashboard)
- PDF download of signed contract

**Decision Needed:** John to select provider and budget ($15-20/month)

---

### C. Database (Booking Records)
**Status:** ⚠️ Partial (Supabase schema exists, booking table TBD)

**Current Database:** Supabase (supabase-schema.sql exists in repo root)

**Required Tables:**

**`bookings`**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL, -- new_inquiry, quoted, contract_sent, confirmed, completed, cancelled
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  event_type TEXT NOT NULL, -- wedding, corporate, birthday, brewery, school, other
  event_date DATE NOT NULL,
  event_time TIME,
  event_location TEXT NOT NULL,
  guest_count INTEGER,
  duration_hours NUMERIC(3,1),
  menu_tier TEXT, -- standard, premium, custom
  dietary_notes TEXT,
  budget_range TEXT,
  additional_notes TEXT,
  quote_amount NUMERIC(10,2),
  internal_notes TEXT,
  assigned_operator TEXT, -- future: link to user table
  inquiry_created_at TIMESTAMP DEFAULT NOW(),
  quote_sent_at TIMESTAMP,
  contract_sent_at TIMESTAMP,
  contract_signed_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  event_completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**`booking_files`**
```sql
CREATE TABLE booking_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL, -- contract_draft, contract_signed, coi, other
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- /data/bookings/[booking-id]/[file-name]
  uploaded_at TIMESTAMP DEFAULT NOW(),
  uploaded_by TEXT
);
```

**`cois` (Certificates of Insurance)**
```sql
CREATE TABLE cois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  venue_name TEXT,
  requested_at TIMESTAMP,
  received_at TIMESTAMP,
  expiration_date DATE,
  file_path TEXT,
  status TEXT NOT NULL, -- requested, on_file, expired
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Migration Plan:**
1. Create tables in Supabase (add to supabase-schema.sql)
2. Create API routes in Next.js:
   - `POST /api/bookings` (create new booking from form)
   - `GET /api/bookings` (list all, with filters)
   - `GET /api/bookings/[id]` (get one booking detail)
   - `PATCH /api/bookings/[id]` (update status, quote, notes)
   - `POST /api/bookings/[id]/files` (upload contract/COI)
   - `GET /api/bookings/[id]/files` (list files for booking)
3. Wire up dashboard UI to API routes

---

### D. Email Template System
**Status:** ❌ Not Built

**Required Email Templates:**
1. **Quote Email** (to customer after quote generated)
   - Subject: "Your Juke's Diner Event Quote - [EVENT DATE]"
   - Body: Event details, quote breakdown, next steps (contract signing)
2. **Contract Email** (to customer with DocuSign/HelloSign link)
   - Subject: "Sign Your Juke's Diner Event Contract - [EVENT DATE]"
   - Body: Contract link, event details, payment terms
3. **Confirmation Email** (to customer after contract signed)
   - Subject: "Booking Confirmed! Juke's Diner - [EVENT DATE]"
   - Body: Event details, what to expect, contact info for changes
4. **COI Request Email** (internal, to Goosehead Insurance)
   - Subject: "COI Request - Juke's Diner Event [EVENT DATE]"
   - Body: Event details, venue name, additional insured requirements
5. **Event Reminder Email** (to customer 7 days before)
   - Subject: "Your Juke's Diner Event is 1 Week Away!"
   - Body: Final guest count confirmation, event details, contact info

**Implementation:**
- Store templates in `/lib/email-templates/` (mustache or handlebars syntax)
- Use Resend API or similar for sending (or SMTP via google-workspace)
- Merge booking data into templates

---

### E. Public Booking Form
**Status:** ❌ Not Built

**Location:** jukesdiner.com/book (new page)

**Design:**
- Clean, mobile-friendly form (match existing brand: diner-red, diner-cream, diner-black)
- Progress indicator (if multi-step) or single-page form
- Real-time validation (required fields, date picker, phone format)
- Submit → "Thank you" confirmation → email notification to Daniel

**Form Fields:** (see Section 2A above)

**Backend:**
- Form submission → POST /api/bookings → create booking record in Supabase
- Send notification email to Daniel (or assigned operator)
- Auto-reply to customer: "We received your inquiry, expect a quote within 24 hours"

**Integration with Existing Site:**
- Add "Book an Event" CTA to homepage (jukesdiner.com)
- Update navigation menu with "Book" link
- Ensure form accessible from /book route

---

## 6. BLOCKERS, RISKS & OPEN QUESTIONS

### Blockers (Work Cannot Proceed Until Resolved)

| # | Blocker | Owner | Impact | Resolution Path |
|---|---------|-------|--------|-----------------|
| 1 | **No contract template** | John + Joel Buckberg | Cannot automate contract generation | John to engage Joel (or alternate lawyer) to draft standard booking contract. Est. cost: $1k-2k. |
| 2 | **Pricing not finalized** | John + Daniel | Calculator produces inaccurate quotes | John and Daniel to define: menu tier pricing, travel fee, service fee %, deposit %, minimum booking size. Deliver as config file. |
| 3 | **Payment terms undefined** | John | Contract and quote emails incomplete | John to decide: deposit % (recommend 50%), balance due timing (recommend 7 days before event), payment methods accepted (Venmo, Zelle, check, card?). |
| 4 | **Cancellation/refund policy missing** | John | Contract incomplete, customer disputes risk | John to define: refund policy (e.g., 100% refund if >30 days out, 50% if 14-30 days, 0% if <14 days). Needs legal review. |
| 5 | **Digital signature service not selected** | John | Cannot send contracts for signature | John to choose: HelloSign ($15/mo), DocuSign ($40/mo), or PandaDoc ($19/mo). Budget approval needed. |
| 6 | **Google Calendar OAuth incomplete** | jukes-ops-agent | Cannot sync bookings to calendar | Complete google-workspace skill setup: generate `google_client_secret.json` and `google_token.json` via Google Cloud Console. |

---

### Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | **Scope creep** — Dashboard grows into CRM | Medium | High (delays launch) | Lock scope to booking workflow only. Defer: customer relationship tracking, marketing automation, multi-location management. |
| 2 | **Legal liability** — Contract template inadequate | Medium | Critical (lawsuit if contract fails) | Require lawyer review (Joel Buckberg or alternate). Do not launch without legal sign-off. |
| 3 | **Daniel adoption resistance** — Prefers email | Low | High (tool unused) | Involve Daniel early: demo builds, gather feedback, ensure mobile-friendly (Daniel works from truck). |
| 4 | **Database/API failures** — Booking lost | Low | High (revenue loss) | Implement email fallback: form submission emails raw data to Daniel even if DB write fails. |
| 5 | **COI delays** — Insurance slow to issue | Medium | Medium (event blocked) | Build COI request 14+ days before event (not last-minute). Track expiration dates. |
| 6 | **Payment integration complexity** — Stripe/Square integration | Low | Medium (manual payment remains) | Phase 1: Skip payment integration. Accept deposits manually (Venmo/Zelle). Phase 2: Add Stripe/Square if demand justifies. |

---

### Open Questions for John

| # | Question | Context | Decision Needed |
|---|----------|---------|-----------------|
| 1 | **What are the actual menu tier prices?** | Calculator uses placeholder $12 (standard), $18 (premium) | Confirm per-person pricing for Standard and Premium tiers. |
| 2 | **What is the deposit %?** | Recommendation: 50% at contract signing | Confirm: 50%, or different %? |
| 3 | **When is balance due?** | Recommendation: 7 days before event | Confirm: 7 days, or different timing (e.g., day-of, 14 days)? |
| 4 | **What is the cancellation/refund policy?** | Example: 100% refund >30 days, 50% 14-30 days, 0% <14 days | Define policy tiers (days out → refund %). Needs legal review. |
| 5 | **What payment methods are accepted?** | Currently: Venmo, Zelle, check (assumed) | Confirm accepted methods. Add Stripe/Square card processing? (Phase 2 candidate) |
| 6 | **Is there a minimum booking size?** | Avoid small/unprofitable events | Define: minimum guest count (e.g., 25 guests) or minimum revenue (e.g., $500)? |
| 7 | **What is the travel fee policy?** | Placeholder: $2/mile beyond 20 miles | Confirm rate and free radius. Different for different locations (event truck vs trailer park)? |
| 8 | **What is the service fee %?** | Placeholder: 15% | Confirm: 15%, or different %? Or no service fee (bake into pricing)? |
| 9 | **Which events require COI?** | Corporate/weddings often require, private parties rarely | Define event type rules: always, sometimes, never. Venue-specific list? |
| 10 | **Who should receive booking notifications?** | Currently: Daniel (manual email check) | Confirm: Daniel only, or also John? Slack notification? Email? SMS? |

---

### Open Questions for Daniel

| # | Question | Context | Decision Needed |
|---|----------|---------|-----------------|
| 1 | **What is the event prep checklist?** | 7 days before → day-of tasks | Provide step-by-step checklist (confirm guest count, shopping list, equipment check, staff assignment, etc.). |
| 2 | **What are the per-person ingredient quantities?** | For shopping list auto-generation | Provide: burgers per person, fries (lbs) per person, shakes per person, etc. by menu tier. |
| 3 | **What equipment is needed per event?** | Truck + tables + serving supplies | Provide equipment checklist (what's in truck, what needs to be loaded separately). |
| 4 | **What are venue access requirements?** | Power, parking, setup time | Provide standard venue requirements doc (to include in contract or send to customer before event). |
| 5 | **Which venues have you worked with before?** | For COI requirements matrix | List past venues and whether COI was required (helps build "event type → COI needed" rules). |

---

## 7. IMPLEMENTATION ROADMAP (3 Phases)

### PHASE 1: INTAKE & PIPELINE VISIBILITY (Weeks 1-4)
**Goal:** Replace email chaos with structured booking inbox and quote workflow

**Deliverables:**
1. **Public Booking Form** (jukesdiner.com/book)
   - Required fields capture
   - Form submission → database record
   - Auto-reply to customer ("We received your inquiry")
   - Notification to Daniel (email or Slack)

2. **Booking Inbox (Dashboard)**
   - Table view of all inquiries (status, customer, event date, guest count)
   - Filters: Status, Date Range, Event Type
   - Search by customer name

3. **Booking Detail View**
   - Display all form fields
   - Internal notes field
   - Status dropdown (New Inquiry → Quoted → Contract Sent → Confirmed → Completed → Cancelled)
   - Timeline view (inquiry date, quote sent date, contract sent date, confirmed date)

4. **Pricing Calculator (Dashboard)**
   - Embedded in booking detail view
   - Guest count, duration, menu tier inputs
   - Real-time quote calculation (base + travel + service fee)
   - Manual override (editable quote)
   - Save quote to booking record

5. **Quote Email Template**
   - Auto-populate event details
   - Quote breakdown (base, travel, service fee, total)
   - Send via "Send Quote" button in dashboard
   - Log "quote sent" timestamp

6. **Database Tables**
   - `bookings` table (see schema in Section 5C)
   - API routes: POST /api/bookings, GET /api/bookings, GET /api/bookings/[id], PATCH /api/bookings/[id]

**Dependencies:**
- ✅ Menu tier pricing finalized (John + Daniel) — **BLOCKER 2**
- ✅ Travel fee and service fee % confirmed (John) — **BLOCKER 2**
- Supabase schema updated and deployed
- Email sending configured (Resend API or SMTP)

**Success Criteria:**
- New booking inquiry submitted via form → appears in dashboard within 1 minute
- Daniel can generate quote in <2 minutes (no manual math)
- Quote email sent to customer with accurate pricing
- All bookings visible in one place (no more email/calendar hunting)

**Timeline:** 4 weeks (includes John decision-making on pricing)

---

### PHASE 2: CONTRACTS & COI TRACKING (Weeks 5-8)
**Goal:** Automate contract generation, digital signature, and COI management

**Deliverables:**
1. **Contract Template**
   - Standard booking contract (legal-reviewed)
   - Payment terms, cancellation policy, liability waiver
   - Stored as template file (PDF or HTML → PDF)

2. **Contract Generation (Dashboard)**
   - "Generate Contract" button in booking detail view
   - Auto-populate customer name, event details, quote amount, payment terms
   - Generate PDF
   - Store draft contract in `/data/bookings/[booking-id]/contract-draft.pdf`

3. **Digital Signature Integration**
   - HelloSign API (or selected provider)
   - "Send for Signature" button → uploads contract to HelloSign, emails customer
   - Webhook: customer signs → dashboard updates status to "Contract Signed"
   - Download signed contract PDF → store in `/data/bookings/[booking-id]/contract-signed.pdf`

4. **Contract Email Template**
   - Subject: "Sign Your Juke's Diner Event Contract"
   - Body: Event details, signature link, payment instructions
   - Sent automatically when "Send for Signature" clicked

5. **Confirmation Email Template**
   - Sent automatically when contract signed (webhook trigger)
   - Subject: "Booking Confirmed!"
   - Body: Event details, next steps, contact info

6. **Contracts & COIs Tab (Dashboard)**
   - List all contracts (booking ID, customer, event date, contract status, date signed)
   - List all COIs (booking ID, event date, COI status, expiration date)
   - Upload COI PDF manually (link to booking)
   - Download contract/COI PDFs

7. **COI Request Email Template**
   - Subject: "COI Request - Juke's Diner Event [DATE]"
   - Body: Event details, venue name, additional insured (Juke's Diner Franchise LLC + venue if required)
   - Send to Goosehead Insurance (Sarah Miller)

8. **COI Tracking**
   - `cois` table (see schema in Section 5C)
   - Upload COI PDF → links to booking, stores expiration date
   - Expiration alert: flag COIs expiring within 30 days

**Dependencies:**
- ✅ Contract template drafted and legal-reviewed (John + Joel Buckberg) — **BLOCKER 1**
- ✅ Payment terms finalized (deposit %, balance due timing) — **BLOCKER 3**
- ✅ Cancellation/refund policy defined — **BLOCKER 4**
- ✅ Digital signature service selected and account created (John) — **BLOCKER 5**
- HelloSign API credentials configured in .env.local
- File storage configured (local /data/bookings/ or AWS S3)

**Success Criteria:**
- Contract generated and sent for signature in <5 minutes after quote accepted
- Customer receives signature request email within 1 minute
- Signed contract auto-downloads and links to booking record
- COI uploaded and linked to booking, expiration tracked
- No manual PDF emailing (all via dashboard)

**Timeline:** 4 weeks (includes legal review and signature service setup)

---

### PHASE 3: CALENDAR SYNC & EVENT PREP (Weeks 9-12)
**Goal:** Sync bookings to Google Calendar and automate event prep checklists

**Deliverables:**
1. **Google Calendar OAuth Setup**
   - Complete google-workspace skill configuration
   - Generate `google_client_secret.json` and `google_token.json`
   - Test calendar read/write access to wafflewheelsdiner@gmail.com

2. **Calendar Sync (Dashboard → Google Calendar)**
   - When booking status = "Confirmed" → auto-create Google Calendar event
   - Event title: "[EVENT TYPE] - [CUSTOMER NAME]"
   - Event date/time, location from booking
   - Event description: guest count, menu tier, internal notes (internal calendar only)
   - Public calendar (jukesdiner.com/find-us): show title, date, location only

3. **Calendar Tab (Dashboard)**
   - Month/Week/List views of confirmed bookings
   - Filter by date range, event type
   - Click event → open booking detail view
   - Revenue overlay: show total revenue per day/week/month

4. **Event Prep Checklist (Dashboard)**
   - Auto-generate checklist 7 days before event
   - Checklist items from Daniel's template (see Open Questions for Daniel #1)
   - Display in booking detail view
   - Mark items complete
   - Progress indicator (e.g., "3 of 7 tasks complete")

5. **Upcoming Events Widget (Dashboard Home)**
   - Show next 7 days of confirmed events
   - Event name, date, guest count
   - Prep status: Not Started, In Progress, Ready
   - Click to view prep checklist

6. **Event Reminder Email Template**
   - Sent automatically 7 days before event
   - Subject: "Your Juke's Diner Event is 1 Week Away!"
   - Body: Confirm final guest count, event details, contact info for changes

7. **Action Items Widget (Dashboard Home)**
   - Inquiries awaiting quote (> 24 hours old)
   - Contracts sent but not signed (> 3 days)
   - COIs needed (event within 14 days, no COI on file)
   - Events within 7 days (prep reminder)

**Dependencies:**
- ✅ Google Calendar OAuth complete — **BLOCKER 6**
- ✅ Event prep checklist provided by Daniel (see Open Questions for Daniel #1)
- Calendar API integration tested
- Email automation configured (7-day reminder trigger)

**Success Criteria:**
- Confirmed booking → appears on Google Calendar within 1 minute
- Public calendar (jukesdiner.com/find-us) shows events accurately
- Daniel sees prep checklist 7 days before event
- Action items widget flags stale inquiries and missing COIs
- No manual calendar entry (100% automated)

**Timeline:** 4 weeks (includes Google OAuth setup and checklist automation)

---

## 8. POST-LAUNCH ENHANCEMENTS (Phase 4+, Future)

These are **out of scope** for initial launch but valuable for future iterations:

### 4A. Payment Integration
- Stripe or Square integration for online deposit payment
- Customer pays 50% deposit when signing contract (card or ACH)
- Auto-send payment link in contract email
- Dashboard shows payment status (Deposit Paid, Balance Due, Paid in Full)

### 4B. Multi-Location / Multi-Operator
- Assign bookings to specific operators (Daniel, Justin, Location 3)
- Operator-specific dashboards (only see their bookings)
- Admin dashboard for John (see all bookings across all locations)
- Revenue reporting per operator

### 4C. Customer Relationship Tracking
- Customer database (separate from bookings)
- Track repeat customers (link multiple bookings to one customer)
- Customer notes (dietary preferences, special requests, VIP status)
- Email marketing integration (Mailchimp, ConvertKit)

### 4D. Advanced Reporting & Analytics
- Revenue by month/quarter
- Booking conversion rate (inquiry → confirmed)
- Average booking size (guest count, revenue)
- Event type breakdown (weddings vs corporate vs private)
- Booking lead time (days between inquiry and event date)

### 4E. Automated Reminders & Follow-Ups
- 72-hour reminder to confirm final guest count
- Day-of reminder to customer (event logistics)
- Post-event follow-up email (thank you, request review/referral)
- Inquiry follow-up (if quote sent but no response after 3 days)

### 4F. Mobile App
- Native iOS/Android app for Daniel (manage bookings from truck)
- Push notifications for new inquiries, signed contracts
- Offline mode for event day (checklist works without internet)

### 4G. Menu Builder
- Dynamic menu creation (customer selects items à la carte)
- Dietary restriction filters (gluten-free, vegan, etc.)
- Menu preview/mockup for customer

### 4H. Staff Scheduling
- Assign staff to events (if Daniel hires helpers)
- Staff availability calendar
- Labor cost tracking (hours × rate per event)

---

## 9. SUMMARY & NEXT ACTIONS

### What This Roadmap Delivers
1. **Structured intake** — Public form replaces freeform email chaos
2. **Pipeline visibility** — Dashboard inbox shows all bookings in one place
3. **Automated quoting** — Calculator + email template = faster quotes
4. **Contract workflow** — Digital signature integration eliminates manual PDFs
5. **COI tracking** — Organized document management, expiration alerts
6. **Calendar sync** — Confirmed bookings auto-populate Google Calendar
7. **Event prep** — Checklists ensure nothing is forgotten

### What This Roadmap Does NOT Include (Intentionally Out of Scope)
- Payment processing (Stripe/Square integration) — **Phase 4A**
- Multi-location management — **Phase 4B**
- Customer CRM — **Phase 4C**
- Advanced analytics — **Phase 4D**
- Mobile app — **Phase 4F**

### Critical Path to Launch
1. **John: Resolve Blockers 1-5** (contract template, pricing, payment terms, cancellation policy, digital signature service)
2. **Daniel: Provide operational inputs** (prep checklist, ingredient quantities, equipment list, venue requirements)
3. **jukes-ops-agent: Complete Google OAuth setup** (Blocker 6)
4. **jukes-coding-agent: Build Phase 1** (booking form, inbox, calculator, quote workflow)
5. **jukes-coding-agent: Build Phase 2** (contract generation, digital signature, COI tracking)
6. **jukes-coding-agent: Build Phase 3** (calendar sync, prep checklists, action items)

### Immediate Next Steps (This Week)
1. **John: Review this roadmap** and confirm/adjust priorities
2. **John: Schedule decisions** on open questions (pricing, payment terms, cancellation policy)
3. **John: Engage lawyer** (Joel Buckberg or alternate) for contract template draft
4. **John: Select digital signature service** (HelloSign recommended, $15/mo)
5. **jukes-ops-agent: Complete Google Calendar OAuth** (generate credentials, test sync)
6. **Daniel: Draft event prep checklist** (send to John or post in Slack #jukes-ops)

### Timeline Summary
- **Phase 1 (Intake & Pipeline):** Weeks 1-4 (depends on John finalizing pricing)
- **Phase 2 (Contracts & COI):** Weeks 5-8 (depends on legal review)
- **Phase 3 (Calendar & Prep):** Weeks 9-12
- **Total:** 8-12 weeks to full booking automation platform

---

## APPENDIX A: RELATED FILES IN REPO

| File | Purpose | Status |
|------|---------|--------|
| `/app/dashboard/bookings/page.tsx` | Booking Inbox UI mockup | ⚠️ Placeholder (hardcoded data) |
| `/booking-outreach-playbook.md` | Outreach templates (breweries, schools, businesses, apartments) | ✅ Complete (not dashboard-related, but booking context) |
| `/insurance-request-TL-industries.md` | COI request template (T&L Industries specific) | ⚠️ Partial (needs genericizing for all events) |
| `/brain/files/catering-intake.md` | Catering intake required fields | ⚠️ Minimal (8 required fields, no workflow) |
| `/supabase-schema.sql` | Database schema | ⚠️ Partial (booking tables not yet added) |

---

## APPENDIX B: KEY CONTACTS

| Name | Role | Contact | Notes |
|------|------|---------|-------|
| **John Kyburz** | Owner/Decision-Maker | jfkyburz@gmail.com, (443) 655-0036 | Final approvals on pricing, legal, budget |
| **Daniel** | Regional Manager | (via Slack: Juke's Diner workspace) | Runs event truck, handles bookings, source of operational requirements |
| **Joel Buckberg** | Lawyer (Baker Donnelson) | (via John) | Drafted franchise agreement, owed $11k, potential for contract template |
| **Sarah Miller** | Insurance Agent (Goosehead Insurance) | (555) 019-8877 | Issues COIs for events, named insured: Juke's Diner Franchise LLC |
| **Keith** | Toast/Automation Specialist | (via Daniel, per Obsidian daily 2026-04-15) | May assist with Toast integration, no equity, works for free/connects |

---

**END OF ROADMAP**

---

**Document Owner:** jukes-ops-agent  
**Created:** 2026-05-08  
**Kanban Task:** t_f88297e4  
**Workspace:** /Users/lexi/projects/jukes-diner-website  
**Status:** Ready for review
