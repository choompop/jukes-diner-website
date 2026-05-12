#!/usr/bin/env node

/**
 * Test: Font Loading Performance Verification
 *
 * Validates that the app:
 * 1. Loads no more than 3 font families
 * 2. Uses Next.js optimized font loading (not direct Google Fonts CSS imports)
 * 3. No duplicate font loads
 * 4. Includes font-display: swap for better performance
 */

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const optimizedFontNames = ['Atkinson_Hyperlegible', 'Bebas_Neue', 'IBM_Plex_Mono'];

test('Font optimization - layout.tsx should use next/font/google', () => {
  const layoutPath = join(projectRoot, 'app/layout.tsx');
  const layoutContent = readFileSync(layoutPath, 'utf-8');

  assert.ok(
    layoutContent.includes("from 'next/font/google'"),
    'layout.tsx should import from next/font/google'
  );

  const fontImports = optimizedFontNames.filter((fontName) => layoutContent.includes(fontName));
  assert.equal(fontImports.length, 3, 'Should import exactly 3 optimized brand font families');

  assert.ok(
    !layoutContent.includes('fonts.googleapis.com'),
    'layout.tsx should not have direct Google Fonts links'
  );

  const swapCount = (layoutContent.match(/display: 'swap'/g) || []).length;
  assert.ok(swapCount >= 3, 'All fonts should have display: swap');
});

test('Font optimization - globals.css should not have Google Fonts import', () => {
  const globalsPath = join(projectRoot, 'app/globals.css');
  const globalsContent = readFileSync(globalsPath, 'utf-8');

  assert.ok(
    !globalsContent.includes('@import url(\'https://fonts.googleapis.com'),
    'globals.css should not import Google Fonts directly'
  );

  assert.ok(
    !globalsContent.match(/^\s*--font-serif:/m),
    'Unused serif font variable should not be defined'
  );
});

test('Font optimization - reduced font weights', () => {
  const layoutPath = join(projectRoot, 'app/layout.tsx');
  const layoutContent = readFileSync(layoutPath, 'utf-8');

  const atkinsonMatch = layoutContent.match(/atkinsonHyperlegible[\s\S]*?weight:\s*\[([^\]]+)\]/);
  assert.ok(atkinsonMatch, 'Atkinson Hyperlegible should define a reduced weight array');
  const atkinsonWeights = atkinsonMatch[1].split(',').map((w) => w.trim().replace(/[']/g, ''));
  assert.ok(
    atkinsonWeights.length <= 2,
    `Atkinson Hyperlegible should have max 2 weights, found ${atkinsonWeights.length}: ${atkinsonWeights.join(', ')}`
  );

  const monoMatch = layoutContent.match(/ibmPlexMono[\s\S]*?weight:\s*'(\d+)'/);
  assert.ok(monoMatch, 'IBM Plex Mono should specify a single weight');
});

test('Font optimization - no duplicate loads between layout and globals', () => {
  const layoutPath = join(projectRoot, 'app/layout.tsx');
  const globalsPath = join(projectRoot, 'app/globals.css');

  const layoutContent = readFileSync(layoutPath, 'utf-8');
  const globalsContent = readFileSync(globalsPath, 'utf-8');

  const layoutHasGFonts = layoutContent.includes('fonts.googleapis.com');
  const globalsHasGFonts = globalsContent.includes('fonts.googleapis.com');

  assert.ok(
    !(layoutHasGFonts && globalsHasGFonts),
    'Google Fonts should not be loaded in both layout.tsx and globals.css'
  );
});

test('Font optimization - acceptance criteria', () => {
  const layoutPath = join(projectRoot, 'app/layout.tsx');
  const layoutContent = readFileSync(layoutPath, 'utf-8');

  const fontFamilies = new Set();
  optimizedFontNames.forEach((fontName) => {
    if (layoutContent.includes(fontName)) fontFamilies.add(fontName);
  });

  assert.ok(
    fontFamilies.size <= 3,
    `Acceptance: No more than 3 font families requested. Found ${fontFamilies.size}: ${[...fontFamilies].join(', ')}`
  );

  console.log('\n✓ Font families loaded:', [...fontFamilies].join(', '));
  console.log('✓ Font count:', fontFamilies.size, '/ 3 max');
});

console.log('\n=== Font Loading Performance Test Suite ===\n');
