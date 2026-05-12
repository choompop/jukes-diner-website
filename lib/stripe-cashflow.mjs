// Stripe read-only cashflow integration for Juke's Diner dashboard
// GUARDRAILS: no charges, payouts, transfers, refunds, or account links from automation

export const STRIPE_WEEKLY_CASHFLOW_UNITS = [
  { id: 'event-truck', name: 'Event Truck', accountEnvKey: 'STRIPE_ACCOUNT_EVENT_TRUCK' },
  { id: 'trailer-park', name: 'Trailer Park', accountEnvKey: 'STRIPE_ACCOUNT_TRAILER_PARK' },
  { id: 'east-nashville', name: 'East Nashville', accountEnvKey: 'STRIPE_ACCOUNT_EAST_NASHVILLE' },
  { id: 'corporate-account', name: 'Corporate Account', accountEnvKey: 'STRIPE_ACCOUNT_CORPORATE' },
];

export const STRIPE_READ_ONLY_ENV_KEYS = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  ...STRIPE_WEEKLY_CASHFLOW_UNITS.map((unit) => unit.accountEnvKey),
];

export const STRIPE_READ_ONLY_RESTRICTED_KEY_PERMISSIONS = [
  {
    resource: 'Balance',
    permission: 'Read',
    reason: 'Show available and pending cash by connected account.',
  },
  {
    resource: 'Balance transactions',
    permission: 'Read',
    reason: 'Build weekly cashflow buckets from settled Stripe ledger activity.',
  },
  {
    resource: 'Accounts',
    permission: 'Read',
    reason: 'Verify connected-account status and requirements without creating account links.',
  },
];

