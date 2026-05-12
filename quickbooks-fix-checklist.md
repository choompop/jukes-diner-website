# QuickBooks Bank Feed Fix — Action Checklist for John

**BEFORE YOU START:** This checklist involves submitting payment. Review charges before confirming.

## Step 1: Verify the Problem (5 minutes)

- [ ] Login to QuickBooks Online at qbo.intuit.com
- [ ] Go to: Settings (gear icon) → Account and Settings → Billing & Subscription
- [ ] Screenshot or note:
  - Subscription status (Active / Past Due / Suspended)
  - Payment failure message (if any)
  - Last payment date
  - Current card on file (last 4 digits)
- [ ] Go to: Banking → Bank and Credit Cards
- [ ] Check each bank account connection status (Active / Error)
- [ ] Note last successful download date

## Step 2: Update Payment Method (10 minutes)

**Most common fix — expired or failed card:**

- [ ] Still in Settings → Billing & Subscription
- [ ] Click "Edit" next to Payment Method
- [ ] Enter updated card details:
  - [ ] Card number
  - [ ] Expiration date
  - [ ] CVV
  - [ ] Billing ZIP
- [ ] Click "Save"
- [ ] If prompted "Retry Payment", click it and confirm charge amount
- [ ] Wait for confirmation email from Intuit (usually arrives within 5 minutes)

## Step 3: Reconnect Bank Feeds (15 minutes)

**Wait 15-30 minutes after payment clears, then:**

- [ ] Go to: Banking → Bank and Credit Cards
- [ ] For each disconnected account:
  - [ ] Click "Edit" (pencil icon)
  - [ ] Click "Sign in as [bank name]" or "Edit sign-in info"
  - [ ] Enter online banking username/password
  - [ ] Complete MFA (text code / app approval)
  - [ ] Click "Save and Close"
- [ ] Click "Update" button next to each account
- [ ] Wait 5-15 minutes for transactions to download
- [ ] Verify green checkmark and recent "Last updated" timestamp

## Step 4: Verify Success

- [ ] Settings → Billing shows "Active" status
- [ ] Banking page shows green checkmarks on all accounts
- [ ] Recent transactions (last 1-3 days) appear in feed
- [ ] No red error banners

## If This Doesn't Work

**Card declined or payment won't process:**
1. Call your card issuer to verify no fraud block
2. Try alternate payment method in QuickBooks
3. Call QuickBooks Support: 1-800-446-8848

**Payment went through but feeds still broken:**
1. Check status.intuit.com for service outages
2. Try disconnecting and re-adding bank (Banking → Edit → Disconnect, then Add account)
3. Contact QuickBooks Support with:
   - Company ID (Settings → Account and Settings → Company)
   - Bank name
   - Error message screenshot

**Need help now:**
- QuickBooks Support: 1-800-446-8848 (Mon-Fri 6 AM - 6 PM PT)
- Live chat: QuickBooks → Help (?) → Contact Us
- Escalation note: "Subscription payment resolved but bank feeds still disconnected"

## After Resolution

**Notify if needed:**
- [ ] Email BizBud (accountant/bookkeeper) if they're waiting on bank data
- [ ] Update weekly finance rhythm checklist to include bank feed verification

**Prevent future issues:**
- [ ] Set calendar reminder 30 days before card expiration
- [ ] Enable billing email notifications (Settings → Billing → Email Preferences)
- [ ] Consider adding backup payment method

## Completion Checklist

When done, confirm:
- [ ] QuickBooks subscription shows "Active"
- [ ] All bank accounts show green "Connected" status
- [ ] Transactions downloading normally (check 2-3 days of recent activity)
- [ ] Payment confirmation saved/filed (per document retention policy)
- [ ] BizBud notified (if applicable)

## Questions? Blockers?

If you hit a blocker or need clarification:
1. Comment on Kanban task t_2b2d5d11 with specific question
2. Or: Update Notion task with blocker details
3. Finance agent will respond with next steps

## Reference

Full technical details: brain/files/quickbooks-bank-feed-restoration.md
