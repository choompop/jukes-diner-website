import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();

async function readRoute(relativePath) {
  return readFile(path.join(projectRoot, relativePath), 'utf8');
}

function exportedMethodBody(source, methodName) {
  const marker = `export async function ${methodName}`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${methodName} export should exist`);

  const openBrace = source.indexOf('{', start);
  assert.notEqual(openBrace, -1, `${methodName} export should have a body`);

  let depth = 0;
  for (let index = openBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(openBrace + 1, index);
  }

  assert.fail(`${methodName} export body should close`);
}

function assertMethodRequiresDashboardAuth(source, methodName) {
  assert.match(
    source,
    /requireDashboardApiAuth/,
    `${methodName} route module should import dashboard API auth`
  );

  const body = exportedMethodBody(source, methodName);
  const authIndex = body.indexOf('requireDashboardApiAuth(request');
  assert.notEqual(authIndex, -1, `${methodName} should call requireDashboardApiAuth(request)`);

  const unauthorizedReturnIndex = body.indexOf('NextResponse.json({ error: auth.error }, { status: auth.status })');
  assert.notEqual(unauthorizedReturnIndex, -1, `${methodName} should return the auth failure response`);
  assert.ok(
    unauthorizedReturnIndex > authIndex,
    `${methodName} should check auth before continuing`
  );

  const jsonIndex = body.indexOf('request.json(');
  if (jsonIndex !== -1) {
    assert.ok(authIndex < jsonIndex, `${methodName} should authenticate before reading request JSON`);
  }

  const urlIndex = body.indexOf('new URL(request.url)');
  if (urlIndex !== -1) {
    assert.ok(authIndex < urlIndex, `${methodName} should authenticate before reading query params`);
  }

  const supabaseIndex = body.indexOf('getSupabase(');
  if (supabaseIndex !== -1) {
    assert.ok(authIndex < supabaseIndex, `${methodName} should authenticate before accessing Supabase`);
  }
}

test('internal dashboard data APIs require dashboard auth before reading data', async () => {
  const protectedRoutes = [
    ['app/api/agent-outputs/route.js', 'GET'],
    ['app/api/agents/route.ts', 'GET'],
    ['app/api/dumps/route.js', 'GET'],
    ['app/api/search/route.js', 'GET'],
    ['app/api/chat/route.js', 'POST'],
  ];

  for (const [relativePath, methodName] of protectedRoutes) {
    const source = await readRoute(relativePath);
    assertMethodRequiresDashboardAuth(source, methodName);
  }
});

test('media hub has a single authenticated live route for reads and mutations', async () => {
  const source = await readRoute('app/api/media-hub/route.js');
  assertMethodRequiresDashboardAuth(source, 'GET');
  assertMethodRequiresDashboardAuth(source, 'POST');

  await assert.rejects(
    () => access(path.join(projectRoot, 'app/api/media-hub/route.ts')),
    { code: 'ENOENT' },
    'duplicate app/api/media-hub/route.ts should be removed so it cannot shadow the authenticated route.js'
  );
});

test('booking API preserves public POST while keeping dashboard GET authenticated', async () => {
  const source = await readRoute('app/api/book/route.js');

  assertMethodRequiresDashboardAuth(source, 'GET');

  const postBody = exportedMethodBody(source, 'POST');
  assert.equal(
    postBody.includes('requireDashboardApiAuth'),
    false,
    'POST /api/book remains the approved public booking inquiry endpoint'
  );
});
