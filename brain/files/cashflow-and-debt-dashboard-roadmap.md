# Juke's 4-Location Cashflow and Debt Payoff Dashboard Roadmap

**Version:** 1.0  
**Created:** 2026-05-08  
**Owner:** John Kyburz  
**Agent:** jukes-finance-agent  

---

## Executive Summary

This roadmap defines the scope, KPIs, data sources, and weekly review cadence for a location-level cashflow dashboard that helps John track profitability across four operating accounts and make informed debt service decisions. The dashboard will provide visibility into revenue, costs, and net cashflow per location, consolidated business performance, and debt payoff capacity — all read-only, with no automated money movement.

---

## 1. Scope + Location Coverage

### Four Operating Locations

| Location ID | Name | Type | Owner Role | Stripe Account Env |
|-------------|------|------|------------|-------------------|
| `event-truck` | Event Truck | Mobile unit | Event Operator | `STRIPE_ACCOUNT_EVENT_TRUCK` |
| `trailer-park` | Trailer Park | Fixed location | Trailer Park Operator | `STRIPE_ACCOUNT_TRAILER_PARK` |
| `east-nashville` | East Nashville | Fixed location | East Nashville GM | `STRIPE_ACCOUNT_EAST_NASHVILLE` |
| `corporate-account` | Corporate Account | Corporate entity | Owner/CFO | `STRIPE_ACCOUNT_CORPORATE` |

### Potential New Locations (For Future Expansion)

The dashboard architecture supports adding new locations without code changes:
- **Brentwood:** Health permit and commissary work underway; not yet operating
- **Future franchise units:** Any new location follows the same four-location pattern (Stripe Connect account, weekly cashflow buckets, unit-level KPIs)

When a new location is added:
1. Create Stripe Connect account
2. Add environment variable (e.g., `STRIPE_ACCOUNT_BRENTWOOD`)
3. Add unit to `franchise-financials.json` with baseline model
4. Dashboard auto-discovers and displays the new location

---

## 2. Core KPIs

### Per-Location Weekly Cashflow

Each location reports:

| KPI | Definition | Purpose | Data Source |
|-----|------------|---------|-------------|
| **Revenue** | Gross sales from all channels (cards, cash, catering) | Top-line health | Stripe charges + POS cash sales |
| **COGS** | Food cost, beverage cost, packaging, delivery fees | Prime cost control | Vendor invoices, Stripe payouts to vendors |
| **Labor** | Hourly wages, salary, payroll taxes, tips | Prime cost control | Payroll system, manual entry |
| **Fixed Operations** | Rent, utilities, insurance, maintenance, permits | Breakeven visibility | Manual entry, recurring bill tracker |
| **Processing Fees** | Stripe fees, terminal fees, bank fees | Net cashflow accuracy | Stripe balance transaction fees |
| **Net Cashflow** | Revenue - COGS - Labor - Fixed Ops - Fees | Unit profitability | Calculated field |

### Consolidated Business Performance

| KPI | Definition | Purpose | Data Source |
|-----|------------|---------|-------------|
| **Total Revenue** | Sum of all location revenues | Business-wide sales health | Aggregation across locations |
| **Total Net Cashflow** | Sum of all location net cashflows | Business profitability | Aggregation across locations |
| **Negative Units** | Locations with negative net cashflow | Coaching/intervention flags | Calculated field |
| **Cash on Hand** | Available balance across all Stripe accounts | Liquidity visibility | Stripe balance API (available + pending) |
| **Debt Service Capacity** | Net cashflow minus obligations, available for debt paydown | Debt payoff planning | Calculated field |

### Debt Service Visibility

| KPI | Definition | Purpose | Data Source |
|-----|------------|---------|-------------|
| **Weekly Debt Service** | Current scheduled debt payments per week | Baseline obligation | Manual entry (current: $725/week) |
| **Total Obligations Due** | Sum of royalties, taxes, vendor bills, debt | Short-term cash claim | Manual entry from obligations list |
| **Available for Debt Payoff** | Net cashflow - obligations - operating reserve | Maximum safe paydown amount | Calculated field |
| **Debt Payoff Timeline** | Estimated weeks to pay off specific debts | Planning horizon | User-defined debt balance / available weekly |

### Optional: Prime Cost + Compliance KPIs (if data available)

| KPI | Definition | Source |
|-----|------------|--------|
| **Prime Cost %** | (COGS + Labor) / Revenue | Calculated field |
| **Royalty %** | Franchisor royalty / Revenue | Manual entry or contract reference |
| **Tax Reserve %** | Tax reserve / Revenue | Manual entry or state rate |

---

## 3. Data Sources + Export Requirements

### Data Source Map

