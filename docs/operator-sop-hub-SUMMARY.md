# Operator SOP Hub — Task Completion Summary

**Task ID:** t_3f84ee95  
**Completed:** 2026-05-08  
**Agent:** jukes-ops-agent  

---

## What Was Delivered

✅ **Comprehensive operator SOP hub specification** covering inventory, staffing, payroll, and training

**Main Document:** `/Users/lexi/projects/jukes-diner-website/docs/operator-sop-hub.md` (23KB)

**Template Files Created:**
1. `brain/files/templates/par-level-template.md` — Inventory par levels by location
2. `brain/files/templates/receiving-log-template.csv` — Daily receiving and invoice logging
3. `brain/files/templates/waste-log-template.csv` — Waste tracking with cost impact
4. `brain/files/templates/payroll-export-template.csv` — Weekly payroll data for dashboard
5. `brain/files/templates/onboarding-checklist-template.md` — New employee onboarding

**Brain Integration:**
- Updated `brain/files/README.md` to link operator hub as primary ops reference

---

## Hub Structure Overview

### 1. Inventory Management (4 sub-sections)
- Par level management
- Vendor ordering workflow
- Receiving and invoice logging
- Waste and loss tracking

**Status:** 🚧 Partial (1 existing doc) + ⚠️ 3 missing docs identified

### 2. Staffing & Scheduling (3 sub-sections)
- Team roles and responsibilities ✅ (exists)
- Shift scheduling workflow
- Shift handoff and communication

**Status:** ✅ 1 active + ⚠️ 2 missing docs identified

### 3. Payroll & Labor Tracking (3 sub-sections)
- Payroll system identification
- Time tracking and clock-in/out
- Payroll export and dashboard integration

**Status:** ⚠️ All 3 sections missing (blocked on John decisions)

### 4. Training & SOPs (3 sub-sections)
- Onboarding checklist
- Skill certifications and training modules
- Existing SOPs inventory

**Status:** 🚧 1 partial (Kitchen 7 shutdown exists) + ⚠️ 2 missing

---

## Critical Blockers Identified

### **Immediate — Requires John's Decision**

1. **Payroll system identification** — Which system is in use? (Gusto, ADP, QuickBooks, manual?)
   - **Blocks:** All payroll/labor tracking SOPs, cashflow dashboard labor data
   
2. **Time-tracking method** — Digital app, manual timesheets, or honor system?
   - **Blocks:** Time-tracking SOP, payroll export workflow
   
3. **Par level data** — Current par levels for each location
   - **Blocks:** Inventory templates and ordering workflows
   
4. **Training module priorities** — Which modules to create first?
   - **Blocks:** Training content creation by editor

**Recommendation:** Schedule 30-minute ops sync to answer these 4 questions

---

## Routing Matrix

All 19 missing/partial documents mapped to specialists:

| Specialist | Document Count | Key Items |
|------------|----------------|-----------|
| **John (decisions)** | 4 blockers | Payroll system, time tracking, par levels, training priorities |
| **Flo (data extraction)** | 3 docs | Vendor roster, payroll credentials, invoice monitoring |
| **Editor (writing)** | 7 SOPs | Ordering, receiving, scheduling, handoff, time tracking, onboarding, training modules |
| **Ops Agent (formatting)** | 5 templates | Par levels, waste logs, schedules, certification tracking |
| **Coding (automation)** | 2 systems | Invoice extraction, payroll export API |
| **Finance Agent (integration)** | 2 workflows | Labor budgets, payroll export for dashboard |

---

## Metadata Standards Defined

Every SOP document now requires YAML frontmatter:

```yaml
---
title: [SOP Name]
owner: [Role]
status: active | partial | missing | planned | deprecated
priority: high | medium | low
last_updated: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
next_review: YYYY-MM-DD
tags: [category tags]
blocker: [What's blocking completion, if applicable]
---
```

**Benefits:**
- Automated staleness alerts
- Dashboard SOP status views
- Quick blocker identification

---

## Dashboard Integration (Proposed)

**Obsidian Vault Structure:**
```
brain/files/
├── inventory/
├── staffing/
├── payroll/
├── training/
└── sops/
```

**Dashboard Page (out of scope, future):**
- Route: `/dashboard/operator-hub`
- Metrics: inventory turnover, labor %, training completion, SOP compliance

---

## 4-Phase Critical Path

### Phase 1: John Decisions (immediate)
- Payroll system + time tracking method
- Par level data provision
- Training module prioritization

### Phase 2: Data Extraction (Flo)
- Vendor roster from email/phone
- Payroll credentials (secure storage)
- Invoice monitoring setup

### Phase 3: SOP Writing (Editor)
- 7 operational SOPs
- Priority training modules

### Phase 4: Templates & Automation (Ops + Coding + Finance)
- Format all templates
- Invoice extraction pilot
- Payroll export workflow

---

## Out of Scope (Deferred)

- Building payroll system API integration
- Creating digital training platform (LMS)
- Writing all training module content
- Implementing inventory reorder automation
- Building dashboard UI pages
- Vendor invoice OCR at scale
- Writing every SOP in full

**These items should be tracked in separate Kanban cards.**

---

## Files Delivered

1. `/Users/lexi/projects/jukes-diner-website/docs/operator-sop-hub.md` — Main hub spec (23KB)
2. `/Users/lexi/projects/jukes-diner-website/brain/files/templates/par-level-template.md`
3. `/Users/lexi/projects/jukes-diner-website/brain/files/templates/receiving-log-template.csv`
4. `/Users/lexi/projects/jukes-diner-website/brain/files/templates/waste-log-template.csv`
5. `/Users/lexi/projects/jukes-diner-website/brain/files/templates/payroll-export-template.csv`
6. `/Users/lexi/projects/jukes-diner-website/brain/files/templates/onboarding-checklist-template.md`
7. `/Users/lexi/projects/jukes-diner-website/brain/files/README.md` — Updated with operator hub link

---

## Acceptance Criteria — Met

- [x] Proposed dashboard/Obsidian hub structure documented
- [x] Top-level categories: inventory, staffing, payroll, training/SOPs
- [x] Required templates listed (10 templates total, 5 created as examples)
- [x] Owner fields defined for SOPs and operational documents
- [x] Missing-document blockers explicitly identified (19 docs)
- [x] Each blocker routed to Flo, editor, coding, or John with clear next action

---

**Next Step:** Present to John for Phase 1 decision unblocking.
