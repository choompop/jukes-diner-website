# Cashflow Dashboard Data Source Requirements

**Purpose:** Detailed technical and operational requirements for each data source feeding the 4-location cashflow dashboard  
**Owner:** jukes-finance-agent  
**Created:** 2026-05-08  

---

## 1. Stripe Revenue + Balance Data

### Technical Requirements
- **API Access:** Stripe Connect API (read-only)
- **Authentication:** Secret key + account-specific IDs
- **Endpoints:**
  - `GET /v1/balance_transactions` (per Connect account)
  - `GET /v1/balance` (per Connect account)
- **Rate Limits:** 100 requests/second (well above weekly batch needs)

### Environment Variables Required
```bash
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_ACCOUNT_EVENT_TRUCK=acct_...
STRIPE_ACCOUNT_TRAILER_PARK=acct_...
STRIPE_ACCOUNT_EAST_NASHVILLE=acct_...
STRIPE_ACCOUNT_CORPORATE=acct_...
```

### Data Fields Extracted
| Field | Stripe Property | Purpose |
|-------|----------------|---------|
| Transaction ID | `id` | Unique identifier |
| Amount | `amount` (cents → dollars) | Gross transaction value |
| Fee | `fee` (cents → dollars) | Stripe processing fee |
| Net | `net` (cents → dollars) | Amount after fees |
| Type | `type` | charge, adjustment, payout, etc. |
| Reporting Category | `reporting_category` | Stripe's classification |
| Description | `description` | Transaction memo |
| Created | `created` (timestamp) | Transaction date |
| Metadata | `metadata` (optional) | Custom cashflow bucket tags |

### Cashflow Bucket Logic
```javascript
if (type === 'charge' || reporting_category === 'charge') {
  bucket = 'revenue';
} else if (metadata.cashflow_bucket) {
  bucket = metadata.cashflow_bucket; // cogs, labor, fixedOperations
} else if (description includes ['food', 'vendor']) {
  bucket = 'cogs';
} else if (description includes ['labor', 'payroll']) {
  bucket = 'labor';
} else if (description includes ['rent', 'utilities', 'fixed']) {
  bucket = 'fixedOperations';
}
```

### Current Status
- ✅ Code implemented: `lib/stripe-cashflow.mjs`
- ✅ Test coverage: `tests/stripe-cashflow.test.mjs`
- ✅ Safe mode detection: works with missing keys (mock mode)
- ⚠️ Account IDs not configured in production
- ⚠️ Manual cashflow bucket tagging not yet operational

### Blocker Resolution
1. **Get Stripe Connect account IDs** for all 4 locations
2. **Add to `.env.local`** (never commit to repo)
3. **Test in mock mode first** to verify data structure
4. **Switch to live mode** only after John approves

---

## 2. COGS (Cost of Goods Sold)

### Data Requirements
| Field | Definition | Source |
|-------|------------|--------|
| Date | Invoice or purchase date | Vendor invoice |
| Vendor | Supplier name | Vendor invoice |
| Category | Food, beverage, packaging, etc. | Manual classification |
| Amount | Total invoice amount | Vendor invoice |
| Location | Which unit incurred the cost | Manual entry or invoice memo |

### Current Collection Methods
- **Email invoices:** Vendor sends PDF to John's email → Flo extracts
- **Paper invoices:** Physical delivery → manual entry
- **Vendor portals:** Login required → manual download
- **Credit card statements:** Purchases show up on statement → manual categorization

### Ideal Workflow
1. **Flo monitors email** for vendor invoices
2. **Extract key fields** (date, vendor, amount, category)
3. **Route to location** based on invoice memo or delivery address
4. **Weekly aggregation** by location for dashboard upload

### Export Format
```csv
date,vendor,category,amount,location
2026-05-01,Sysco,food,347.82,event-truck
2026-05-01,US Foods,food,521.45,east-nashville
2026-05-02,Pepsi,beverage,189.00,trailer-park
2026-05-03,Eco-Products,packaging,76.50,event-truck
```

### Blockers
- ⚠️ No centralized vendor invoice system
- ⚠️ Email extraction not yet automated
- ⚠️ Location tagging relies on manual review

### Resolution Path
- **Phase 1:** Manual CSV entry by John or ops lead (weekly)
- **Phase 2:** Flo email triage skill to extract invoices
- **Phase 3:** QuickBooks integration (if bank feeds restored)

---

## 3. Labor Costs

### Data Requirements
| Field | Definition | Source |
|-------|------------|--------|
| Pay Period Start | First day of pay period | Payroll system |
| Pay Period End | Last day of pay period | Payroll system |
| Employee Count | Number of employees paid | Payroll system |
| Gross Wages | Total wages before taxes | Payroll system |
| Payroll Taxes | Employer-side taxes (FICA, unemployment) | Payroll system |
| Tips | Reported tips or tip pool | Payroll system |
| Total Labor Cost | Gross wages + taxes + tips | Calculated field |
| Location | Which unit the labor belongs to | Payroll system or manual tag |

