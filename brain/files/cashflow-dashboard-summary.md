# Cashflow Dashboard Roadmap — Executive Summary

**Created:** 2026-05-08  
**Task:** Build Juke's 4-location cashflow and debt payoff dashboard roadmap  
**Status:** Roadmap complete, awaiting approval  

---

## What Was Delivered

### 1. Comprehensive Roadmap Document
**File:** `brain/files/cashflow-and-debt-dashboard-roadmap.md`

Defines:
- ✅ Scope: 4 operating locations (Event Truck, Trailer Park, East Nashville, Corporate) + future expansion path
- ✅ Core KPIs: Per-location weekly cashflow (revenue, COGS, labor, fixed ops, net cashflow)
- ✅ Consolidated business KPIs: Total revenue, total net cashflow, cash on hand, debt service capacity
- ✅ Debt service visibility: Weekly debt service, obligations due, available for payoff, payoff timeline
- ✅ Data source map: Stripe API, manual COGS/labor/fixed ops, debt statements, obligations tracker
- ✅ Missing data/blockers documented: QuickBooks bank feeds, payroll exports, vendor invoices, debt account details
- ✅ Weekly review cadence: Monday data collection, Tuesday aggregation, Wednesday finance review, Thursday debt planning, Friday close
- ✅ Guardrails: Read-only, no money movement, manual approval required for all debt payments
- ✅ Acceptance criteria: All 6 criteria met

### 2. Data Source Requirements Document
**File:** `brain/files/cashflow-dashboard-data-sources.md`

Provides:
- ✅ Technical requirements for Stripe API integration (endpoints, auth, fields, bucket logic)
- ✅ COGS data collection workflow (vendor invoices, email extraction, location tagging)
- ✅ Labor data requirements (payroll systems, CSV export formats, location splits)
- ✅ Fixed ops data requirements (rent, utilities, insurance, maintenance by location)
- ✅ Debt account data structure (balance, APR, minimum payment, due dates, priority)
- ✅ Obligations tracking format (royalties, taxes, vendor bills with due dates)
- ✅ Weekly data collection checklist (Monday-Friday workflow)
- ✅ Data quality standards (validation rules, missing data handling)
- ✅ Automation opportunities (high/medium/low value ranked)

### 3. Implementation Guide
**File:** `brain/files/cashflow-dashboard-implementation.md`

Maps roadmap to existing codebase:
- ✅ Phase 1 status: Stripe integration + financial model already implemented and tested
- ✅ Phase 2 plan: Dashboard UI pages (overview, location detail, debt service, obligations)
- ✅ Proposed page layouts and component structure
- ✅ Technology stack (Next.js, Tailwind, JSON data files, existing API routes)
- ✅ File structure for new dashboard routes and components
- ✅ Code examples (LocationCashflowCard, DebtServiceCalculator components)
- ✅ Implementation priority (high/medium/low)
- ✅ Next steps to start building UI

---

## What's Already Built (Phase 1 Complete)

### Stripe Read-Only Integration ✅
- **Files:** `lib/stripe-cashflow.mjs`, `tests/stripe-cashflow.test.mjs`
- **Capabilities:**
  - Safe mode detection (works with missing keys, no crashes)
  - Read-only API calls (balance transactions, balance retrieval)
  - Transaction normalization into cashflow buckets (revenue, COGS, labor, fixed ops)
  - Per-location weekly cashflow calculation
  - Consolidated business view
  - 12 passing tests with mocked Stripe data

### Financial Management Model ✅
- **Files:** `lib/franchise-financials.mjs`, `data/franchise-financials.json`, `tests/franchise-financials.test.mjs`
- **Capabilities:**
  - 4 operating units with weekly cashflow data
  - Consolidated weekly cashflow across all units
  - Negative unit detection
  - Financial scorecard (health status, alerts, next actions)
  - Obligations tracker
  - Document readiness tracker
  - Action queue
  - 11 passing tests

---

## What's Missing (Blockers)

