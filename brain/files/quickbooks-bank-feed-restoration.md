# QuickBooks Bank Feed Restoration — Payment Blocker Resolution

## Problem Summary
Bank feeds in QuickBooks may be blocked due to unresolved subscription payment or billing issue. This prevents automatic transaction imports, impairing bookkeeping workflow.

## Pre-Resolution Verification (Read-Only)

**What can be checked WITHOUT making changes:**

1. **Login to QuickBooks Online** (or Desktop if applicable)
   - Navigate to: Settings (gear icon) → Account and Settings → Billing & Subscription
   - Check for:
     - Red banner/alert about payment failure
     - Subscription status (Active vs. Past Due vs. Suspended)
     - Last successful payment date
     - Current payment method on file (last 4 digits of card)

2. **Check Bank Feed Status**
   - Navigate to: Banking → Bank and Credit Cards (or Transactions → Banking)
   - For each connected account, verify:
     - Connection status (Active vs. Error vs. Action Required)
     - Last successful download date
     - Any error messages displayed

3. **Review Email Notifications**
   - Search inbox for emails from:
     - `noreply@notification.intuit.com`
     - `QuickBooks`
     - `Intuit`
   - Look for: Payment failure notices, subscription suspension warnings, billing update requests

4. **Check Credit Card Status** (external to QuickBooks)
   - Verify the card on file is:
     - Not expired
     - Not blocked/frozen by issuing bank
     - Has available credit for the subscription charge
     - Not recently replaced (new card number after fraud/loss)

## Resolution Steps (Requires Admin Access)

**IMPORTANT: These steps involve payment submission. Do NOT proceed without John's explicit approval.**

### Option A: Update Payment Method (Most Common)

1. **Login to QuickBooks Online**
   - Go to: Settings (gear icon) → Account and Settings → Billing & Subscription

2. **Update Payment Method**
   - Click "Edit" next to Payment Method
   - Enter new/updated credit card information:
     - Card number
     - Expiration date
     - CVV/security code
     - Billing ZIP code
   - Click "Save"

3. **Retry Failed Payment**
   - If prompted, click "Retry Payment" or "Pay Now"
   - Confirm the charge amount matches expected subscription cost
   - Submit payment

4. **Verify Subscription Reactivation**
   - Refresh page and confirm status shows "Active"
   - Check for confirmation email from Intuit

### Option B: One-Time Manual Payment

If automatic retry fails or account is suspended:

1. **Navigate to Billing Section**
   - Settings → Account and Settings → Billing & Subscription
   - Look for "Pay Now" or "Make a Payment" button

2. **Complete Manual Payment**
   - Review outstanding balance (may include late fees)
   - Select payment method or add new card
   - Submit payment
   - Save confirmation number/receipt

### Option C: Contact QuickBooks Support

If payment update doesn't resolve the issue:

1. **Gather Information First:**
   - Company ID (found in Settings → Account and Settings → Company)
   - Subscription type (e.g., QuickBooks Online Plus, Essentials)
   - Error messages (screenshot if possible)
   - Last successful payment date
   - Current payment method (last 4 digits)

2. **Contact QuickBooks Support:**
   - Phone: 1-800-4-INTUIT (1-800-446-8848)
   - Or: Within QuickBooks, click Help (?) → Contact Us
   - Hours: Mon-Fri 6 AM - 6 PM PT, Sat 6 AM - 3 PM PT

3. **Request Specific Fix:**
   - "Subscription payment failed, bank feeds are blocked"
   - Ask for immediate reactivation if payment is processed during call
   - Confirm bank feed reconnection timeline

## Post-Resolution Verification

**After payment is submitted and confirmed:**

1. **Wait 15-30 minutes** for system to process payment and reactivate services

2. **Reconnect Bank Feeds** (if still disconnected):
   - Go to: Banking → Bank and Credit Cards
   - For each disconnected account:
     - Click "Edit" (pencil icon)
     - Click "Sign in as (bank name)" or "Edit sign-in info"
     - Re-enter online banking credentials
     - Complete any multi-factor authentication (MFA)
     - Click "Save and Close"

3. **Test Feed Sync:**
   - Click "Update" button next to each bank account
   - Verify transactions begin downloading
   - Expected wait: 5-15 minutes for first sync after reconnection

4. **Verify No Errors:**
   - Check for green checkmark or "Last updated: [today's date]"
   - Confirm transaction count shows recent activity

## Expected Timeline

- **Payment processing:** Immediate to 24 hours
- **Subscription reactivation:** 15 minutes to 2 hours
- **Bank feed reconnection:** Immediate after reactivation
- **First transaction download:** 5-15 minutes after reconnection

## If Bank Feeds Still Don't Work After Payment

This suggests the issue is NOT payment-related. Check:

1. **Bank-Side Authorization:**
   - Some banks require re-authorization every 90 days
   - Login directly to online banking to verify account is accessible
   - Check for any security alerts or required actions

2. **QuickBooks Server Issues:**
   - Check status.intuit.com for service outages
   - Verify bank is still on supported institutions list

3. **Account Permissions:**
   - Ensure QuickBooks login has "Company Admin" role
   - Some bank feed features require master admin access

## BizBud Communication (If Applicable)

**If BizBud (accountant/bookkeeper) needs notification:**

### Draft Reply (DO NOT SEND without approval):

---
Subject: QuickBooks Bank Feed — Payment Resolved [or Status Update]

Hi [BizBud contact name],

The QuickBooks subscription payment issue has been resolved:

- Updated payment method: [Card ending in ####]
- Payment processed: [Date]
- Subscription status: Active
- Bank feeds reconnected: [Date/Time]
- Last successful transaction download: [Date]

OR (if still unresolved):

I've identified the subscription payment blocker in QuickBooks. The following action is required:

[Specific step needed]

I'm awaiting [John's approval / payment processing / bank authorization] to complete the fix. Expected resolution: [timeframe].

Please let me know if you need:
- Access to download transactions manually
- Historical transaction file export (CSV)
- Alternative bookkeeping workflow while feeds are down

Thanks,
[John's signature or agent signature]

---

## Important Notes

- **Do NOT share QuickBooks login credentials** via email or unsecured channels
- **Verify charge amounts** before submitting payment (watch for unexpected rate increases)
- **Save payment confirmation** for record-keeping (per document retention checklist)
- **Update payment method expiration date** in calendar to prevent future lapses

## Related Documents

- [[financial-kpi-dictionary]] — KPIs depend on accurate bank feed data
- [[weekly-finance-rhythm]] — Daily close requires working bank feeds
- [[document-retention-checklist]] — Bank statements and P&L storage requirements

## Maintenance

**Recommended ongoing practice:**
- Set calendar reminder 30 days before credit card expiration
- Enable QuickBooks billing notifications (Settings → Billing → Email Preferences)
- Verify bank feeds weekly during finance review rhythm
- Keep backup payment method on file (prevents future service interruptions)

## Last Updated
2026-05-08 — Created by jukes-finance-agent during Notion intake task t_2b2d5d11