### Typical Payroll Systems
- **Gusto:** CSV export available
- **ADP:** CSV export available
- **QuickBooks Payroll:** CSV export available
- **Manual payroll:** Spreadsheet or paper timesheets

### Export Format
```csv
pay_period_start,pay_period_end,location,gross_wages,payroll_taxes,tips,total_labor_cost
2026-05-01,2026-05-07,event-truck,1847.00,294.00,215.00,2356.00
2026-05-01,2026-05-07,trailer-park,1124.00,179.00,87.00,1390.00
2026-05-01,2026-05-07,east-nashville,1908.00,305.00,312.00,2525.00
2026-05-01,2026-05-07,corporate-account,450.00,72.00,0,522.00
```

### Blockers
- ⚠️ Unknown payroll system in use
- ⚠️ Unknown if CSV export is available
- ⚠️ Location tagging may require manual split

### Resolution Path
1. **Identify payroll system** (Gusto, ADP, QuickBooks, manual)
2. **Confirm export capability** (CSV or PDF)
3. **Set up weekly export routine** (admin downloads CSV every Monday)
4. **Upload to dashboard** (manual or automated)

---

## 4. Fixed Operations

### Data Requirements
| Field | Definition | Source |
|-------|------------|--------|
| Date | Bill due date or payment date | Bill or bank statement |
| Category | Rent, utilities, insurance, maintenance, etc. | Manual classification |
| Vendor | Landlord, utility company, insurance provider | Bill |
| Amount | Total due | Bill |
| Location | Which unit the cost belongs to | Manual tag or bill memo |
| Frequency | One-time, weekly, monthly, annual | Manual entry |

### Typical Fixed Costs by Location
| Cost Category | Event Truck | Trailer Park | East Nashville | Corporate |
|---------------|-------------|--------------|----------------|-----------|
| Rent | N/A (mobile) | Yes | Yes | Office rent |
| Utilities | N/A | Yes | Yes | Office utilities |
| Insurance | Commercial auto | General liability | General liability | Umbrella policy |
| Permits/Licenses | Health permit, mobile food | Health permit, business license | Health permit, business license | Business license |
| Maintenance | Truck repairs | Facility repairs | Facility repairs | N/A |

### Export Format
```csv
date,category,vendor,amount,location,frequency
2026-05-01,rent,Trailer Park Landlord,1500.00,trailer-park,monthly
2026-05-01,utilities,Nashville Electric,287.45,east-nashville,monthly
2026-05-05,insurance,State Farm,650.00,corporate-account,monthly
2026-05-07,maintenance,Truck Repair Co,420.00,event-truck,one-time
```

### Blockers
- ⚠️ No centralized bill tracker
- ⚠️ Bills arrive via mail, email, autopay statements
- ⚠️ Location tagging requires manual review

### Resolution Path
1. **Create fixed ops tracker spreadsheet** (Google Sheets or CSV)
2. **John or ops lead enters bills weekly**
3. **Upload to dashboard** (manual or CSV import)
4. **Automate recurring bills** (rent, insurance, utilities pre-filled)

---

## 5. Debt Accounts

### Data Requirements
| Field | Definition | Source |
|-------|------------|--------|
| Debt Name | Short identifier | Manual entry |
| Creditor | Bank or lender name | Statement |
| Account Number (last 4) | Masked account reference | Statement |
| Current Balance | Amount owed | Statement |
| APR | Interest rate | Statement |
| Minimum Payment | Monthly minimum due | Statement |
| Due Date | Next payment due | Statement |
| Payoff Date (0% expiry) | Last day of promotional rate | Statement or offer terms |
| Priority | Urgent, high, normal | Manual classification |

### Example Debt Roster
```csv
debt_name,creditor,account_last_4,current_balance,apr,minimum_payment,due_date,payoff_date,priority
Flex 0%,Chase,1234,12500.00,0.00,250.00,2026-05-15,2026-06-25,urgent
SBA Loan,First National,5678,45000.00,3.75,875.00,2026-05-20,,normal
Vendor Credit Line,Sysco,9012,3200.00,0.00,320.00,2026-05-10,,high
```

### Current Status
- ⚠️ Flex 0% account details missing (see `flex-0-percent-payoff-plan.md`)
- ⚠️ Other debt accounts not documented
- ⚠️ No centralized debt tracker

### Resolution Path
1. **Pull statements for all active debts**
2. **Document in structured format** (CSV or JSON)
3. **Add to dashboard** as reference data
4. **Update monthly** when statements arrive

---

