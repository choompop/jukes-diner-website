import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const customerFiles = [
  'app/page.tsx',
  'app/components/Navbar.tsx',
  'app/components/Footer.tsx',
  'app/book/page.js',
  'app/find-us/page.js',
  'app/order/page.js',
  'app/merch/page.js',
  'app/apply/page.js',
];

function readSource(relativePath) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

test('customer-facing source removes dashboard and operator-system copy from public flows', () => {
  const forbidden = [
    'Operator Dashboard',
    'Dashboard HQ',
    'Operator HQ login',
    'Flo',
    'Stripe visibility',
    'Finance dashboard',
    'Content batching',
    'Ops brain',
    'File dropbox',
    'autonomous external posting',
    'payments without approval',
    'internal dashboard',
    'operator workflow',
    'operating system',
  ];

  for (const file of customerFiles) {
    const source = readSource(file);
    for (const term of forbidden) {
      assert.ok(!source.includes(term), `${file} should not expose ${term}`);
    }
  }
});

test('public navigation and footer do not link customer flows to dashboard', () => {
  const navbar = readSource('app/components/Navbar.tsx');
  const footer = readSource('app/components/Footer.tsx');
  const book = readSource('app/book/page.js');

  for (const [name, source] of [['navbar', navbar], ['footer', footer], ['booking page', book]]) {
    assert.ok(!/href=["']\/dashboard["']/.test(source), `${name} should not link to /dashboard`);
  }

  assert.match(navbar, /href="\/book"[\s\S]*Book/, 'navbar should preserve the public Book CTA');
});

test('homepage uses approved Jukes trailer and real food photography', () => {
  const homepage = readSource('app/page.tsx');

  assert.match(homepage, /Smash burgers, Nashville hot chicken, waffle wheels, loaded fries/);
  assert.match(homepage, /Built for lunch rushes, private parties, festivals, and late-night cravings\./);
  assert.match(homepage, /Why people book us/);
  assert.match(homepage, /Diner food that shows up ready\./);
  assert.match(homepage, /Fast service/);
  assert.match(homepage, /Event-ready setup/);
  assert.ok(!homepage.includes('/images/truck.png'), 'homepage should not show the Waffle Wheels truck asset');
  assert.match(homepage, /src="\/images\/truck\.jpg"/);
  assert.match(homepage, /Juke's Diner food trailer wrapped in retro diner artwork/);
  assert.match(homepage, /\/images\/drive\/griddle-prep\.jpg/);
  assert.match(homepage, /\/images\/drive\/chicken-waffles\.jpg/);
});

test('find-us hides legacy Waffle Wheels calendar and shows launch-safe schedule fallback', () => {
  const findUs = readSource('app/find-us/page.js');

  assert.ok(!findUs.includes('wafflewheelsdiner%40gmail.com'), 'find-us should not expose legacy calendar account');
  assert.match(findUs, /Schedule coming together/);
  assert.match(findUs, /Ask about a date/);
  assert.match(findUs, /Private events/);
  assert.match(findUs, /Weekly pop-ups/);
  assert.match(findUs, /Nashville area/);
});

test('Waffle Wheels public business-name references are removed from customer source', () => {
  for (const file of customerFiles) {
    const source = readSource(file);
    assert.ok(!source.includes('Waffle Wheels'), `${file} should not mention Waffle Wheels as a business name`);
  }
});
