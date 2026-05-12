import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createDashboardSessionToken,
  verifyDashboardSessionToken,
  requireDashboardApiAuth,
  applyDashboardSessionCookie,
  clearDashboardSessionCookie,
  DASHBOARD_SESSION_COOKIE,
  hashDashboardPassword,
  authenticateDashboardUser,
} from '../lib/dashboard-auth.mjs';

function withAuthEnv(env, fn) {
  const keys = [
    'NODE_ENV',
    'DASHBOARD_ADMIN_USERS',
    'DASHBOARD_ADMIN_USERNAME',
    'DASHBOARD_ADMIN_PASSWORD_HASH',
    'DASHBOARD_ADMIN_PASSWORD',
  ];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  Object.assign(process.env, env);
  try {
    return fn();
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
}

function mockCookieResponse() {
  const writes = [];
  return {
    writes,
    cookies: {
      set(name, value, options) {
        writes.push({ name, value, options });
      },
    },
  };
}

test('dashboard auth creates and verifies expiring signed sessions', () => {
  const now = Date.parse('2026-05-08T12:00:00Z');
  const token = createDashboardSessionToken('john', now);
  const session = verifyDashboardSessionToken(token, now + 1000);

  assert.equal(session.user, 'john');
  assert.equal(verifyDashboardSessionToken(`${token}tampered`, now + 1000), null);
  assert.equal(verifyDashboardSessionToken(token, now + 1000 * 60 * 60 * 13), null);
});

test('dashboard API auth allows localhost development but rejects public unauthenticated requests', () => {
  const publicRequest = {
    cookies: { get: () => null },
    headers: { get: (key) => key === 'host' ? 'jukes.example.com' : '' },
  };
  const localRequest = {
    cookies: { get: () => null },
    headers: { get: (key) => key === 'host' ? 'localhost:3007' : '' },
  };

  assert.equal(requireDashboardApiAuth(publicRequest).ok, false);
  assert.equal(requireDashboardApiAuth(localRequest).ok, true);
});

test('dashboard login authenticates hashed env admin users without plaintext passwords in code', () => {
  const johnHash = hashDashboardPassword('correct horse battery staple', 'john-salt');

  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_ADMIN_USERS: JSON.stringify([
      { username: 'john', passwordHash: johnHash, role: 'admin' },
    ]),
  }, () => {
    assert.deepEqual(authenticateDashboardUser(' John ', 'correct horse battery staple'), {
      username: 'john',
      role: 'admin',
    });
    assert.equal(authenticateDashboardUser('john', 'wrong'), null);
    assert.equal(authenticateDashboardUser('daniel', 'correct horse battery staple'), null);
  });
});

test('dashboard login supports one env-bootstrapped admin hash and rejects dev plaintext in production', () => {
  const adminHash = hashDashboardPassword('deploy-only-secret', 'admin-salt');

  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_ADMIN_USERNAME: 'Owner',
    DASHBOARD_ADMIN_PASSWORD_HASH: adminHash,
    DASHBOARD_ADMIN_PASSWORD: 'local-only-secret',
  }, () => {
    assert.deepEqual(authenticateDashboardUser('owner', 'deploy-only-secret'), {
      username: 'owner',
      role: 'admin',
    });
    assert.equal(authenticateDashboardUser('owner', 'local-only-secret'), null);
  });
});

test('dashboard local development can use an explicit env password but has no hardcoded shared fallback', () => {
  withAuthEnv({
    NODE_ENV: 'development',
    DASHBOARD_ADMIN_USERNAME: 'local-admin',
    DASHBOARD_ADMIN_PASSWORD: 'developer-owned-secret',
  }, () => {
    assert.deepEqual(authenticateDashboardUser('LOCAL-ADMIN', 'developer-owned-secret'), {
      username: 'local-admin',
      role: 'admin',
    });
  });

  withAuthEnv({ NODE_ENV: 'development' }, () => {
    assert.equal(authenticateDashboardUser('john', 'juke2026'), null);
  });
});

test('dashboard login and logout write secure session cookie state', () => {
  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_AUTH_SECRET: 'test-secret-key-for-cookie-test',
  }, () => {
    const loginResponse = mockCookieResponse();
    applyDashboardSessionCookie(loginResponse, { username: 'john', role: 'admin' });

    assert.equal(loginResponse.writes[0].name, DASHBOARD_SESSION_COOKIE);
    assert.equal(loginResponse.writes[0].options.httpOnly, true);
    assert.equal(loginResponse.writes[0].options.secure, true);
    assert.equal(verifyDashboardSessionToken(loginResponse.writes[0].value).user, 'john');

    const logoutResponse = mockCookieResponse();
    clearDashboardSessionCookie(logoutResponse);
    assert.equal(logoutResponse.writes[0].name, DASHBOARD_SESSION_COOKIE);
    assert.equal(logoutResponse.writes[0].value, '');
    assert.equal(logoutResponse.writes[0].options.maxAge, 0);
  });
});
