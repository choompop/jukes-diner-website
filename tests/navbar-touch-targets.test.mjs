/**
 * WCAG Touch Target Size Tests
 * 
 * WCAG 2.5.5 (AAA): Touch targets must be at least 44x44px
 * Best practice: 48x48px for better usability
 * 
 * Testing all top navigation links for proper touch target height
 */

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';

const navbarPath = './app/components/Navbar.tsx';

test('desktop nav links should have py-3 or py-4 padding for WCAG compliance', () => {
  const content = readFileSync(navbarPath, 'utf-8');
  
  // Find the desktop nav link className - it should have py-3 (AA: 44px) or py-4 (AAA: 48px)
  const desktopLinkMatch = content.match(/text-sm font-medium hover:text-diner-chrome[^"]*"/);
  assert.ok(desktopLinkMatch, 'Should find desktop navigation link className');
  
  const className = desktopLinkMatch[0];
  const hasPadding = className.includes('py-3') || className.includes('py-4');
  
  assert.ok(hasPadding, `Desktop nav links must have py-3 or py-4 for WCAG touch targets. Found: ${className}`);
});

test('public book CTA should have adequate vertical padding', () => {
  const content = readFileSync(navbarPath, 'utf-8');

  const bookLinkMatch = content.match(/href="\/book"[^>]*className="[^"]*"/);
  assert.ok(bookLinkMatch, 'Should find public Book CTA');
  assert.ok(!/href="\/dashboard"/.test(content), 'Public navbar should not link to dashboard');

  const className = bookLinkMatch[0].match(/className="([^"]*)"/)[1];
  const hasPadding = className.includes('py-3') || className.includes('py-4');
  const hasSmallPadding = className.includes('py-1') || className.includes('py-2');

  assert.ok(hasPadding && !hasSmallPadding,
    `Book CTA must have py-3 or py-4 for WCAG without smaller padding. Found: ${className}`);
});

test('mobile nav links should have adequate padding', () => {
  const content = readFileSync(navbarPath, 'utf-8');
  
  // Mobile nav links should maintain good touch targets
  const mobilePattern = /block px-3 py-2[^"]*/;
  if (content.match(mobilePattern)) {
    // py-2 is 0.5rem = 8px, which is too small. Should be at least py-3 (12px) to reach 48px total
    assert.fail('Mobile nav links have py-2 which may be too small. Should verify total height is 48px+');
  }
  
  // This test passes if there's no py-2 or if we update mobile links to have better padding
  assert.ok(true, 'Mobile nav padding check completed');
});