export const STRIPE_READ_ONLY_FORBIDDEN_PERMISSIONS = [
  'Charges write',
  'Refunds write',
  'Payouts write',
  'Transfers write',
  'Payment Links write',
  'Products write',
  'Prices write',
  'Customers write',
  'Accounts write',
  'Account Links write',
];

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getStripeReadOnlyClientStatus(env = {}) {
  const secretKeyPresent = hasValue(env.STRIPE_SECRET_KEY);
  const publishableKeyPresent = hasValue(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const webhookSecretPresent = hasValue(env.STRIPE_WEBHOOK_SECRET);
  const mode = secretKeyPresent ? 'test' : 'mock';
  const safeMode = true;
  const canReadStripe = secretKeyPresent;
  const canMoveMoney = false;

  const keysPresent = Object.fromEntries(
    STRIPE_READ_ONLY_ENV_KEYS.map((key) => [key, hasValue(env[key])]),
  );
  const missingKeys = STRIPE_READ_ONLY_ENV_KEYS.filter((key) => !keysPresent[key]);

  const accounts = STRIPE_WEEKLY_CASHFLOW_UNITS.map((unit) => {
    const accountIdPresent = hasValue(env[unit.accountEnvKey]);
    return {
      id: unit.id,
      name: unit.name,
      accountEnvKey: unit.accountEnvKey,
      accountIdPresent,
      missingReason: accountIdPresent ? null : `Missing ${unit.accountEnvKey}`,
    };
  });

  const configuredAccounts = accounts.filter((account) => account.accountIdPresent).length;
  const statusChecklist = [
    {
      id: 'restricted-secret-key',
      label: 'Stripe restricted secret key installed',
      complete: secretKeyPresent,
      envKey: 'STRIPE_SECRET_KEY',
      required: true,
    },
    {
      id: 'publishable-key',
      label: 'Publishable key installed for dashboard status checks',
      complete: publishableKeyPresent,
      envKey: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      required: true,
    },
    {
      id: 'webhook-secret',
      label: 'Webhook signing secret recorded for later event verification',
      complete: webhookSecretPresent,
      envKey: 'STRIPE_WEBHOOK_SECRET',
      required: true,
    },
    {
      id: 'connected-account-ids',
      label: 'Four Stripe connected account IDs mapped to Juke units',
      complete: configuredAccounts === accounts.length,
      envKey: STRIPE_WEEKLY_CASHFLOW_UNITS.map((unit) => unit.accountEnvKey).join(', '),
      required: true,
      detail: `${configuredAccounts} of ${accounts.length} account IDs configured`,
    },
    {
      id: 'money-movement-disabled',
      label: 'Money movement remains disabled in code and dashboard copy',
      complete: true,
      required: true,
    },
  ];

  const setupRequest = missingKeys.length
    ? `Add these production env vars in the dashboard hosting environment: ${missingKeys.join(', ')}. Use a Stripe restricted secret key with read-only Balance, Balance transactions, and Accounts permissions only; do not grant write permissions for charges, refunds, payouts, transfers, products, customers, accounts, or account links.`
    : 'All required Stripe env vars are present; keep using read-only restricted-key permissions and leave money movement disabled.';

  return {
    mode,
    safeMode,
    canReadStripe,
    canMoveMoney,
    secretKeyPresent,
    publishableKeyPresent,
    webhookSecretPresent,
    keysPresent,
    missingKeys,
    accounts,
    configuredAccounts,
    totalAccounts: accounts.length,
    readyForReadOnlyReporting: missingKeys.length === 0,
    statusChecklist,
    setupRequest,
    restrictedKeyPermissions: STRIPE_READ_ONLY_RESTRICTED_KEY_PERMISSIONS,
    forbiddenPermissions: STRIPE_READ_ONLY_FORBIDDEN_PERMISSIONS,
  };
}

export function createStripeReadOnlyClient({ env = {}, stripeFactory = null } = {}) {
  const status = getStripeReadOnlyClientStatus(env);

  if (!status.canReadStripe) {
    return {
      status,
      listBalanceTransactions: async () => ({ data: [] }),
      retrieveBalance: async () => ({ available: [], pending: [] }),
    };
  }

  const stripe = stripeFactory ? stripeFactory(env.STRIPE_SECRET_KEY) : null;

  return {
    status,
    listBalanceTransactions: async (accountId, params = {}) => {
      const options = { stripeAccount: accountId };
      return stripe.balanceTransactions.list(params, options);
    },
    retrieveBalance: async (accountId) => {
      const options = { stripeAccount: accountId };
      return stripe.balance.retrieve({}, options);
    },
  };
}

export function normalizeStripeBalanceTransaction(txn) {
  // Convert Stripe cents to dollars
  const amount = txn.amount / 100;
  const fee = (txn.fee || 0) / 100;
  const net = txn.net / 100;

  // Bucket determination
  let bucket = 'revenue';
  
  if (txn.type === 'charge' || txn.reporting_category === 'charge') {
    bucket = 'revenue';
  } else if (txn.metadata?.cashflow_bucket) {
    bucket = txn.metadata.cashflow_bucket;
  } else if (txn.description?.toLowerCase().includes('food') || txn.description?.toLowerCase().includes('vendor')) {
    bucket = 'cogs';
  } else if (txn.description?.toLowerCase().includes('labor') || txn.description?.toLowerCase().includes('payroll')) {
    bucket = 'labor';
  } else if (txn.description?.toLowerCase().includes('rent') || txn.description?.toLowerCase().includes('utilities') || txn.description?.toLowerCase().includes('fixed')) {
    bucket = 'fixedOperations';
  } else if (txn.description?.toLowerCase().includes('tax') && (txn.description?.toLowerCase().includes('franchise') || txn.description?.toLowerCase().includes('excise') || txn.description?.toLowerCase().includes('estimated'))) {
    bucket = 'taxObligations';
  }

  return {
    id: txn.id,
    amount,
    fee,
    net,
    bucket,
    currency: txn.currency,
    type: txn.type,
    description: txn.description || '',
    created: txn.created,
  };
}

export function normalizeStripeBalance(balance) {
  const available = balance.available && balance.available[0] ? balance.available[0].amount / 100 : 0;
  const pending = balance.pending && balance.pending[0] ? balance.pending[0].amount / 100 : 0;
  const currency = balance.currency || (balance.available && balance.available[0]?.currency) || 'usd';

  return {
    available,
    pending,
    currency,
  };
}

export function normalizeStripeWeeklyCashflow({ unitId, transactions, balance }) {
  const normalized = transactions.map(normalizeStripeBalanceTransaction);

  let revenue = 0;
  let cogs = 0;
  let labor = 0;
  let fixedOperations = 0;
  let taxObligations = 0;
  let processingFees = 0;

  normalized.forEach((txn) => {
    if (txn.bucket === 'revenue') {
      revenue += Math.abs(txn.amount);
      processingFees += Math.abs(txn.fee);
    } else if (txn.bucket === 'cogs') {
      cogs += Math.abs(txn.amount);
    } else if (txn.bucket === 'labor') {
      labor += Math.abs(txn.amount);
    } else if (txn.bucket === 'fixedOperations') {
      fixedOperations += Math.abs(txn.amount);
    } else if (txn.bucket === 'taxObligations') {
      taxObligations += Math.abs(txn.amount);
    }
  });

  const netCashflow = revenue - cogs - labor - fixedOperations - taxObligations - processingFees;

  return {
    unitId,
    revenue,
    cogs,
    labor,
    fixedOperations,
    taxObligations,
    processingFees,
    netCashflow,
    balance,
  };
}

export function buildStripeWeeklyCashflowViews(financialModel, { env = {}, stripeData = {} } = {}) {
  const status = getStripeReadOnlyClientStatus(env);

  const units = STRIPE_WEEKLY_CASHFLOW_UNITS.map((unit) => {
    const account = status.accounts.find((a) => a.id === unit.id);
    const hasData = stripeData[unit.id];

    let source = 'fallback-model';
    let cashflow = financialModel.units.find((u) => u.id === unit.id)?.weekly || {
      sales: 0,
      cogs: 0,
      labor: 0,
      fixedOperations: 0,
    };
    let statusMessage = account.missingReason || 'Fallback to model data';

    if (hasData && account.accountIdPresent) {
      source = 'stripe-mock';
      const normalized = normalizeStripeWeeklyCashflow({
        unitId: unit.id,
        transactions: stripeData[unit.id].transactions,
        balance: stripeData[unit.id].balance,
      });
      cashflow = {
        revenue: normalized.revenue,
        cogs: normalized.cogs,
        labor: normalized.labor,
        fixedOperations: normalized.fixedOperations,
        taxObligations: normalized.taxObligations,
        processingFees: normalized.processingFees,
        netCashflow: normalized.netCashflow,
      };
      statusMessage = 'Connected to Stripe (test data)';
    }

    return {
      id: unit.id,
      name: unit.name,
      source,
      statusMessage,
      cashflow,
    };
  });

  const configuredCount = status.configuredAccounts;
  const totalCount = status.totalAccounts;
  const dashboardMessage = status.readyForReadOnlyReporting
    ? `${configuredCount} of ${totalCount} Stripe account IDs configured; read-only reporting ready; money movement disabled`
    : `${configuredCount} of ${totalCount} Stripe account IDs configured; missing ${status.missingKeys.join(', ')}; money movement disabled`;

  return {
    status,
    units,
    dashboardMessage,
    setupRequest: status.setupRequest,
    statusChecklist: status.statusChecklist,
    restrictedKeyPermissions: status.restrictedKeyPermissions,
    forbiddenPermissions: status.forbiddenPermissions,
  };
}
