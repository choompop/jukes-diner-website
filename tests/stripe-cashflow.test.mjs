import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STRIPE_WEEKLY_CASHFLOW_UNITS,
  STRIPE_READ_ONLY_ENV_KEYS,
  STRIPE_READ_ONLY_RESTRICTED_KEY_PERMISSIONS,
  STRIPE_READ_ONLY_FORBIDDEN_PERMISSIONS,
  getStripeReadOnlyClientStatus,
  createStripeReadOnlyClient,
  normalizeStripeBalanceTransaction,
  normalizeStripeBalance,
  normalizeStripeWeeklyCashflow,
  buildStripeWeeklyCashflowViews,
} from '../lib/stripe-cashflow.mjs';
import { createDefaultFinancialManagement } from '../lib/franchise-financials.mjs';

test('stripe cashflow unit env map covers the four operating accounts', () => {
  assert.deepEqual(STRIPE_WEEKLY_CASHFLOW_UNITS.map((unit) => [unit.id, unit.accountEnvKey]), [
    ['event-truck', 'STRIPE_ACCOUNT_EVENT_TRUCK'],
    ['trailer-park', 'STRIPE_ACCOUNT_TRAILER_PARK'],
    ['east-nashville', 'STRIPE_ACCOUNT_EAST_NASHVILLE'],
    ['corporate-account', 'STRIPE_ACCOUNT_CORPORATE'],
  ]);
});

test('stripe read-only env contract and restricted-key policy stay reporting-only', () => {
  assert.deepEqual(STRIPE_READ_ONLY_ENV_KEYS, [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_ACCOUNT_EVENT_TRUCK',
    'STRIPE_ACCOUNT_TRAILER_PARK',
    'STRIPE_ACCOUNT_EAST_NASHVILLE',
    'STRIPE_ACCOUNT_CORPORATE',
  ]);
  assert.deepEqual(STRIPE_READ_ONLY_RESTRICTED_KEY_PERMISSIONS.map((permission) => [permission.resource, permission.permission]), [
    ['Balance', 'Read'],
    ['Balance transactions', 'Read'],
    ['Accounts', 'Read'],
  ]);
  assert.ok(STRIPE_READ_ONLY_FORBIDDEN_PERMISSIONS.every((permission) => /write/i.test(permission)));
  assert.ok(STRIPE_READ_ONLY_FORBIDDEN_PERMISSIONS.includes('Refunds write'));
});

test('read-only client status keeps dashboard safe when keys or account ids are missing', () => {
  const status = getStripeReadOnlyClientStatus({
    STRIPE_SECRET_KEY: '',
    STRIPE_ACCOUNT_EVENT_TRUCK: 'acct_event',
  });

  assert.equal(status.mode, 'mock');
  assert.equal(status.safeMode, true);
  assert.equal(status.canReadStripe, false);
  assert.equal(status.canMoveMoney, false);
  assert.equal(status.readyForReadOnlyReporting, false);
  assert.ok(status.missingKeys.includes('STRIPE_SECRET_KEY'));
  assert.ok(status.missingKeys.includes('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'));
  assert.ok(status.missingKeys.includes('STRIPE_WEBHOOK_SECRET'));
  assert.ok(status.accounts.find((account) => account.id === 'event-truck').accountIdPresent);
  assert.ok(status.accounts.find((account) => account.id === 'trailer-park').missingReason.includes('STRIPE_ACCOUNT_TRAILER_PARK'));
  assert.ok(status.statusChecklist.find((item) => item.id === 'connected-account-ids').detail.includes('1 of 4'));
  assert.ok(status.setupRequest.includes('dashboard hosting environment'));
  assert.equal(JSON.stringify(status).includes('acct_event'), false);
});

test('read-only client calls only injected read APIs in test mode and exposes no money movement methods', async () => {
  const calls = [];
  const client = createStripeReadOnlyClient({
    env: {
      STRIPE_SECRET_KEY: 'sk_test_hidden',
      STRIPE_ACCOUNT_EVENT_TRUCK: 'acct_event',
    },
    stripeFactory: (secretKey) => {
      calls.push(['factory', secretKey]);
      return {
        balanceTransactions: {
          list: async (params, options) => {
            calls.push(['balanceTransactions.list', params, options]);
            return { data: [{ id: 'txn_1', amount: 12500, fee: 390, net: 12110, type: 'charge', reporting_category: 'charge', created: 1778290000 }] };
          },
        },
        balance: {
          retrieve: async (params, options) => {
            calls.push(['balance.retrieve', params, options]);
            return { available: [{ amount: 7000, currency: 'usd' }], pending: [{ amount: 2500, currency: 'usd' }] };
          },
        },
      };
    },
  });

  const transactions = await client.listBalanceTransactions('acct_event', { limit: 3 });
  const balance = await client.retrieveBalance('acct_event');

  assert.equal(client.status.mode, 'test');
  assert.equal(client.status.canReadStripe, true);
  assert.deepEqual(transactions.data.map((txn) => txn.id), ['txn_1']);
  assert.equal(balance.available[0].amount, 7000);
  assert.deepEqual(calls[1], ['balanceTransactions.list', { limit: 3 }, { stripeAccount: 'acct_event' }]);
  assert.equal(client.charges, undefined);
  assert.equal(client.payouts, undefined);
  assert.equal(client.refunds, undefined);
  assert.equal(client.transfers, undefined);
  assert.equal(client.accountLinks, undefined);
});

