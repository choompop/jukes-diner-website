# Cashflow Dashboard Implementation Guide

**Purpose:** Bridge the roadmap to the existing codebase — what's already built, what's next, and how to execute Phase 2  
**Owner:** jukes-finance-agent  
**Created:** 2026-05-08  

---

## Already Implemented (Phase 1)

### 1. Stripe Read-Only Integration ✅

**Files:**
- `lib/stripe-cashflow.mjs` — Client wrapper, normalization, cashflow views
- `tests/stripe-cashflow.test.mjs` — Full test coverage with mocked Stripe data

**Capabilities:**
- Safe mode detection (works with missing keys, no crashes)
- Read-only API calls (no charges, payouts, refunds, transfers)
- Transaction bucketing (revenue, COGS, labor, fixed ops)
- Per-location weekly cashflow calculation
- Consolidated business view
- Test coverage with 12 passing tests

**What's NOT Done:**
- ⚠️ Stripe account IDs not configured in production `.env`
- ⚠️ No UI to display the data (just backend logic)
- ⚠️ No historical data storage (just live API calls)

---

### 2. Financial Management Model ✅

**Files:**
- `lib/franchise-financials.mjs` — Default model, stats, scorecard, visibility sections
- `data/franchise-financials.json` — Persisted financial data with 4 locations
- `tests/franchise-financials.test.mjs` — 11 passing tests

**Capabilities:**
- 4 operating units (Event Truck, Trailer Park, East Nashville, Corporate)
- Weekly cashflow per unit (sales, COGS, labor, fixed ops, net cashflow)
- Consolidated weekly cashflow (all units aggregated)
- Negative unit detection (flags units with negative net cashflow)
- Financial scorecard (health status, alerts, next actions)
- Obligations tracker (royalties, taxes, vendor bills)
- Document readiness (missing invoices, reports)
- Action queue (prioritized finance tasks)
- Visibility sections (operator, owner, franchisor, exception views)

**What's NOT Done:**
- ⚠️ No live data integration (model uses placeholder numbers)
- ⚠️ No UI to edit or update the model
- ⚠️ No debt service capacity calculator (just weekly debt service placeholder)

---

## Phase 2: Dashboard UI Build (Next)

### Goal
Display location-level and consolidated cashflow in a user-friendly dashboard that John can review weekly.

### Proposed Pages

#### **Page 1: Overview**
- **Consolidated business summary:**
  - Total revenue (all locations)
  - Total net cashflow (all locations)
  - Cash on hand (Stripe available + pending)
  - Number of negative units
- **Quick alerts:**
  - Negative cashflow locations
  - Upcoming obligations due within 7 days
  - Missing data flags (COGS, labor, fixed ops)

#### **Page 2: Location Detail (4 cards, one per location)**
Each card shows:
- Location name (Event Truck, Trailer Park, East Nashville, Corporate)
- Weekly revenue (from Stripe or manual entry)
- Weekly COGS (from manual entry or QuickBooks)
- Weekly labor (from payroll or manual entry)
- Weekly fixed ops (from manual entry)
- Processing fees (from Stripe)
- **Net cashflow** (revenue - COGS - labor - fixed ops - fees)
- Cashflow status indicator (positive = green, negative = red)
- Data source badge (Stripe live, Stripe mock, fallback model, manual)

#### **Page 3: Debt Service**
- **Debt roster table:**
  - Debt name, creditor, balance, APR, minimum payment, due date
  - Priority flag (urgent, high, normal)
- **Debt service capacity calculator:**
  - Total net cashflow (from Page 2)
  - Minus: Total obligations due (royalties, taxes, vendor bills)
  - Minus: Operating reserve (user-defined buffer, e.g., $10k)
  - **= Available for debt payoff**
- **Payoff timeline visualization:**
  - Weeks to pay off each debt at current rate
  - Slider to adjust weekly payoff amount
  - "Safe payoff" vs "accelerated payoff" scenarios

#### **Page 4: Obligations Tracker**
- **Upcoming obligations table:**
  - Title, amount, due date, priority, owner, status
  - Sort by due date (soonest first)
  - Filter by priority (urgent, high, normal, low)
- **Add obligation form:**
  - Manual entry for new bills, taxes, royalties

