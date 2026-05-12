#!/usr/bin/env node

/**
 * Test: MetricCard Color Contrast (WCAG AA Large Text)
 * 
 * Verifies all metric card number colors meet WCAG AA contrast requirements
 * for large text (3:1 ratio minimum).
 * 
 * Component: components/MetricCard.tsx
 * Font size: text-3xl md:text-4xl (30px → 36px)
 * Font weight: font-bold (700)
 * Background: white (#ffffff)
 */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// Color definitions from app/globals.css @theme block
const COLORS = {
  'diner-red': '#d62828',
  'diner-teal': '#2a9d8f',
  'orange-600': '#ea580c',
  'purple-600': '#9333ea',
  'blue-500': '#3b82f6',
};

const WHITE_BG = '#ffffff';
const WCAG_AA_LARGE_TEXT_MIN = 3.0;

/**
 * Calculate relative luminance (WCAG 2.0)
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  const [r, g, b] = rgb.map(val => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex color: ${hex}`);
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Calculate contrast ratio (WCAG 2.0)
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

console.log('\n🎨 Test: MetricCard Color Contrast (WCAG AA)');
console.log('═══════════════════════════════════════════════\n');

// Test 1: Verify all 5 colors exist in MetricCard component
console.log('1️⃣  Verifying colorClasses object in MetricCard.tsx...');
const metricCardPath = join(PROJECT_ROOT, 'components', 'MetricCard.tsx');
const metricCardContent = await readFile(metricCardPath, 'utf-8');

assert.ok(
  metricCardContent.includes('const colorClasses = {'),
  'MetricCard should have colorClasses object'
);

const colorClassEntries = [
  "red: 'text-diner-red",
  "teal: 'text-diner-teal",
  "orange: 'text-orange-600",
  "purple: 'text-purple-600",
  "blue: 'text-blue-500",
];

for (const entry of colorClassEntries) {
  assert.ok(
    metricCardContent.includes(entry),
    `colorClasses should include: ${entry}`
  );
}

console.log('  ✓ All 5 color classes found in component');

// Test 2: Verify font size qualifies as "large text"
console.log('\n2️⃣  Verifying font size qualifies as large text...');
assert.ok(
  metricCardContent.includes('text-3xl md:text-4xl font-bold'),
  'Numbers should use large text sizing (30px → 36px bold)'
);
console.log('  ✓ Font: text-3xl md:text-4xl font-bold');
console.log('    • Mobile: 30px (22.5pt) - exceeds 18pt threshold');
console.log('    • Desktop: 36px (27pt) - exceeds 18pt threshold');
console.log('    • Weight: 700 (bold)');

// Test 3: Check contrast ratios
console.log('\n3️⃣  Checking WCAG AA contrast ratios...');
console.log(`   Requirement: ${WCAG_AA_LARGE_TEXT_MIN}:1 for large text\n`);

const results = [];
for (const [name, hex] of Object.entries(COLORS)) {
  const ratio = getContrastRatio(hex, WHITE_BG);
  const passes = ratio >= WCAG_AA_LARGE_TEXT_MIN;
  
  results.push({ name, hex, ratio, passes });
  
  assert.ok(
    passes,
    `${name} (${hex}) must pass WCAG AA: ${ratio.toFixed(2)}:1 >= ${WCAG_AA_LARGE_TEXT_MIN}:1`
  );
  
  const margin = ((ratio / WCAG_AA_LARGE_TEXT_MIN - 1) * 100).toFixed(0);
  console.log(`  ✓ ${name.padEnd(13)} ${hex}  ${ratio.toFixed(2)}:1  (+${margin}% margin)`);
}

// Test 4: Verify no colors are dangerously close to threshold
console.log('\n4️⃣  Checking safety margins...');
const SAFE_MARGIN = 1.10; // 10% above minimum
const closeColors = results.filter(r => r.ratio < WCAG_AA_LARGE_TEXT_MIN * SAFE_MARGIN);

if (closeColors.length > 0) {
  console.log('  ⚠️  Colors within 10% of threshold (monitor closely):');
  closeColors.forEach(c => {
    console.log(`     - ${c.name}: ${c.ratio.toFixed(2)}:1`);
  });
} else {
  console.log('  ✓ All colors have >10% safety margin above threshold');
}

// Test 5: Document expected contrast ratios for regression detection
console.log('\n5️⃣  Documenting expected ratios for regression tests...');
const expectedRatios = {
  'diner-red': 5.01,
  'diner-teal': 3.32,
  'orange-600': 3.56,
  'purple-600': 5.38,
  'blue-500': 3.68,
};

for (const [name, expectedRatio] of Object.entries(expectedRatios)) {
  const actual = results.find(r => r.name === name).ratio;
  const diff = Math.abs(actual - expectedRatio);
  
  // Allow 0.01 tolerance for floating point precision
  assert.ok(
    diff < 0.01,
    `${name} ratio changed: expected ${expectedRatio}:1, got ${actual.toFixed(2)}:1`
  );
}

console.log('  ✓ All contrast ratios match expected values');

console.log('\n═══════════════════════════════════════════════');
console.log('✅ All tests passed! Metric cards meet WCAG AA.\n');
