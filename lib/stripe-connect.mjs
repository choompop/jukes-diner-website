const STRIPE_ENV_KEYS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
];

const DEFAULT_GUARDRAILS = [
  'No live charges, payouts, transfers, refunds, or payment links from automation.',
  'Account links stay disabled until John explicitly approves live onboarding.',
  'Show key presence and account requirements only; never print or store secret values.',
  'Use mocked status data for dashboard design until a Stripe account is connected.',
];

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function stripeMode(env = process.env) {
  const key = env.STRIPE_SECRET_KEY || '';
  if (key.startsWith('sk_live_')) return 'live-configured';
  if (key.startsWith('sk_test_')) return 'test-configured';
  return 'mock';
}

export function getStripeConnectConfigStatus(env = process.env) {
  const keysPresent = Object.fromEntries(
    STRIPE_ENV_KEYS.map((key) => [key, hasValue(env[key])]),
  );
  const missingKeys = STRIPE_ENV_KEYS.filter((key) => !keysPresent[key]);
  const mode = stripeMode(env);

  return {
    mode,
    keysPresent,
    missingKeys,
    readyForMockedConnect: true,
    readyForLiveAccountLinks: false,
    readyForLiveMoneyMovement: false,
    warning: missingKeys.length
      ? 'Stripe keys are not configured; dashboard remains in safe mock mode.'
      : 'Stripe keys are present, but live onboarding remains disabled by guardrail.',
  };
}

export function getStripeConnectAccountStatus(account = {}) {
  const requirements = account.requirements || {};
  const currentlyDue = Array.isArray(requirements.currently_due) ? requirements.currently_due : [];
  const eventuallyDue = Array.isArray(requirements.eventually_due) ? requirements.eventually_due : [];
  const chargesEnabled = account.chargesEnabled === true || account.charges_enabled === true;
  const payoutsEnabled = account.payoutsEnabled === true || account.payouts_enabled === true;
  const detailsSubmitted = account.detailsSubmitted === true || account.details_submitted === true;
  const disabledReason = requirements.disabled_reason || account.disabledReason || '';

  let status = 'not_connected';
  if (account.accountId || account.id) {
    status = chargesEnabled && payoutsEnabled && currentlyDue.length === 0 ? 'connected' : 'restricted';
  } else if (detailsSubmitted) {
    status = 'pending';
  }

  return {
    accountId: account.accountId || account.id || null,
    status,
    detailsSubmitted,
    chargesEnabled,
    payoutsEnabled,
    currentlyDue,
    eventuallyDue,
    disabledReason,
    canPullBalances: chargesEnabled && payoutsEnabled && currentlyDue.length === 0,
    canCreateAccountLink: false,
  };
}

export function getStripeConnectSafeActions(account = {}) {
  const status = Array.isArray(account.currentlyDue)
    ? account
    : getStripeConnectAccountStatus(account);
  const actions = [];

  if (!status.accountId) {
    actions.push({
      id: 'prepare-connect-onboarding',
      label: 'Prepare mocked Stripe Connect onboarding screen',
      description: 'Design the account connection flow behind tests and feature flags before creating real account links.',
      liveMoneyMovement: false,
    });
  }

  if (status.currentlyDue.length > 0) {
    actions.push({
      id: 'resolve-currently-due-requirements',
      label: `Collect missing Stripe requirements: ${status.currentlyDue.join(', ')}`,
      description: 'Show what the connected account still owes before balances or payouts can be trusted.',
      liveMoneyMovement: false,
    });
  }

  actions.push({
    id: 'keep-money-movement-disabled',
    label: 'Keep live money movement disabled',
    description: 'Only display connection/readiness status until explicit approval and production credentials exist.',
    liveMoneyMovement: false,
  });

  return actions;
}

export function createDefaultStripeConnectModel(env = process.env, account = {}) {
  const config = getStripeConnectConfigStatus(env);
  const accountStatus = getStripeConnectAccountStatus(account);

  return {
    title: 'Stripe Connect Readiness',
    mode: config.mode,
    config,
    account: accountStatus,
    guardrails: DEFAULT_GUARDRAILS,
    safeActions: getStripeConnectSafeActions(accountStatus),
    nextSteps: config.missingKeys.length
      ? [
          `Add missing Stripe keys later: ${config.missingKeys.join(', ')}.`,
          'Keep the dashboard in mock mode until John approves live Connect onboarding.',
          'After keys exist, fetch account status read-only before any balances/transactions work.',
        ]
      : [
          'Use test-mode Stripe Connect only after explicit approval for account-link creation.',
          'Display requirements/status before adding balances, charges, or payout views.',
          'Add webhook verification tests before consuming Stripe events.',
        ],
  };
}
