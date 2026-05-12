# Operator SOP Hub — Inventory, Staffing, Payroll, and Training

**Purpose:** Central hub for operational systems, SOPs, and documentation — tracks what's built, what's missing, and who owns each piece  
**Owner:** jukes-ops-agent  
**Created:** 2026-05-08  
**Last Updated:** 2026-05-08  

---

## Hub Overview

This hub organizes operational documentation across four critical areas:
1. **Inventory Management** — Par levels, ordering, receiving, waste tracking
2. **Staffing & Scheduling** — Shift coverage, labor budgets, team roles
3. **Payroll & Labor Tracking** — Time tracking, wage calculations, export workflows
4. **Training & SOPs** — Onboarding, skill certification, process documentation

Each section below includes:
- Current status (✅ Active, 🚧 Partial, ⚠️ Missing, 📋 Planned)
- Required templates and metadata fields
- Owner assignment
- Blockers and next steps
- Routing to appropriate specialist (Flo, editor, coding)

---

## 1. Inventory Management

### 1.1 Par Level Management

**Status:** 🚧 Partial  
**Owner:** GM / Shift Lead  
**Location:** `brain/files/inventory/par-levels.md` (not yet created)

**Required Fields:**
- Item name
- Category (food, beverage, packaging, disposables, cleaning)
- Unit of measure (each, case, lb, gallon)
- Par level (minimum quantity on hand)
- Reorder threshold
- Preferred vendor
- Last updated date
- Location-specific (event-truck, trailer-park, east-nashville, corporate)

**Template Structure:**
```markdown
# Par Levels — [Location]

| Category | Item | Unit | Par Level | Reorder At | Vendor | Updated |
|----------|------|------|-----------|------------|--------|---------|
| Food | Hot dogs (all-beef) | case (80ct) | 3 cases | 1.5 cases | Sysco | 2026-05-01 |
| Beverage | Coca-Cola (cans) | case (24ct) | 2 cases | 1 case | Pepsi Co | 2026-05-01 |
```

**Missing Documentation:**
- ⚠️ No par level lists exist for any location
- ⚠️ No vendor contact roster with ordering details
- ⚠️ No reorder automation or alert system

**Blockers:**
- John needs to provide current par levels for each location
- Vendor contact information scattered across email, phone, paper

**Next Steps:**
1. **Flo** — Extract vendor contacts from John's email/phone history → vendor-roster.md
2. **John** — Approve par level template structure
3. **Ops Agent** — Create location-specific par level documents once template approved
4. **Coding** — Build reorder alert system (future sprint, not in scope)

**Routing:** John approval → Flo (vendor data) → Ops Agent (templates)

---

### 1.2 Vendor Ordering Workflow

**Status:** 🚧 Partial  
**Owner:** GM / Kitchen Manager  
**Location:** `brain/files/inventory/ordering-workflow.md` (not yet created)

**Required Fields:**
- Vendor name
- Contact method (phone, email, portal)
- Order lead time (days)
- Minimum order amount
- Delivery days/windows
- Payment terms (COD, NET-30, card on file)
- Account number

**SOP Checklist:**
- [ ] Check current inventory against par levels
- [ ] Generate order list by vendor
- [ ] Place orders 2-3 days before delivery window
- [ ] Confirm delivery time with vendor
- [ ] Assign receiving team member
- [ ] Log order confirmation number

**Missing Documentation:**
- ⚠️ No ordering SOP exists
- ⚠️ No vendor account numbers or portal logins documented

**Blockers:**
- Vendor credentials scattered (some with John, some with GM, some on paper)

**Next Steps:**
1. **Flo** — Create vendor contact/credential vault (secure storage TBD)
2. **Editor** — Write ordering SOP from John's workflow interview
3. **Ops Agent** — Format as checklist template

**Routing:** Flo (credentials) → Editor (SOP writing) → Ops Agent (formatting)

---

### 1.3 Receiving and Invoice Logging

**Status:** ⚠️ Missing  
**Owner:** Shift Lead / Receiver  
**Location:** `brain/files/inventory/receiving-sop.md` (not yet created)

