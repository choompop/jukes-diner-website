import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createDefaultStripeConnectModel,
  getStripeConnectConfigStatus,
  getStripeConnectAccountStatus,
  getStripeConnectSafeActions,
} from '../lib/stripe-connect.mjs';

test('stripe connect config status checks key presence without exposing secret values', () => {
  const status = getStripeConnectConfigStatus({
    STRIPE_SECRET_KEY: 'sk_test_hidden',
    STRIPE_WEBHOOK_SECRET: 'whsec_hidden',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_hidden',
  });

  assert.equal(status.readyForMockedConnect, true);
  assert.equal(status.readyForLiveAccountLinks, false);
  assert.equal(status.keysPresent.STRIPE_SECRET_KEY, true);
  assert.equal(status.keysPresent.STRIPE_WEBHOOK_SECRET, true);
  assert.equal(status.keysPresent.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, true);
  assert.ok(status.missingKeys.includes('STRIPE_ACCOUNT_EVENT_TRUCK'));
  assert.ok(status.restrictedKeyPermissions.some((permission) => permission.resource === 'Balance transactions'));
  assert.ok(status.forbiddenPermissions.includes('Payouts write'));
  assert.equal(JSON.stringify(status).includes('sk_test_hidden'), false);
  assert.equal(JSON.stringify(status).includes('whsec_hidden'), false);
});

test('stripe connect model defaults to safe disabled onboarding when keys are missing', () => {
  const model = createDefaultStripeConnectModel({});

  assert.equal(model.mode, 'mock');
  assert.equal(model.account.status, 'not_connected');
  assert.equal(model.account.chargesEnabled, false);
  assert.equal(model.account.payoutsEnabled, false);
  assert.ok(model.guardrails.some((guardrail) => /No live charges/i.test(guardrail)));
  assert.ok(model.nextSteps.some((step) => /keys/i.test(step)));
});

test('stripe connect account status summarizes missing requirements and safe next actions', () => {
  const account = getStripeConnectAccountStatus({
    accountId: 'acct_mock_123',
    detailsSubmitted: true,
    chargesEnabled: false,
    payoutsEnabled: false,
    requirements: {
      currently_due: ['external_account'],
      eventually_due: ['company.tax_id'],
      disabled_reason: 'requirements.past_due',
    },
  });
  const actions = getStripeConnectSafeActions(account);

  assert.equal(account.status, 'restricted');
  assert.deepEqual(account.currentlyDue, ['external_account']);
  assert.equal(account.canPullBalances, false);
  assert.ok(actions.some((action) => /external_account/i.test(action.label)));
  assert.ok(actions.every((action) => action.liveMoneyMovement === false));
});
