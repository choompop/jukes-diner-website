#!/usr/bin/env node
// Read-only Stripe config smoke test. Does not print secret values and does not create charges/accounts.

const secret = process.env.STRIPE_SECRET_KEY || '';
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

const status = {
  secretKeyPresent: Boolean(secret),
  publishableKeyPresent: Boolean(publishable),
  secretMode: secret.startsWith('sk_live_') ? 'live' : secret.startsWith('sk_test_') ? 'test' : 'missing-or-unknown',
  publishableMode: publishable.startsWith('pk_live_') ? 'live' : publishable.startsWith('pk_test_') ? 'test' : 'missing-or-unknown',
  safeForLocalTesting: secret.startsWith('sk_test_') && publishable.startsWith('pk_test_'),
};

console.log(JSON.stringify(status, null, 2));

if (status.secretMode === 'live' || status.publishableMode === 'live') {
  console.error('Live Stripe key detected. Use test keys locally; keep live keys only in deployment secrets after rotation.');
  process.exitCode = 2;
}