test('transaction and balance normalization bucket Stripe dollars into revenue cogs labor and fixed ops', () => {
  const transactions = [
    { id: 'txn_revenue', amount: 10000, fee: 320, net: 9680, currency: 'usd', type: 'charge', reporting_category: 'charge', description: 'Card sale', created: 1778290000 },
    { id: 'txn_cogs', amount: -2700, fee: 0, net: -2700, currency: 'usd', type: 'adjustment', reporting_category: 'adjustment', description: 'Food vendor invoice', metadata: { cashflow_bucket: 'cogs' }, created: 1778290100 },
    { id: 'txn_labor', amount: -1800, fee: 0, net: -1800, currency: 'usd', type: 'adjustment', reporting_category: 'adjustment', description: 'Payroll labor', created: 1778290200 },
    { id: 'txn_fixed', amount: -950, fee: 0, net: -950, currency: 'usd', type: 'adjustment', reporting_category: 'adjustment', description: 'Rent utilities fixed ops', created: 1778290300 },
  ];

  assert.deepEqual(transactions.map(normalizeStripeBalanceTransaction).map((txn) => [txn.id, txn.bucket, txn.amount, txn.net]), [
    ['txn_revenue', 'revenue', 100, 96.8],
    ['txn_cogs', 'cogs', -27, -27],
    ['txn_labor', 'labor', -18, -18],
    ['txn_fixed', 'fixedOperations', -9.5, -9.5],
  ]);

  const cashflow = normalizeStripeWeeklyCashflow({
    unitId: 'event-truck',
    transactions,
    balance: { available: [{ amount: 7000, currency: 'usd' }], pending: [{ amount: 2500, currency: 'usd' }] },
  });

  assert.equal(cashflow.revenue, 100);
  assert.equal(cashflow.cogs, 27);
  assert.equal(cashflow.labor, 18);
  assert.equal(cashflow.fixedOperations, 9.5);
  assert.equal(cashflow.processingFees, 3.2);
  assert.equal(cashflow.netCashflow, 42.3);
  assert.deepEqual(normalizeStripeBalance(cashflow.balance), { available: 70, pending: 25, currency: 'usd' });
});

test('tax obligations bucket captures franchise excise and estimated tax payments', () => {
  const transactions = [
    { id: 'txn_revenue', amount: 15000, fee: 450, net: 14550, currency: 'usd', type: 'charge', reporting_category: 'charge', description: 'Card sale', created: 1778290000 },
    { id: 'txn_tn_franchise_tax', amount: -10000, fee: 0, net: -10000, currency: 'usd', type: 'adjustment', reporting_category: 'adjustment', description: 'TN franchise and excise tax payment', created: 1778290100 },
    { id: 'txn_federal_tax', amount: -25000, fee: 0, net: -25000, currency: 'usd', type: 'adjustment', reporting_category: 'adjustment', description: 'Federal quarterly estimated tax', created: 1778290200 },
    { id: 'txn_explicit_bucket', amount: -50000, fee: 0, net: -50000, currency: 'usd', type: 'adjustment', reporting_category: 'adjustment', description: 'State sales tax remittance', metadata: { cashflow_bucket: 'taxObligations' }, created: 1778290300 },
  ];

  const normalized = transactions.map(normalizeStripeBalanceTransaction);
  assert.deepEqual(normalized.map((txn) => [txn.id, txn.bucket, txn.amount]), [
    ['txn_revenue', 'revenue', 150],
    ['txn_tn_franchise_tax', 'taxObligations', -100],
    ['txn_federal_tax', 'taxObligations', -250],
    ['txn_explicit_bucket', 'taxObligations', -500],
  ]);

  const cashflow = normalizeStripeWeeklyCashflow({
    unitId: 'event-truck',
    transactions,
    balance: { available: [{ amount: 5000, currency: 'usd' }], pending: [] },
  });

  assert.equal(cashflow.revenue, 150);
  assert.equal(cashflow.taxObligations, 850);
  assert.equal(cashflow.processingFees, 4.5);
  assert.equal(cashflow.netCashflow, -704.5);
});

test('weekly cashflow views show clear missing status per account without live Stripe calls', () => {
  const views = buildStripeWeeklyCashflowViews(createDefaultFinancialManagement(), {
    env: {
      STRIPE_SECRET_KEY: 'sk_test_hidden',
      STRIPE_ACCOUNT_EVENT_TRUCK: 'acct_event',
      STRIPE_ACCOUNT_EAST_NASHVILLE: 'acct_east',
    },
    stripeData: {
      'event-truck': {
        transactions: [{ id: 'txn_event', amount: 25000, fee: 800, net: 24200, currency: 'usd', type: 'charge', reporting_category: 'charge', created: 1778290000 }],
        balance: { available: [{ amount: 12000, currency: 'usd' }], pending: [] },
      },
    },
  });

  assert.equal(views.status.mode, 'test');
  assert.equal(views.status.canMoveMoney, false);
  assert.equal(views.units.find((unit) => unit.id === 'event-truck').source, 'stripe-mock');
  assert.equal(views.units.find((unit) => unit.id === 'event-truck').cashflow.revenue, 250);
  assert.equal(views.units.find((unit) => unit.id === 'trailer-park').source, 'fallback-model');
  assert.ok(views.units.find((unit) => unit.id === 'trailer-park').statusMessage.includes('Missing STRIPE_ACCOUNT_TRAILER_PARK'));
  assert.ok(views.dashboardMessage.includes('2 of 4 Stripe account IDs configured'));
  assert.ok(views.dashboardMessage.includes('money movement disabled'));
});
