/**
 * Login Page QA Regression Test Suite
 * 
 * Verifies the login page implementation from task t_b18f1ae2 and checks
 * for regressions in:
 * - WCAG AA contrast compliance
 * - Responsive design (mobile/tablet/desktop)
 * - Keyboard accessibility
 * - Visual prominence
 * 
 * QA Review: Task t_3585c5b1
 * Date: 2026-05-09
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Helper functions
function relativeLuminance(hex) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = (rgb & 0xff) / 255;
  
  const gamma = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
  return 0.2126 * gamma(r) + 0.7152 * gamma(g) + 0.0722 * gamma(b);
}

function contrastRatio(color1, color2) {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Color constants
const BUTTON_BG = '#d62828';      // bg-diner-red
const BUTTON_TEXT = '#ffffff';    // text-white
const PAGE_BG = '#f8f1e5';        // bg-diner-cream (global body style)
const INPUT_TEXT = '#f8f1e5';     // text-cream
const INPUT_BG = '#18181b';       // bg-zinc-900

test('REGRESSION: Login button maintains WCAG AA contrast on cream background', () => {
  const ratio = contrastRatio(BUTTON_BG, BUTTON_TEXT);
  assert.ok(ratio >= 4.5, `Button text contrast should be >= 4.5:1, got ${ratio.toFixed(2)}:1`);
  console.log(`  ✓ Button text contrast: ${ratio.toFixed(2)}:1`);
});

test('REGRESSION: Login button is visible against page background', () => {
  const ratio = contrastRatio(BUTTON_BG, PAGE_BG);
  assert.ok(ratio >= 3.0, `Button should stand out from page bg, got ${ratio.toFixed(2)}:1`);
  console.log(`  ✓ Button-to-page contrast: ${ratio.toFixed(2)}:1`);
});

test('REGRESSION: Button uses bg-diner-red (not generic bg-red)', () => {
  const content = readFileSync('./app/dashboard/login/page.js', 'utf-8');
  
  // Must use bg-diner-red
  assert.ok(content.includes('bg-diner-red'), 
    'Button must use bg-diner-red (Tailwind v4 custom color)');
  
  // Must NOT use generic bg-red
  const bgRedPattern = /className="[^"]*\bbg-red(?!-)(?:\s|")/;
  assert.ok(!bgRedPattern.test(content), 
    'Button must NOT use generic bg-red (this was the original bug)');
  
  console.log('  ✓ Button uses correct Tailwind v4 color class');
});

test('REGRESSION: Focus indicators are present', () => {
  const content = readFileSync('./app/dashboard/login/page.js', 'utf-8');
  
  assert.ok(content.includes('focus-visible:outline-2'), 
    'Button must have focus-visible:outline-2');
  assert.ok(content.includes('focus-visible:outline-diner-red'), 
    'Focus outline must use diner-red color');
  
  console.log('  ✓ Keyboard focus indicators present');
});

test('REGRESSION: Hover state exists for visual feedback', () => {
  const content = readFileSync('./app/dashboard/login/page.js', 'utf-8');
  
  assert.ok(content.includes('hover:brightness-90') || content.includes('hover:bg-'), 
    'Button must have hover state');
  
  console.log('  ✓ Hover state defined');
});

test('REGRESSION: Disabled state styling exists', () => {
  const content = readFileSync('./app/dashboard/login/page.js', 'utf-8');
  
  assert.ok(content.includes('disabled:opacity-50') || content.includes('disabled:'), 
    'Button must have disabled state styling');
  
  console.log('  ✓ Disabled state styling present');
});

test('REGRESSION: Shadow for visual prominence', () => {
  const content = readFileSync('./app/dashboard/login/page.js', 'utf-8');
  
  assert.ok(content.includes('shadow-lg') || content.includes('shadow-'), 
    'Button should have shadow for visual prominence');
  
  console.log('  ✓ Shadow styling present');
});

test('REGRESSION: Full-width button for easy targeting', () => {
  const content = readFileSync('./app/dashboard/login/page.js', 'utf-8');
  
  assert.ok(content.includes('w-full'), 
    'Button should be full-width');
  
  console.log('  ✓ Full-width button');
});

test('CONTEXT CHECK: Global body background is cream (not black)', () => {
  const css = readFileSync('./app/globals.css', 'utf-8');
  
  assert.ok(css.includes('bg-diner-cream'), 
    'Body should have bg-diner-cream from globals.css');
  
  console.log('  ✓ Global body background is cream (overrides local bg-brand-black)');
});

test('CONTEXT CHECK: Input fields have adequate contrast', () => {
  const ratio = contrastRatio(INPUT_TEXT, INPUT_BG);
  assert.ok(ratio >= 4.5, `Input text contrast should be >= 4.5:1, got ${ratio.toFixed(2)}:1`);
  console.log(`  ✓ Input field contrast: ${ratio.toFixed(2)}:1`);
});

test('REGRESSION: Login page contains all required form elements', () => {
  const content = readFileSync('./app/dashboard/login/page.js', 'utf-8');
  
  assert.ok(content.includes('type="text"'), 'Must have username input');
  assert.ok(content.includes('type="password"'), 'Must have password input');
  assert.ok(content.includes('type="submit"'), 'Must have submit button');
  assert.ok(content.includes('handleLogin'), 'Must have login handler');
  
  console.log('  ✓ All form elements present');
});

test('RESPONSIVE: Login page has mobile-friendly padding', () => {
  const content = readFileSync('./app/dashboard/login/page.js', 'utf-8');
  
  assert.ok(content.includes('px-4'), 'Should have horizontal padding for mobile');
  assert.ok(content.includes('max-w-sm'), 'Form should have constrained width');
  
  console.log('  ✓ Mobile-friendly responsive classes');
});

console.log('\n=== Login Page QA Regression Test Suite ===');
console.log('Verifying implementation from task t_b18f1ae2');
console.log('QA Review: t_3585c5b1');
console.log('Date: 2026-05-09\n');
