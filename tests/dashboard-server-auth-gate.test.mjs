import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { createDashboardSessionToken } from '../lib/dashboard-auth.mjs';
import {
  buildDashboardLoginRedirect,
  shouldProtectDashboardPath,
  verifyDashboardSessionTokenForMiddleware,
} from '../lib/dashboard-middleware-auth.mjs';

async function withAuthEnv(env, fn) {
  const keys = ['NODE_ENV', 'DASHBOARD_AUTH_SECRET', 'NEXTAUTH_SECRET'];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  Object.assign(process.env, env);
  try {
    return await fn();
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
}

test('dashboard middleware protects every dashboard route except login', () => {
  assert.equal(shouldProtectDashboardPath('/dashboard'), true);
  assert.equal(shouldProtectDashboardPath('/dashboard/command-center'), true);
  assert.equal(shouldProtectDashboardPath('/dashboard/bookings'), true);
  assert.equal(shouldProtectDashboardPath('/dashboard/login'), false);
  assert.equal(shouldProtectDashboardPath('/dashboard/login/'), false);
  assert.equal(shouldProtectDashboardPath('/menu'), false);
});

test('dashboard middleware validates the signed httpOnly dashboard session token', async () => {
  await withAuthEnv({
    NODE_ENV: 'production',
    DASHBOARD_AUTH_SECRET: 'middleware-test-secret-at-least-32-chars',
  }, async () => {
    const now = Date.parse('2026-05-11T18:45:00Z');
    const token = createDashboardSessionToken({ username: 'john', role: 'admin' }, now);

    assert.equal(
      (await verifyDashboardSessionTokenForMiddleware(token, now + 1000)).user,
      'john'
    );
    assert.equal(await verifyDashboardSessionTokenForMiddleware(`${token}tampered`, now + 1000), null);
    assert.equal(await verifyDashboardSessionTokenForMiddleware(token, now + 1000 * 60 * 60 * 13), null);
  });
});

test('dashboard middleware redirects unauthenticated protected pages to login with return path', () => {
  const redirect = buildDashboardLoginRedirect(new URL('https://dashboard.jukesdiner.com/dashboard/command-center?tab=today'));

  assert.equal(redirect.pathname, '/dashboard/login');
  assert.equal(redirect.searchParams.get('next'), '/dashboard/command-center?tab=today');
});

test('dashboard shell logout calls DELETE /api/auth before leaving the dashboard', () => {
  const layout = readFileSync('./app/dashboard/components/DashboardLayout.tsx', 'utf8');

  assert.match(layout, /fetch\(['"]\/api\/auth['"],[\s\S]*method:\s*['"]DELETE['"]/);
  assert.match(layout, /localStorage\.removeItem\(['"]jukes_user['"]\)/);
  assert.doesNotMatch(layout, /window\.location\.href\s*=\s*['"]\/['"]/);
});
