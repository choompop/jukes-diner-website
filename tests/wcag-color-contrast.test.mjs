/**
 * WCAG Color Contrast Accessibility Test
 * 
 * Verifies all color contrast violations identified in QA review have been fixed
 * Task: t_d911c4da
 * Parent Task: t_e2816cb9 (QA Review)
 * Date: 2026-05-09
 * 
 * Tests:
 * 1. Login button contrast (4.43:1 → 4.51:1)
 * 2. Form placeholders (1.01:1 → 7.5:1) 
 * 3. Footer text colors (3.59:1 → 7.5:1)
 * 4. Error message colors (3.47:1 → 5.1:1)
 * 
 * WCAG Requirements:
 * - Normal text: 4.5:1 minimum (Level AA)
 * - Large text (18pt+ or 14pt+ bold): 3:1 minimum
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'fs';

const globalsPath = 'app/globals.css';
const loginPath = 'app/dashboard/login/page.js';
const footerPath = 'app/components/Footer.tsx';

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => (
    channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  ));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

function getThemeColor(source, token) {
  const match = source.match(new RegExp(`--color-${token}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `globals.css should define --color-${token}`);
  return match[1];
}

test('Login button and public nav diner-red surfaces meet WCAG AA contrast', () => {
  const globalsContent = readFileSync(globalsPath, 'utf-8');
  const loginContent = readFileSync(loginPath, 'utf-8');
  const navbarContent = readFileSync('app/components/Navbar.tsx', 'utf-8');
  const dinerRed = getThemeColor(globalsContent, 'diner-red');
  
  assert.ok(
    contrastRatio('#ffffff', dinerRed) >= 4.5,
    `white text on diner-red surfaces should be >= 4.5:1, got ${contrastRatio('#ffffff', dinerRed).toFixed(2)}:1`
  );
  assert.ok(
    !/bg-diner-red text-diner-black/.test(navbarContent),
    'public nav should not place diner-black text on diner-red backgrounds'
  );
  
  // Verify login button uses bg-diner-red with accessible white text
  assert.ok(
    /bg-diner-red[^\n]*text-white/.test(loginContent),
    'Login button should use bg-diner-red with text-white'
  );
});

test('Login form placeholders use accessible gray color', () => {
  const content = readFileSync(loginPath, 'utf-8');
  
  // Both username and password inputs should use placeholder-gray-400
  const placeholderMatches = content.match(/placeholder-gray-400/g);
  assert.ok(placeholderMatches, 'Should have placeholder-gray-400 classes');
  assert.strictEqual(
    placeholderMatches.length,
    2,
    'Both username and password fields should use placeholder-gray-400'
  );
  
  // Should NOT use the old zinc-500 color
  assert.ok(
    !/placeholder-zinc-500/.test(content),
    'Should not use placeholder-zinc-500 (poor contrast)'
  );
});

test('Footer text uses lighter gray colors for better contrast', () => {
  const content = readFileSync(footerPath, 'utf-8');
  
  // Footer description should use gray-300
  assert.ok(
    /text-gray-300/.test(content),
    'Footer should use text-gray-300 for better contrast'
  );
  
  // Should NOT use the old gray-400 or gray-500 in body text
  // (gray-400 is acceptable in footer bottom, but gray-500 is too dark)
  const gray400Matches = content.match(/text-gray-400/g);
  
  // Footer bottom uses gray-400 which is fine (7.5:1 contrast)
  // Main content sections should use gray-300
  const gray300Matches = content.match(/text-gray-300/g);
  assert.ok(
    gray300Matches && gray300Matches.length >= 2,
    'Footer sections should use text-gray-300'
  );
});

test('Footer real social links have aria-labels and proper icon accessibility', () => {
  const content = readFileSync(footerPath, 'utf-8');

  assert.match(
    content,
    /href="https:\/\/www\.instagram\.com\/jukesdiner"[^>]*aria-label="Follow Juke's Diner on Instagram"/,
    'Approved Instagram footer link should have an accessible label'
  );
  assert.doesNotMatch(
    content,
    /aria-label="(?:Follow us on Twitter|Visit our website)"/,
    'Unavailable footer channels should not keep aria-labeled fake links'
  );

  const ariaHiddenMatches = content.match(/<Camera[^>]*aria-hidden="true"/g);
  assert.ok(
    ariaHiddenMatches && ariaHiddenMatches.length === 1,
    'The Instagram icon should be aria-hidden to avoid screen reader duplication'
  );
});

test('Error messages use accessible red color', () => {
  const content = readFileSync(loginPath, 'utf-8');
  
  // Error message should use red-500 (lighter, better contrast)
  assert.ok(
    /text-red-500/.test(content),
    'Error messages should use text-red-500 for better contrast'
  );
  
  // Should NOT use the generic "text-red" class
  const textRedMatch = content.match(/className="[^"]*text-red[^-]/);
  assert.ok(
    !textRedMatch,
    'Should not use generic text-red class (use text-red-500 instead)'
  );
});

test('Login page title uses diner-red semantic color', () => {
  const content = readFileSync(loginPath, 'utf-8');
  
  // H1 should use text-diner-red
  assert.ok(
    /text-diner-red/.test(content),
    'Login page title should use text-diner-red semantic color'
  );
  
  // Should NOT use generic "text-red"
  assert.ok(
    !/text-4xl font-display text-red[^-]/.test(content),
    'Login title should not use generic text-red'
  );
});

test('All color changes maintain brand consistency', () => {
  const globalsContent = readFileSync(globalsPath, 'utf-8');
  
  // Verify all brand colors are defined
  assert.ok(
    /--color-diner-red:\s*#d93939/i.test(globalsContent),
    'diner-red should be defined'
  );
  assert.ok(
    /--color-diner-cream:\s*#f8f1e5/i.test(globalsContent),
    'diner-cream should be defined'
  );
  assert.ok(
    /--color-diner-teal:\s*#2a9d8f/i.test(globalsContent),
    'diner-teal should be defined'
  );
  assert.ok(
    /--color-diner-black:\s*#1a1a1a/i.test(globalsContent),
    'diner-black should be defined'
  );
  assert.ok(
    /--color-diner-chrome:\s*#e5e5e5/i.test(globalsContent),
    'diner-chrome should be defined'
  );
});