**Required Fields:**
- Delivery date
- Vendor
- Order number
- Items received (with quantities)
- Damaged/missing items
- Invoice total
- Receiver signature
- Storage location

**SOP Checklist:**
- [ ] Verify delivery matches order
- [ ] Check for damaged or expired items
- [ ] Log quantities received
- [ ] Attach invoice to receiving log
- [ ] Store items in designated locations
- [ ] Update inventory counts
- [ ] Flag discrepancies to GM immediately

**Missing Documentation:**
- ⚠️ No receiving process documented
- ⚠️ No invoice logging system (impacts COGS tracking for cashflow dashboard)

**Blockers:**
- Invoice data extraction needed for cashflow dashboard
- No central invoice repository

**Next Steps:**
1. **Coding** — Invoice extraction from email/photos (connects to cashflow dashboard COGS blocker)
2. **Editor** — Write receiving SOP from John's current practice
3. **Flo** — Set up invoice logging workflow (email monitoring)

**Routing:** Coding (extraction) → Editor (SOP) → Flo (monitoring workflow)

---

### 1.4 Waste and Loss Tracking

**Status:** ⚠️ Missing  
**Owner:** Shift Lead  
**Location:** `brain/files/inventory/waste-tracking.md` (not yet created)

**Required Fields:**
- Date
- Item name
- Quantity wasted
- Reason (expired, damaged, prep error, customer return)
- Dollar value (cost basis)
- Logged by

**Template:**
```csv
date,location,item,quantity,reason,cost,logged_by
2026-05-08,event-truck,hot-dogs,12,expired,4.80,Sarah
```

**Missing Documentation:**
- ⚠️ No waste tracking process
- ⚠️ No cost-impact analysis on waste

**Blockers:**
- No item cost database to calculate waste dollar value

**Next Steps:**
1. **Ops Agent** — Create waste log template
2. **John** — Approve waste tracking cadence (daily, weekly?)
3. **Finance Agent** — Link waste data to COGS analysis (future)

**Routing:** Ops Agent (template) → John (approval) → rollout

---

## 2. Staffing & Scheduling

### 2.1 Team Roles and Responsibilities

**Status:** ✅ Active  
**Owner:** GM  
**Location:** `brain/files/team-roles.md` (exists)

**Current Documentation:**
- Team member roles defined
- Responsibilities listed per role

**Next Steps:**
- Keep updated as roles evolve
- Link to training requirements (section 4)

**Routing:** No action needed, documentation complete

---

### 2.2 Shift Scheduling Workflow

**Status:** 🚧 Partial  
**Owner:** GM / Scheduling Manager  
**Location:** `brain/files/staffing/shift-scheduling.md` (not yet created)

**Required Fields:**
- Week starting date
- Location
- Shift type (prep, service, close, event)
- Assigned staff member
- Shift hours (start/end)
- Labor budget target (hours or dollars)

**SOP Checklist:**
- [ ] Review upcoming bookings and events
- [ ] Estimate labor hours needed per shift
- [ ] Assign staff based on skill level and availability
- [ ] Check labor budget vs. projected revenue
- [ ] Post schedule 1 week in advance
- [ ] Confirm shift coverage 24 hours before
- [ ] Log shift changes and call-outs

**Missing Documentation:**
- ⚠️ No scheduling SOP
- ⚠️ No labor budget targets per location

**Blockers:**
- Labor budget targets not defined (connects to cashflow dashboard labor tracking)

**Next Steps:**
1. **Finance Agent** — Define labor budget targets (% of revenue or fixed dollars per location)
2. **Editor** — Write scheduling SOP from GM interview
3. **Ops Agent** — Create shift schedule template

**Routing:** Finance Agent (budgets) → Editor (SOP) → Ops Agent (template)

---

### 2.3 Shift Handoff and Communication

**Status:** ⚠️ Missing  
**Owner:** Shift Lead  
**Location:** `brain/files/staffing/shift-handoff.md` (not yet created)

