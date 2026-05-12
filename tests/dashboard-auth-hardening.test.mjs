import test from 'node:test';
import assert from 'node:assert/strict';

import {
  authenticateDashboardUser,
  hashDashboardPassword,
} from '../lib/dashboard-auth.mjs';

function withAuthEnv(env, fn) {
  const keys = [
    'NODE_ENV',
    'DASHBOARD_ADMIN_USERS',
    'DASHBOARD_ADMIN_USERNAME',
    'DASHBOARD_ADMIN_PASSWORD_HASH',
    'DASHBOARD_ADMIN_PASSWORD',
    'DASHBOARD_AUTH_SECRET',
    'NEXTAUTH_SECRET',
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

test('production mode rejects plaintext DASHBOARD_ADMIN_PASSWORD when no hash present', () => {
  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_ADMIN_USERNAME: 'admin',
    DASHBOARD_ADMIN_PASSWORD: 'plaintext-not-allowed',
  }, () => {
    assert.throws(
      () => authenticateDashboardUser('admin', 'plaintext-not-allowed'),
      /DASHBOARD_ADMIN_PASSWORD is not allowed in production/
    );
  });
});

test('production mode allows plaintext password if hash is also present (hash takes precedence)', () => {
  const hash = hashDashboardPassword('hashed-password', 'admin-salt');

  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_ADMIN_USERNAME: 'admin',
    DASHBOARD_ADMIN_PASSWORD_HASH: hash,
    DASHBOARD_ADMIN_PASSWORD: 'plaintext-ignored',
  }, () => {
    // Hash authentication should work
    assert.deepEqual(authenticateDashboardUser('admin', 'hashed-password'), {
      username: 'admin',
      role: 'admin',
    });

    // Plaintext should be ignored in production even if present
    assert.equal(authenticateDashboardUser('admin', 'plaintext-ignored'), null);
  });
});

test('development mode allows plaintext password for convenience', () => {
  withAuthEnv({
    NODE_ENV: 'development',
    DASHBOARD_ADMIN_USERNAME: 'local-admin',
    DASHBOARD_ADMIN_PASSWORD: 'dev-password',
  }, () => {
    assert.deepEqual(authenticateDashboardUser('local-admin', 'dev-password'), {
      username: 'local-admin',
      role: 'admin',
    });
  });
});

test('getSecret throws in production when no secret is configured', async () => {
  // Import the auth module to trigger getSecret() when creating a token
  const { createDashboardSessionToken } = await import('../lib/dashboard-auth.mjs');

  withAuthEnv({ NODE_ENV: 'production' }, () => {
    assert.throws(
      () => createDashboardSessionToken('test-user'),
      /DASHBOARD_AUTH_SECRET or NEXTAUTH_SECRET is required in production/
    );
  });
});

test('getSecret accepts DASHBOARD_AUTH_SECRET in production', async () => {
  const { createDashboardSessionToken, verifyDashboardSessionToken } = await import('../lib/dashboard-auth.mjs');

  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_AUTH_SECRET: 'production-secret-key-minimum-32-chars',
  }, () => {
    const token = createDashboardSessionToken('test-user');
    const session = verifyDashboardSessionToken(token);
    assert.equal(session.user, 'test-user');
  });
});

test('getSecret accepts NEXTAUTH_SECRET as fallback in production', async () => {
  const { createDashboardSessionToken, verifyDashboardSessionToken } = await import('../lib/dashboard-auth.mjs');

  withAuthEnv({
    NODE_ENV: 'production',
    NEXTAUTH_SECRET: 'nextauth-fallback-secret-32-chars-min',
  }, () => {
    const token = createDashboardSessionToken('test-user');
    const session = verifyDashboardSessionToken(token);
    assert.equal(session.user, 'test-user');
  });
});

test('production requires at least one hashed credential method', () => {
  // No credentials at all
  withAuthEnv({
    NODE_ENV: 'production',
  }, () => {
    assert.equal(authenticateDashboardUser('admin', 'password'), null);
  });

  // DASHBOARD_ADMIN_USERS works
  const hash = hashDashboardPassword('password', 'admin-salt');
  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_ADMIN_USERS: JSON.stringify([
      { username: 'admin', passwordHash: hash, role: 'admin' },
    ]),
  }, () => {
    assert.deepEqual(authenticateDashboardUser('admin', 'password'), {
      username: 'admin',
      role: 'admin',
    });
  });

  // DASHBOARD_ADMIN_PASSWORD_HASH works
  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_ADMIN_USERNAME: 'admin',
    DASHBOARD_ADMIN_PASSWORD_HASH: hash,
  }, () => {
    assert.deepEqual(authenticateDashboardUser('admin', 'password'), {
      username: 'admin',
      role: 'admin',
    });
  });
});

test('session cookies have secure flag in production', async () => {
  const { applyDashboardSessionCookie } = await import('../lib/dashboard-auth.mjs');

  function mockResponse() {
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

  withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_AUTH_SECRET: 'test-secret-key-32-chars-minimum',
  }, () => {
    const response = mockResponse();
    applyDashboardSessionCookie(response, { username: 'admin', role: 'admin' });

    assert.equal(response.writes[0].options.secure, true);
    assert.equal(response.writes[0].options.httpOnly, true);
    assert.equal(response.writes[0].options.sameSite, 'lax');
  });
});

test('session cookies do not have secure flag in development', async () => {
  const { applyDashboardSessionCookie } = await import('../lib/dashboard-auth.mjs');

  function mockResponse() {
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

  withAuthEnv({
    NODE_ENV: 'development',
    DASHBOARD_AUTH_SECRET: 'dev-secret',
  }, () => {
    const response = mockResponse();
    applyDashboardSessionCookie(response, { username: 'admin', role: 'admin' });

    assert.equal(response.writes[0].options.secure, false);
    assert.equal(response.writes[0].options.httpOnly, true);
    assert.equal(response.writes[0].options.sameSite, 'lax');
  });
});