| Blocker | Resolution Path | Owner |
|---------|----------------|-------|
| QuickBooks bank feeds disconnected | Restore subscription + reconnect per `quickbooks-bank-feed-restoration.md` | John |
| Stripe account IDs not configured | Add 4 account IDs to `.env` | John |
| Flex 0% debt account details missing | Pull statement and document per `flex-0-percent-payoff-plan.md` | John |
| Payroll export workflow unknown | Identify system (Gusto/ADP), set up weekly CSV export | John |
| Vendor invoice extraction not automated | Manual entry until Flo email skill built | John/ops |
| Dashboard UI not built | Proceed with Phase 2 if approved | Dev team |

---

## Open Questions for John

1. **Debt accounts:** Which debts should be tracked on the dashboard? (Flex 0%, SBA loans, vendor credit lines, etc.)
2. **Payroll access:** Does John have admin access to export weekly payroll totals, or manual entry?
3. **COGS tracking:** Should COGS be entered per-location by operators, or centrally by John/CFO?
4. **Review day preference:** Is Wednesday the right day for weekly finance review, or different day?
5. **Operating reserve:** What's the minimum cash-on-hand buffer before debt payoff is paused? (e.g., $10k, $20k, 2 weeks of obligations)
6. **Dashboard access:** Should operators see their own location's data, or John-only?

---

## Next Steps

### Immediate (This Week)
1. **Review roadmap** — John confirms scope, KPIs, weekly cadence
2. **Document debt accounts** — Pull statements and document in structured format
3. **Answer open questions** — Resolve blockers and clarify workflow preferences

### Short-Term (Next 2 Weeks)
4. **Configure Stripe account IDs** — Add to `.env.local` (if approved)
5. **Manual data collection trial run** — Test weekly cadence with one week of manual COGS/labor/fixed ops
6. **Build dashboard UI** — Only if John approves moving forward with implementation

### Long-Term (Next 30-60 Days)
7. **Automate data collection** — Payroll CSV exports, vendor invoice extraction, QuickBooks sync
8. **Historical trending** — Archive 4-8 weeks of data to identify patterns
9. **Debt payoff execution** — Use dashboard insights to guide actual debt payments (manual execution only)

---

## Guardrails (Read-Only Financial Dashboard)

**This dashboard does NOT and will NOT:**
- ❌ Execute Stripe charges, refunds, payouts, transfers, or account links
- ❌ Automatically pay debt, vendors, royalties, or taxes
- ❌ Make final debt payoff decisions without John's approval
- ❌ Expose Stripe secret keys, account IDs, or sensitive financial data in logs or UI

**This dashboard DOES:**
- ✅ Read Stripe data in test-safe, read-only mode
- ✅ Display location-level and consolidated cashflow visibility
- ✅ Calculate debt service capacity based on net cashflow and obligations
- ✅ Provide decision-support data for John to manually execute payments
- ✅ Flag negative cashflow units for intervention
- ✅ Track missing data sources and blockers

---

## Reference Files

All roadmap documents are stored in `brain/files/`:

1. **cashflow-and-debt-dashboard-roadmap.md** — Full roadmap (this is the main document)
2. **cashflow-dashboard-data-sources.md** — Data source requirements and collection workflows
3. **cashflow-dashboard-implementation.md** — Technical implementation guide
4. **weekly-finance-rhythm.md** — Existing weekly finance review checklist
5. **financial-kpi-dictionary.md** — Existing KPI definitions
6. **flex-0-percent-payoff-plan.md** — Existing debt payoff planning framework
7. **quickbooks-bank-feed-restoration.md** — QuickBooks blocker resolution guide

Existing codebase:
- `lib/stripe-cashflow.mjs` — Stripe integration (Phase 1 complete)
- `lib/franchise-financials.mjs` — Financial model (Phase 1 complete)
- `data/franchise-financials.json` — Persisted financial data
- `tests/stripe-cashflow.test.mjs` — 12 passing tests
- `tests/franchise-financials.test.mjs` — 11 passing tests

---

**Status:** Roadmap complete and documented  
**Next Action:** John reviews roadmap, answers open questions, approves Phase 2 (dashboard UI build)