| Data Category | Required Fields | Current Source | Export Format | Update Frequency | Status |
|---------------|----------------|----------------|---------------|------------------|--------|
| **Stripe Revenue** | Charges, refunds, fees, balance | Stripe API (Connect, read-only) | JSON via API | Daily or on-demand | ✅ Implemented (test-safe mode) |
| **Stripe Balance** | Available, pending per account | Stripe Balance API | JSON via API | Daily or on-demand | ✅ Implemented |
| **COGS** | Vendor invoices, food cost | Manual entry or vendor statement export | CSV or manual | Weekly | ⚠️ Manual process |
| **Labor** | Payroll totals, tips, taxes | Payroll system (e.g., Gusto, ADP) | CSV export or manual | Weekly | ⚠️ Manual process or blocked by payroll access |
| **Fixed Operations** | Rent, utilities, insurance | Manual entry or bill tracker | Manual or CSV | Weekly | ⚠️ Manual process |
| **Debt Balances** | Current balance, APR, minimum payment | Manual entry from statements | Manual | Monthly or as needed | ⚠️ Manual process |
| **Obligations** | Royalties, taxes, vendor bills | Manual entry or contract reference | Manual | Weekly | ⚠️ Manual process |

### Missing Data / Blockers

| Data Need | Blocker | Resolution Path | Owner |
|-----------|---------|----------------|-------|
| **QuickBooks bank feeds** | Subscription expired or bank feed disconnected | Restore QuickBooks subscription + reconnect bank feeds per `quickbooks-bank-feed-restoration.md` | John |
| **Payroll exports** | No automated export from payroll system | Set up weekly CSV export from Gusto/ADP, or manual entry | John or payroll admin |
| **Vendor invoice aggregation** | Invoices arrive via email/mail, not centralized | Use Flo email triage to extract vendor invoices into structured format | Flo + ops agent |
| **Debt account details** | Flex 0% payoff plan missing balance, APR, terms | Pull statements for all active debts and document in structured format per `flex-0-percent-payoff-plan.md` | John |

---

## 4. Weekly Dashboard Update + Review Cadence

### Recommended Workflow

#### **Day 1 (Monday): Data Collection**
- Pull Stripe data for previous week (automated if keys configured)
- Collect manual entries: COGS invoices, labor totals, fixed ops bills
- Update obligations list with new bills or payments made

#### **Day 2 (Tuesday): Dashboard Update**
- Load data into dashboard (automated where possible, manual CSV upload otherwise)
- Review per-location net cashflow for negative units
- Flag any variances or missing data

#### **Day 3 (Wednesday): Weekly Finance Review**
Following the existing **Weekly Finance Rhythm** (see `brain/files/weekly-finance-rhythm.md`):

1. **Sales vs plan** — Did each location hit target?
2. **Food cost and waste notes** — Any COGS spikes or waste issues?
3. **Labor schedule vs sales volume** — Overstaffed or understaffed?
4. **Cash on hand and upcoming bills** — Liquidity check
5. **Catering leads and close rate** — Revenue pipeline
6. **Royalties, marketing fund, tax reserve** — Compliance obligations
7. **One operating fix for next week** — Action item per location

#### **Day 4 (Thursday): Debt Payoff Planning**
- Review **Debt Service Capacity** KPI
- If positive cashflow after obligations, calculate:
  - Minimum payment amount
  - Maximum safe paydown amount (preserving operating reserve)
  - Weeks to payoff at current rate
- Document decision: make minimum payment, accelerate payoff, or hold cash
- **No automated payment execution** — John approves and manually submits payments

#### **Day 5 (Friday): Close + Archive**
- Archive week's data for historical trending
- Generate summary report for John
- Reset weekly counters for next cycle

### Review Frequency by KPI

| KPI | Update Frequency | Review Frequency |
|-----|-----------------|------------------|
| Revenue, COGS, Labor, Fixed Ops | Weekly | Weekly (Wednesday) |
| Net Cashflow | Weekly | Weekly (Wednesday) |
| Cash on Hand | Daily (if automated) | Weekly (Wednesday) |
| Debt Service Capacity | Weekly | Weekly (Thursday) |
| Obligations | As bills arrive | Weekly (Monday/Wednesday) |

---

## 5. Guardrails + Read-Only Constraints

**This dashboard does NOT and will NOT:**

- ❌ Execute Stripe charges, refunds, payouts, transfers, or account links
- ❌ Automatically pay debt, vendors, royalties, or taxes
- ❌ Make final debt payoff decisions without John's approval
- ❌ Expose Stripe secret keys, account IDs, or sensitive financial data in logs or UI
- ❌ Recommend specific debt payoff strategies without full account details

**This dashboard DOES:**