**Required Fields:**
- Date and shift
- Outgoing shift lead
- Incoming shift lead
- Outstanding tasks
- Inventory alerts
- Equipment issues
- Customer incidents
- Cash reconciliation status

**SOP Checklist:**
- [ ] Review shift recap with incoming lead
- [ ] Transfer keys and cash drawer
- [ ] Flag urgent issues (equipment, inventory)
- [ ] Update shift log
- [ ] Confirm next shift coverage

**Missing Documentation:**
- ⚠️ No handoff process documented

**Next Steps:**
1. **Editor** — Write shift handoff SOP
2. **Ops Agent** — Create shift log template

**Routing:** Editor (SOP) → Ops Agent (template)

---

## 3. Payroll & Labor Tracking

### 3.1 Payroll System Identification

**Status:** ⚠️ Missing  
**Owner:** John / Bookkeeper  
**Location:** `brain/files/payroll/payroll-system.md` (not yet created)

**Critical Unknown:**
- **What payroll system is in use?** (Gusto, ADP, QuickBooks Payroll, manual spreadsheet?)

**Required Information:**
- Payroll provider name
- Account login credentials (secure storage)
- Pay period cadence (weekly, bi-weekly, monthly)
- Export format (CSV, API, PDF reports)
- Tax filing method (automatic, manual)

**Blocker Impact:**
- Cashflow dashboard labor data is blocked until payroll export workflow is defined
- Weekly finance rhythm cannot include payroll reconciliation

**Next Steps:**
1. **Block on John** — Which payroll system is active?
2. **Flo** — Retrieve payroll credentials once system identified
3. **Finance Agent** — Set up weekly payroll export to feed cashflow dashboard
4. **Ops Agent** — Document export workflow as SOP

**Routing:** **BLOCKED — John decision required** → Flo (credentials) → Finance Agent (export) → Ops Agent (SOP)

---

### 3.2 Time Tracking and Clock-In/Out

**Status:** ⚠️ Missing  
**Owner:** GM / Shift Lead  
**Location:** `brain/files/payroll/time-tracking.md` (not yet created)

**Required Fields:**
- Employee name
- Location
- Clock-in time
- Clock-out time
- Break deductions
- Total hours
- Approval status

**Current Method:** Unknown (manual paper? digital app? honor system?)

**SOP Checklist:**
- [ ] Staff clock in at shift start
- [ ] Log breaks (if applicable)
- [ ] Clock out at shift end
- [ ] Manager approves hours daily or weekly
- [ ] Submit approved hours to payroll

**Missing Documentation:**
- ⚠️ No time-tracking SOP
- ⚠️ Unknown if digital time clock or manual timesheets used

**Blockers:**
- Time-tracking method unknown

**Next Steps:**
1. **Block on John** — What time-tracking system is used? (ties to payroll system)
2. **Editor** — Write time-tracking SOP once method confirmed
3. **Ops Agent** — Create timesheet template if manual

**Routing:** **BLOCKED — John decision required** → Editor (SOP) → Ops Agent (template if needed)

---

### 3.3 Payroll Export and Dashboard Integration

**Status:** ⚠️ Missing  
**Owner:** Finance Agent  
**Location:** `brain/files/payroll/payroll-export-workflow.md` (not yet created)

**Required Workflow:**
1. Export weekly payroll totals from payroll system
2. Format as CSV: `pay_period_start, pay_period_end, location, gross_wages, payroll_taxes, tips, total_labor_cost`
3. Upload to cashflow dashboard
4. Reconcile against labor budget

**Blocker:**
- Depends on payroll system identification (section 3.1)
- Depends on labor budget definition (section 2.2)

**Next Steps:**
1. **Finance Agent** — Document export workflow once payroll system identified
2. **Coding** — Automate CSV export if API available

**Routing:** Unblock payroll system → Finance Agent (workflow) → Coding (automation)

---

## 4. Training & SOPs

### 4.1 Onboarding Checklist

**Status:** ⚠️ Missing  
**Owner:** GM / Training Lead  
**Location:** `brain/files/training/onboarding-checklist.md` (not yet created)

