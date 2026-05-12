/**
 * Login Button WCAG Accessibility Tests
 * 
 * Verifies that the Sign In button on /dashboard/login meets WCAG AA
 * contrast requirements and has proper focus states.
 * 
 * Test Coverage:
 * - Button contrast ratio (WCAG AA: 4.5:1 minimum)
 * - Focus state visibility
 * - Hover state behavior
 * - Disabled state styling
 * - Keyboard accessibility
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Helper function to calculate relative luminance
function relativeLuminance(hex) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = (rgb & 0xff) / 255;
  
  const gamma = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
  return 0.2126 * gamma(r) + 0.7152 * gamma(g) + 0.0722 * gamma(b);
}

// Helper function to calculate contrast ratio
function contrastRatio(color1, color2) {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const BUTTON_BG = '#d62828'; // bg-diner-red
const BUTTON_TEXT = '#ffffff'; // text-white
const PAGE_BG = '#f8f1e5'; // bg-diner-cream (page background)

test('Login button meets WCAG AA normal text contrast (4.5:1)', () => {
  const ratio = contrastRatio(BUTTON_BG, BUTTON_TEXT);
  assert.ok(ratio >= 4.5, `Expected contrast ratio >= 4.5:1, got ${ratio.toFixed(2)}:1`);
  console.log(`  ✓ Button contrast: ${ratio.toFixed(2)}:1 (WCAG AA threshold: 4.5:1)`);
});

test('Login button meets WCAG AA large text contrast (3:1)', () => {
  const ratio = contrastRatio(BUTTON_BG, BUTTON_TEXT);
  assert.ok(ratio >= 3.0, `Expected contrast ratio >= 3:1, got ${ratio.toFixed(2)}:1`);
  console.log(`  ✓ Large text contrast: ${ratio.toFixed(2)}:1 (WCAG AA threshold: 3:1)`);
});

test('Login button is distinguishable from page background', () => {
  const buttonToPageRatio = contrastRatio(BUTTON_BG, PAGE_BG);
  assert.ok(buttonToPageRatio >= 3.0, 
    `Button should contrast well with page background. Expected >= 3:1, got ${buttonToPageRatio.toFixed(2)}:1`);
  console.log(`  ✓ Button-to-page contrast: ${buttonToPageRatio.toFixed(2)}:1`);
});

test('Login button does not blend with cream background', () => {
  const ratio = contrastRatio(BUTTON_BG, PAGE_BG);
  assert.ok(ratio > 2.5, 
    `Button should be visible against cream background. Expected > 2.5:1, got ${ratio.toFixed(2)}:1`);
  console.log(`  ✓ Button visibility on cream background: ${ratio.toFixed(2)}:1`);
});

test('Login button uses correct Tailwind v4 color class', () => {
  // Read the login page component
  const loginPagePath = './app/dashboard/login/page.js';
  const content = readFileSync(loginPagePath, 'utf-8');
  
  // Should use bg-diner-red (correct Tailwind v4 custom color)
  assert.ok(content.includes('bg-diner-red'), 
    'Button should use bg-diner-red class');
  
  // Should NOT use bg-red (incorrect - was the bug)
  const bgRedPattern = /className="[^"]*\bbg-red(?!-)(?:\s|")/;
  assert.ok(!bgRedPattern.test(content), 
    'Button should NOT use generic bg-red class (Tailwind v4 requires bg-diner-red for custom colors)');
  
  console.log('  ✓ Button uses bg-diner-red (correct Tailwind v4 custom color)');
});

test('Login button has proper focus-visible outline', () => {
  const loginPagePath = './app/dashboard/login/page.js';
  const content = readFileSync(loginPagePath, 'utf-8');
  
  assert.ok(content.includes('focus-visible:outline-2'), 
    'Button should have focus-visible:outline-2');
  assert.ok(content.includes('focus-visible:outline-offset-2'), 
    'Button should have focus-visible:outline-offset-2');
  assert.ok(content.includes('focus-visible:outline-diner-red'), 
    'Button should have focus-visible:outline-diner-red');
  
  console.log('  ✓ Button has WCAG-compliant keyboard focus indicators');
});

test('Login button has hover state for user feedback', () => {
  const loginPagePath = './app/dashboard/login/page.js';
  const content = readFileSync(loginPagePath, 'utf-8');
  
  assert.ok(content.includes('hover:brightness-90') || content.includes('hover:bg-'), 
    'Button should have hover state defined');
  
  console.log('  ✓ Button has hover state for visual feedback');
});

test('Login button has disabled state styling', () => {
  const loginPagePath = './app/dashboard/login/page.js';
  const content = readFileSync(loginPagePath, 'utf-8');
  
  assert.ok(content.includes('disabled:opacity-50') || content.includes('disabled:'), 
    'Button should have disabled state styling');
  
  console.log('  ✓ Button has disabled state styling');
});

test('Login button has shadow for visual prominence', async () => {
  const { readFile } = await import('node:fs/promises');
  const loginPagePath = './app/dashboard/login/page.js';
  const content = await readFile(loginPagePath, 'utf-8');
  
  assert.ok(content.includes('shadow-lg') || content.includes('shadow-'), 
    'Button should have shadow for visual prominence');
  
  console.log('  ✓ Button has shadow for depth and prominence');
});

test('Login button spans full width for easy targeting', () => {
  const loginPagePath = './app/dashboard/login/page.js';
  const content = readFileSync(loginPagePath, 'utf-8');
  
  assert.ok(content.includes('w-full'), 
    'Button should span full width');
  
  console.log('  ✓ Button spans full width for easy targeting');
});

console.log('\n=== Login Button WCAG Compliance Test Suite ===');
console.log('Testing Sign In button at /dashboard/login');
console.log('Expected: bg-diner-red (#d62828) with white text');
console.log('WCAG AA Standard: 4.5:1 minimum for normal text\n');