#### **Page 5: Weekly Finance Review Checklist**
Interactive checklist following `weekly-finance-rhythm.md`:
1. [ ] Sales vs plan (per location)
2. [ ] Food cost and waste notes
3. [ ] Labor schedule vs sales volume
4. [ ] Cash on hand and upcoming bills
5. [ ] Catering leads and close rate
6. [ ] Royalties, marketing fund, tax reserve
7. [ ] One operating fix for next week

---

### Technology Stack (Existing)

The dashboard already runs on:
- **Next.js 15** (React framework)
- **Tailwind CSS** (styling)
- **JSON data files** (`data/franchise-financials.json`, etc.)
- **Server-side API routes** (`app/api/...`)

**Recommended approach:**
- Add new dashboard routes: `/dashboard/cashflow`, `/dashboard/debt`, `/dashboard/obligations`
- Create React components: `LocationCashflowCard.jsx`, `DebtServiceCalculator.jsx`, `ObligationsTable.jsx`
- Fetch data from existing model (`lib/franchise-financials.mjs`, `lib/stripe-cashflow.mjs`)
- Style with Tailwind (match existing dashboard aesthetic)

---

### File Structure (Proposed)

```
app/dashboard/
  cashflow/
    page.js                   # Overview + location cards
  debt/
    page.js                   # Debt service + payoff calculator
  obligations/
    page.js                   # Obligations tracker
  review/
    page.js                   # Weekly finance review checklist

components/dashboard/
  LocationCashflowCard.jsx    # Per-location weekly cashflow display
  ConsolidatedSummary.jsx     # Business-wide summary
  DebtServiceCalculator.jsx   # Debt payoff capacity + timeline
  ObligationsTable.jsx        # Obligations list + add form
  WeeklyReviewChecklist.jsx   # Interactive checklist
  DataSourceBadge.jsx         # Shows Stripe/manual/fallback status
  CashflowStatusIndicator.jsx # Green/red indicator for positive/negative

lib/
  stripe-cashflow.mjs         # ✅ Already exists
  franchise-financials.mjs    # ✅ Already exists
  debt-service.mjs            # New: debt payoff calculations

data/
  franchise-financials.json   # ✅ Already exists
  debt-roster.json            # New: debt accounts
```

---

## Phase 3: Manual Data Entry Forms (Future)

### Goal
Allow John or ops leads to manually enter COGS, labor, and fixed ops data until automation is ready.

### Proposed Forms

#### **COGS Entry Form**
- Date picker (invoice date)
- Vendor dropdown (Sysco, US Foods, Pepsi, etc.)
- Category dropdown (food, beverage, packaging)
- Amount input ($)
- Location dropdown (Event Truck, Trailer Park, East Nashville, Corporate)
- Submit → updates weekly COGS for that location

#### **Labor Entry Form**
- Pay period start/end date pickers
- Location dropdown
- Gross wages input ($)
- Payroll taxes input ($)
- Tips input ($)
- Submit → updates weekly labor for that location

#### **Fixed Ops Entry Form**
- Date picker (bill due date)
- Category dropdown (rent, utilities, insurance, maintenance, permits)
- Vendor input (landlord, utility company, etc.)
- Amount input ($)
- Location dropdown
- Frequency dropdown (one-time, weekly, monthly, annual)
- Submit → updates weekly fixed ops for that location

#### **Debt Account Entry Form**
- Debt name input (Flex 0%, SBA Loan, etc.)
- Creditor input
- Account last 4 digits input
- Current balance input ($)
- APR input (%)
- Minimum payment input ($)
- Due date picker
- Payoff date picker (optional, for 0% expiry)
- Priority dropdown (urgent, high, normal)
- Submit → adds to debt roster

---

## Phase 4: Automation + Integrations (Future)

### Stripe API Daily Sync
- **Cron job:** Runs nightly at 2am
- **Fetch:** Balance transactions for previous day (all 4 accounts)
- **Store:** Append to `data/stripe-transactions-{location}-{YYYY-MM-DD}.json`
- **Aggregate:** Weekly rollup for dashboard display

### Payroll CSV Auto-Import
- **Source:** SFTP from payroll provider or email attachment
- **Parse:** Extract pay period, location, gross wages, taxes, tips
- **Load:** Update `data/franchise-financials.json` weekly labor field

### Vendor Invoice Extraction
- **Source:** Flo email triage skill
- **Extract:** Date, vendor, amount, category from PDF invoice
- **Tag location:** Based on delivery address or invoice memo
- **Load:** Aggregate weekly COGS per location