**Required Fields:**
- Employee name
- Start date
- Position
- Onboarding tasks completed
- Certifications obtained
- Trainer name
- Completion date

**Onboarding Phases:**
- **Day 1:** Paperwork, uniforms, safety training, facility tour
- **Week 1:** Shadow shifts, basic food safety, cash handling
- **Week 2-4:** Independent shifts with oversight, skill certifications
- **Month 2:** Performance review, skill gaps identified

**SOP Checklist:**
- [ ] Complete employment paperwork
- [ ] Assign onboarding buddy/trainer
- [ ] Review brand voice and service standards
- [ ] Complete food safety certification
- [ ] Shadow 3 shifts minimum
- [ ] Pass skill assessments (food prep, POS, cleaning)
- [ ] 30-day check-in with GM

**Missing Documentation:**
- ⚠️ No onboarding checklist
- ⚠️ No skill certification requirements defined

**Next Steps:**
1. **Editor** — Write onboarding SOP from John's ideal process
2. **Ops Agent** — Create onboarding checklist template
3. **John** — Approve certification requirements

**Routing:** Editor (SOP) → Ops Agent (template) → John (approval)

---

### 4.2 Skill Certifications and Training Modules

**Status:** ⚠️ Missing  
**Owner:** Training Lead  
**Location:** `brain/files/training/skill-certifications.md` (not yet created)

**Required Modules:**
- **Food Safety:** Safe food handling, cross-contamination, temperatures
- **Customer Service:** Brand voice, upselling, complaint resolution
- **POS & Cash Handling:** Square/Toast training, cash reconciliation
- **Prep & Cooking:** Recipe standards, par prep, equipment use
- **Opening/Closing:** Checklists, cleaning standards, security
- **Event Service:** Setup, serving, breakdown, booking management

**Certification Tracking Fields:**
- Employee name
- Module name
- Trainer
- Date completed
- Pass/fail
- Expiration (if applicable, e.g., food safety renewal)

**Missing Documentation:**
- ⚠️ No training modules written
- ⚠️ No certification tracking system

**Blockers:**
- Requires subject-matter expertise from John or experienced GM
- Training content creation is significant lift (out of scope for this spec)

**Next Steps:**
1. **John** — Identify which modules are priority (start with food safety + POS)
2. **Editor** — Draft training content for priority modules
3. **Ops Agent** — Create certification tracking template
4. **Coding** — Digital training platform (future, not in scope)

**Routing:** John (prioritize) → Editor (content) → Ops Agent (tracking template)

---

### 4.3 Existing SOPs Inventory

**Status:** 🚧 Partial  
**Owner:** Ops Agent  
**Location:** `brain/files/ops-sops.md` (exists, minimal)

**Current SOPs:**
- ✅ Kitchen 7 (TPATCK) Shutdown & Housekeeping (checklist exists)

**Placeholder SOP Categories (no docs yet):**
- ⚠️ Opening and closing (general)
- ⚠️ Prep and par levels
- ⚠️ Event service
- ⚠️ Truck readiness
- ⚠️ Cleaning and maintenance
- ⚠️ Incident escalation

**Next Steps:**
1. **Ops Agent** — Inventory existing SOP documents across all locations
2. **Editor** — Write missing SOPs based on John's current practices
3. **Ops Agent** — Format and organize in `brain/files/sops/` directory structure

**Routing:** Ops Agent (inventory) → Editor (writing) → Ops Agent (formatting)

---

## 5. Dashboard and Obsidian Integration

### 5.1 Proposed Hub Structure

**Obsidian Vault Organization:**