- ✅ Read Stripe data in test-safe, read-only mode
- ✅ Display location-level and consolidated cashflow visibility
- ✅ Calculate debt service capacity based on net cashflow and obligations
- ✅ Provide decision-support data for John to manually execute payments
- ✅ Flag negative cashflow units for intervention
- ✅ Track missing data sources and blockers

**All money movement requires:**
1. John's explicit approval
2. Manual execution via bank/Stripe dashboard
3. Verification and confirmation of posting

---

## 6. Implementation Phases (Not Authorized Yet)

**Phase 0: Roadmap + Planning (This Document)**
- Define scope, KPIs, data sources, cadence
- Document blockers and missing data
- Get John's approval to proceed

**Phase 1: Stripe Read-Only Integration (Already Completed)**
- ✅ Stripe client wrapper with safe mode detection
- ✅ Read-only API calls (balance transactions, balance retrieval)
- ✅ Transaction normalization into cashflow buckets
- ✅ Test coverage with mocked data
- ✅ Environment-driven configuration (4 account env vars)

**Phase 2: Dashboard UI Build (Future, if approved)**
- Display per-location weekly cashflow cards
- Consolidated business view
- Debt service capacity calculator
- Missing data status indicators
- Historical trending charts

**Phase 3: Manual Data Entry Forms (Future, if approved)**
- COGS entry form
- Labor entry form
- Fixed ops entry form
- Debt account entry form
- Obligations tracker

**Phase 4: Automation + Integrations (Future, if approved)**
- QuickBooks sync (if bank feeds restored)
- Payroll CSV auto-import
- Vendor invoice extraction via Flo
- Weekly report email to John

---

## 7. Next Steps

### Immediate (This Week)
1. **Review this roadmap** — John confirms scope, KPIs, and weekly cadence
2. **Document debt accounts** — Pull statements for Flex 0% and any other debts, document per `flex-0-percent-payoff-plan.md`
3. **Resolve QuickBooks blocker** — Follow `quickbooks-bank-feed-restoration.md` to restore bank feeds (if desired)

### Short-Term (Next 2 Weeks)
4. **Configure Stripe account IDs** — Add 4 Stripe Connect account IDs to environment variables (if not already set)
5. **Manual data collection trial run** — Test the weekly cadence with one week of manual COGS/labor/fixed ops data
6. **Build dashboard UI** — Only if John approves moving forward with implementation

### Long-Term (Next 30-60 Days)
7. **Automate data collection** — Set up payroll CSV exports, vendor invoice extraction, QuickBooks sync
8. **Historical trending** — Archive 4-8 weeks of data to identify patterns
9. **Debt payoff execution** — Use dashboard insights to guide actual debt payments (manual execution only)

---

## 8. Open Questions for John

1. **Debt accounts:** Which debts should be tracked on the dashboard? (Flex 0%, SBA loans, vendor credit lines, etc.)
2. **Payroll access:** Does John have admin access to export weekly payroll totals, or does this need to be manual?
3. **COGS tracking:** Should COGS be entered per-location by operators, or centrally by John/CFO?
4. **Review day preference:** Is Wednesday the right day for weekly finance review, or does John prefer a different day?
5. **Operating reserve:** What's the minimum cash-on-hand buffer before debt payoff is paused? (e.g., $10k, $20k, 2 weeks of obligations)
6. **Dashboard access:** Should operators see their own location's data, or is this John-only?

---

## 9. Reference Documents

- **Weekly Finance Rhythm:** `brain/files/weekly-finance-rhythm.md`
- **Financial KPI Dictionary:** `brain/files/financial-kpi-dictionary.md`
- **Flex 0% Payoff Plan:** `brain/files/flex-0-percent-payoff-plan.md`
- **QuickBooks Bank Feed Restoration:** `brain/files/quickbooks-bank-feed-restoration.md`
- **Financial Model (JSON):** `data/franchise-financials.json`
- **Stripe Cashflow Integration (Code):** `lib/stripe-cashflow.mjs`
- **Test Coverage:** `tests/stripe-cashflow.test.mjs`, `tests/franchise-financials.test.mjs`

---

## 10. Acceptance Criteria Checklist

- [x] Roadmap covers Event Truck, Trailer Park, East Nashville, Corporate, and future locations
- [x] KPI list includes location-level cashflow, profit, debt service visibility, and consolidated rollups
- [x] Data source map identifies required accounts, exports, reports, and manual inputs for each KPI
- [x] Missing account access, export gaps, and blockers are documented (QuickBooks, payroll, vendor invoices, debt statements)
- [x] Weekly dashboard update/review cadence is specified (Monday collection, Wednesday review, Thursday debt planning, Friday close)
- [x] Roadmap explicitly states no money movement authorization

---

**Status:** Roadmap complete, awaiting John's approval to proceed with implementation  
**Next Action:** Schedule review session with John to answer open questions and get green light for Phase 2