## 6. Obligations (Royalties, Taxes, Vendor Bills)

### Data Requirements
| Field | Definition | Source |
|-------|------------|--------|
| Obligation ID | Unique identifier | Auto-generated or manual |
| Title | Short description | Manual entry |
| Amount | Total due | Invoice, tax notice, contract |
| Due Date | Payment deadline | Invoice, notice, contract |
| Priority | Urgent, high, normal, low | Manual classification |
| Owner | Who is responsible | Manual classification |
| Status | Open, paid, overdue | Manual update |

### Example Obligations
```json
[
  { "id": "sales-tax-reserve", "title": "Sales tax reserve", "amount": 1850, "dueDate": "2026-05-15", "priority": "high", "owner": "Owner/CFO", "status": "open" },
  { "id": "royalty-payment", "title": "Royalty payment", "amount": 505, "dueDate": "2026-05-12", "priority": "normal", "owner": "Franchisor", "status": "open" },
  { "id": "vendor-produce-invoice", "title": "Produce vendor invoice", "amount": 1597, "dueDate": "2026-05-10", "priority": "urgent", "owner": "Operator", "status": "open" }
]
```

### Current Status
- ✅ Model defined in `data/franchise-financials.json`
- ⚠️ Manual entry required weekly

### Resolution Path
1. **Weekly obligations review** (Monday or Tuesday)
2. **Add new bills as they arrive**
3. **Mark paid obligations as closed**
4. **Dashboard displays upcoming due dates**

---

## 7. Data Collection Checklist (Weekly)

**Day: Monday**
- [ ] Pull Stripe data for previous week (automated if keys configured)
- [ ] Collect vendor invoices (email, paper, portals)
- [ ] Download payroll report or calculate manual payroll
- [ ] Review fixed ops bills (rent, utilities, insurance, maintenance)
- [ ] Check for new obligations (tax notices, royalty statements, vendor bills)
- [ ] Update debt balances (monthly or as statements arrive)

**Day: Tuesday**
- [ ] Aggregate COGS by location (sum vendor invoices)
- [ ] Aggregate labor by location (sum payroll totals)
- [ ] Aggregate fixed ops by location (sum bills)
- [ ] Calculate net cashflow per location
- [ ] Update dashboard data files or UI

**Day: Wednesday (Finance Review)**
- [ ] Review per-location cashflow
- [ ] Identify negative units
- [ ] Flag variances or missing data
- [ ] Complete weekly finance rhythm checklist

**Day: Thursday (Debt Planning)**
- [ ] Review debt service capacity
- [ ] Calculate maximum safe paydown amount
- [ ] Document debt payoff decision
- [ ] (Manual execution only, no automation)

**Day: Friday (Close)**
- [ ] Archive week's data
- [ ] Generate summary report for John
- [ ] Reset counters for next week

---

## 8. Data Quality Standards

### Required Data Quality
- **No null revenue:** Every location must have revenue >= 0 (even if $0)
- **COGS <= Revenue:** Food cost cannot exceed sales (flag if > 100%)
- **Labor <= Revenue:** Labor cost cannot exceed sales (flag if > 100%)
- **Net cashflow = Revenue - COGS - Labor - Fixed Ops - Fees:** Must balance
- **Obligations sum matches manual total:** Cross-check against external list

### Data Validation Rules
- Revenue, COGS, labor, fixed ops must be non-negative
- Dates must be within the current week or recent past
- Location IDs must match the 4 defined units
- Debt balances must be non-negative
- Obligations due dates must be future or current

### Missing Data Handling
- **Stripe data missing:** Fall back to model-based estimates, show "Fallback" status
- **COGS missing:** Show $0 but flag "Missing vendor invoices"
- **Labor missing:** Show $0 but flag "Missing payroll data"
- **Fixed ops missing:** Show $0 but flag "Missing bills"

---

## 9. Automation Opportunities (Future)

### High-Value Automation
1. **Stripe API daily sync:** Fetch balance transactions nightly, cache locally
2. **Payroll CSV auto-import:** SFTP or email attachment → parse → load
3. **Vendor invoice extraction:** Flo email skill → OCR → structured data
4. **QuickBooks sync:** Bank feed → categorize → per-location split
5. **Weekly report email:** Auto-generate summary → email to John every Wednesday

### Medium-Value Automation
6. **Obligation due date alerts:** Email/Slack 3 days before due
7. **Negative unit alerts:** Email/Slack when location goes negative
8. **Debt payoff countdown:** Visual timeline showing weeks to $0 balance

### Low-Value Automation (manual is fine)
9. Fixed ops bill entry (low volume, manual is fast enough)
10. Debt account updates (monthly is fine, low frequency)

---

**Status:** Data source requirements documented  
**Next Action:** Share with John to confirm data availability and collection workflow