```
brain/files/
├── inventory/
│   ├── par-levels.md (by location)
│   ├── ordering-workflow.md
│   ├── receiving-sop.md
│   ├── waste-tracking.md
│   └── vendor-roster.md
├── staffing/
│   ├── team-roles.md (✅ exists)
│   ├── shift-scheduling.md
│   ├── shift-handoff.md
│   └── labor-budgets.md
├── payroll/
│   ├── payroll-system.md
│   ├── time-tracking.md
│   └── payroll-export-workflow.md
├── training/
│   ├── onboarding-checklist.md
│   ├── skill-certifications.md
│   └── training-modules/
│       ├── food-safety.md
│       ├── customer-service.md
│       ├── pos-cash-handling.md
│       ├── prep-cooking.md
│       ├── opening-closing.md
│       └── event-service.md
└── sops/
    ├── opening.md
    ├── closing.md
    ├── prep-and-par.md
    ├── event-service.md
    ├── truck-readiness.md
    ├── cleaning-maintenance.md
    ├── incident-escalation.md
    └── kitchen-7-shutdown.md (✅ exists)
```

**Dashboard Integration:**

If dashboard page required for operator hub:
- **Route:** `/dashboard/operator-hub`
- **Data Sources:**
  - Inventory: manual CSV upload or future API
  - Staffing: manual schedule entry or calendar integration
  - Payroll: weekly CSV export
  - Training: certification tracking table
- **Key Metrics:**
  - Inventory turnover rate
  - Labor cost as % of revenue
  - Training completion %
  - SOP compliance scores

**Note:** Dashboard implementation is OUT OF SCOPE for this task. Focus is on defining the hub structure and required documents.

---

### 5.2 Required Template Files

**Inventory Templates:**
1. `templates/par-level-template.md` — Par level table structure
2. `templates/receiving-log-template.csv` — Daily receiving log
3. `templates/waste-log-template.csv` — Waste tracking
4. `templates/vendor-roster-template.md` — Vendor contact info

**Staffing Templates:**
5. `templates/shift-schedule-template.md` — Weekly schedule grid
6. `templates/shift-handoff-template.md` — Handoff checklist

**Payroll Templates:**
7. `templates/timesheet-template.csv` — Manual time tracking (if needed)
8. `templates/payroll-export-template.csv` — Weekly payroll for dashboard

**Training Templates:**
9. `templates/onboarding-checklist-template.md` — New hire onboarding
10. `templates/certification-tracker-template.csv` — Skill certification log

**All templates location:** `brain/files/templates/`

---

### 5.3 Metadata Fields for SOPs

**Every SOP document must include:**

```yaml
---
title: [SOP Name]
owner: [Role responsible for this SOP]
status: active | partial | missing | planned | deprecated
priority: high | medium | low
last_updated: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
next_review: YYYY-MM-DD
tags: [inventory, staffing, payroll, training, safety, operations]
blocker: [If status is partial/missing, what's blocking completion?]
---
```

**Example:**

```yaml
---
title: Daily Receiving and Invoice Logging
owner: Shift Lead
status: missing
priority: high
last_updated: 2026-05-08
last_reviewed: 2026-05-08
next_review: 2026-06-08
tags: [inventory, operations, finance]
blocker: Invoice extraction workflow not defined
---
```

**Metadata enables:**
- Automated SOP staleness alerts (e.g., if `next_review` date passes)
- Dashboard view of SOP completion status
- Quick identification of blockers across all operational areas

---

## 6. Missing Document Blockers — Routing Matrix

| Category | Document | Status | Blocker | Assigned To | Next Action |
|----------|----------|--------|---------|-------------|-------------|
| **Inventory** | Par levels | ⚠️ Missing | John needs to provide current par levels | **JOHN** | Approve template → provide data |
| Inventory | Vendor roster | ⚠️ Missing | Vendor contacts scattered | **Flo** | Extract from email/phone |
| Inventory | Ordering workflow | ⚠️ Missing | Vendor credentials scattered | **Flo** → **Editor** | Secure credentials → write SOP |
| Inventory | Receiving SOP | ⚠️ Missing | Invoice extraction needed | **Coding** → **Editor** | Build extraction → write SOP |
| Inventory | Waste tracking | ⚠️ Missing | No waste process | **Ops Agent** → **John** | Template → approve cadence |
| **Staffing** | Shift scheduling | ⚠️ Missing | Labor budget targets undefined | **Finance Agent** → **Editor** | Define budgets → write SOP |
| Staffing | Shift handoff | ⚠️ Missing | No handoff process | **Editor** → **Ops Agent** | Write SOP → format template |
| **Payroll** | Payroll system | ⚠️ Missing | **System unknown** | **JOHN** | **Identify payroll provider** |
| Payroll | Time tracking | ⚠️ Missing | **Method unknown** | **JOHN** | **Confirm time-tracking method** |
| Payroll | Export workflow | ⚠️ Missing | Depends on system identification | **Finance Agent** | Document once system known |
| **Training** | Onboarding | ⚠️ Missing | No checklist | **Editor** → **Ops Agent** | Write SOP → template |
| Training | Skill certifications | ⚠️ Missing | Module content not created | **John** → **Editor** | Prioritize modules → draft content |
| Training | SOPs (general) | 🚧 Partial | Most SOPs not written | **Editor** → **Ops Agent** | Write → format |