### QuickBooks Sync (if bank feeds restored)
- **Export:** Weekly transactions CSV from QuickBooks
- **Categorize:** Map QuickBooks categories to dashboard buckets (COGS, labor, fixed ops)
- **Split by location:** Based on QuickBooks class or memo field
- **Load:** Update dashboard data

---

## Implementation Priority

### High Priority (Do First)
1. **Page 1: Overview** — Consolidated summary + location cards (read-only display)
2. **Page 2: Location Detail** — Per-location cashflow breakdown
3. **Page 3: Debt Service** — Debt payoff capacity calculator

### Medium Priority (Do Next)
4. **Page 4: Obligations Tracker** — Manual entry + due date tracking
5. **Manual data entry forms** — COGS, labor, fixed ops
6. **Stripe account ID configuration** — Add 4 account IDs to `.env`

### Low Priority (Nice to Have)
7. **Page 5: Weekly Review Checklist** — Interactive checklist
8. **Historical trending charts** — Line graphs of revenue, COGS, labor over time
9. **Automation** — Stripe daily sync, payroll CSV import, vendor invoice extraction

---

## Code Examples

### Example: Location Cashflow Card Component

```jsx
// components/dashboard/LocationCashflowCard.jsx
export default function LocationCashflowCard({ unit }) {
  const { id, name, source, statusMessage, cashflow } = unit;
  const isPositive = cashflow.netCashflow >= 0;

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-xs text-gray-500">{statusMessage}</p>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Revenue:</span>
          <span className="font-mono">${cashflow.revenue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>COGS:</span>
          <span className="font-mono">${cashflow.cogs.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Labor:</span>
          <span className="font-mono">${cashflow.labor.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Fixed Ops:</span>
          <span className="font-mono">${cashflow.fixedOperations.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Processing Fees:</span>
          <span className="font-mono">${cashflow.processingFees?.toFixed(2) || '0.00'}</span>
        </div>
        <hr className="my-2" />
        <div className={`flex justify-between font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span>Net Cashflow:</span>
          <span className="font-mono">${cashflow.netCashflow.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs">
        <span className={`px-2 py-1 rounded ${source === 'stripe-mock' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {source === 'stripe-mock' ? 'Stripe (test)' : 'Model fallback'}
        </span>
      </div>
    </div>
  );
}
```

### Example: Debt Service Capacity Calculator

```jsx
// components/dashboard/DebtServiceCalculator.jsx
'use client';
import { useState } from 'react';

export default function DebtServiceCalculator({ netCashflow, obligations }) {
  const [operatingReserve, setOperatingReserve] = useState(10000);

  const totalObligations = obligations.reduce((sum, ob) => sum + ob.amount, 0);
  const availableForDebt = Math.max(0, netCashflow - totalObligations - operatingReserve);

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-bold">Debt Service Capacity</h3>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Total Net Cashflow:</span>
          <span className="font-mono text-green-600">${netCashflow.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Obligations Due:</span>
          <span className="font-mono text-red-600">-${totalObligations.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Operating Reserve:</span>
          <input
            type="number"
            value={operatingReserve}
            onChange={(e) => setOperatingReserve(Number(e.target.value))}
            className="w-24 px-2 py-1 border rounded font-mono text-right"
          />
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Available for Debt Payoff:</span>
          <span className={`font-mono ${availableForDebt > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            ${availableForDebt.toFixed(2)}
          </span>
        </div>
      </div>
      
      {availableForDebt <= 0 && (
        <p className="mt-4 text-sm text-amber-700 bg-amber-50 p-2 rounded">
          No funds available for debt payoff this week. Focus on cashflow improvement or reduce obligations.
        </p>
      )}
    </div>
  );
}
```

---

## Next Steps

### Before Building UI
1. **Review roadmap with John** — confirm scope, KPIs, weekly cadence
2. **Document debt accounts** — pull statements, fill out debt roster
3. **Configure Stripe account IDs** — add to `.env` (if approved)

### To Start Building
1. **Create new dashboard routes** (`app/dashboard/cashflow/page.js`)
2. **Build location cashflow card component** (display existing model data)
3. **Test with live Stripe data** (if keys configured) or mock data
4. **Iterate with John's feedback**

---

**Status:** Implementation guide complete  
**Next Action:** Get John's approval to proceed with Phase 2 UI build
