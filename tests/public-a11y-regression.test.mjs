import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const publicFiles = [
  'app/page.tsx',
  'app/menu/page.js',
  'app/book/page.js',
  'app/find-us/page.js',
  'app/about/page.js',
  'app/apply/page.js',
  'app/order/page.js',
  'app/merch/page.js',
  'app/components/Navbar.tsx',
  'app/components/Footer.tsx',
];

test('public text on brand panels uses WCAG AA foreground pairings', async () => {
  for (const file of publicFiles) {
    const source = await readFile(file, 'utf-8');
    assert.doesNotMatch(
      source,
      /bg-diner-red[^"`]*text-diner-black(?![^"`]*(?:text-xl|text-2xl|text-7xl|text-8xl|text-9xl))/,
      `${file} should not put normal-sized diner-black text directly on diner-red backgrounds`
    );
    assert.doesNotMatch(
      source,
      /bg-diner-teal[^"`]*text-white/,
      `${file} should not put low-contrast white text directly on diner-teal backgrounds`
    );
  }
});

test('public body copy does not use text opacity that axe flags for contrast', async () => {
  for (const file of publicFiles) {
    const source = await readFile(file, 'utf-8');
    assert.doesNotMatch(
      source,
      /text-(?:white|diner-black)\/(?:50|60|70|75|80|90|95)/,
      `${file} should use solid accessible text colors instead of low-opacity body copy`
    );
  }
});

test('navbar brand microcopy is accessible against the cream nav bar', async () => {
  const source = await readFile('app/components/Navbar.tsx', 'utf-8');
  assert.match(
    source,
    /<nav aria-label="Main navigation" className="[^"]*bg-diner-cream[^"]*text-diner-black[^"]*"/,
    'the public navbar should use a cream background with diner-black default text for AA contrast'
  );
  assert.match(
    source,
    /<span className="[^"]*text-diner-black[^"]*">Diner<\/span>/,
    'the small Diner wordmark should use diner-black for AA contrast against the cream navbar'
  );
});