---

## 7. Critical Path — Unblock Order

These blockers are **interdependent** and must be resolved in this order:

### Phase 1: John Decisions (immediate)
1. **Payroll system identification** — blocks all payroll/labor tracking (sections 3.1, 3.2, 3.3)
2. **Time-tracking method** — blocks time-tracking SOP (section 3.2)
3. **Par level approval** — blocks inventory templates (section 1.1)
4. **Training module priorities** — blocks training content creation (section 4.2)

**Assigned:** **JOHN** (all decisions)  
**Next Action:** Schedule ops sync to answer these 4 questions

---

### Phase 2: Data Extraction (Flo)
Once John decisions complete:
1. Extract vendor contacts from email/phone → vendor-roster.md
2. Retrieve payroll system credentials (secure storage)
3. Set up invoice email monitoring workflow

**Assigned:** **Flo**  
**Depends On:** Phase 1 complete

---

### Phase 3: SOP Writing (Editor)
Once Flo data extraction complete:
1. Ordering workflow SOP
2. Receiving SOP
3. Shift scheduling SOP
4. Shift handoff SOP
5. Time-tracking SOP
6. Onboarding SOP
7. Priority training module content (food safety, POS)

**Assigned:** **Editor**  
**Depends On:** Phase 2 complete

---

### Phase 4: Template & Automation (Ops Agent + Coding)
Once SOPs written:
1. **Ops Agent:** Format all templates (par levels, receiving logs, schedules, etc.)
2. **Coding:** Invoice extraction automation (if in scope)
3. **Finance Agent:** Payroll export workflow documentation

**Assigned:** **Ops Agent**, **Coding**, **Finance Agent**  
**Depends On:** Phase 3 complete

---

## 8. Out of Scope (Deferred)

The following are **important but not part of this hub specification:**

- Building full payroll system integration (API connections, automated sync)
- Creating digital training platform or learning management system (LMS)
- Writing all training module content (only spec'd priority modules)
- Implementing inventory reorder automation
- Building dashboard pages or UI for operator hub
- Vendor invoice OCR/extraction at scale (pilot only)
- Writing every SOP in full (only critical SOPs spec'd)

These items should be tracked in separate Kanban cards and routed to appropriate specialists.

---

## Summary

**What's Been Defined:**
- ✅ Hub structure with 4 top-level categories (inventory, staffing, payroll, training)
- ✅ Required templates for each category (10 templates total)
- ✅ Metadata fields for all SOP documents (YAML frontmatter)
- ✅ Owner assignments for each document and workflow
- ✅ Blocker identification with specific routing to Flo, editor, coding, or John
- ✅ Critical path dependencies mapped across 4 phases

**What's Still Missing (by design — out of scope):**
- Full SOP document content (to be written by editor)
- Training module curriculum (to be created after John prioritization)
- Dashboard UI implementation (deferred)
- Automation integrations (deferred except invoice extraction pilot)

**Critical Blockers Requiring John's Decision:**
1. Payroll system identification
2. Time-tracking method
3. Par level data provision
4. Training module prioritization

**Recommendation:**
Schedule 30-minute ops sync with John to unblock Phase 1, then route to Flo → Editor → Ops Agent in sequence.

---

**End of Operator SOP Hub Specification**
