/**
 * Quick Links Touch Target Test
 * Verifies WCAG 2.5.5 AAA compliance (48px minimum)
 */

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';

const COMMAND_CENTER_PAGE = 'app/dashboard/command-center/page.tsx';

test('Quick Links buttons use py-4 for 48px height (WCAG AAA)', async () => {
  const content = await readFile(COMMAND_CENTER_PAGE, 'utf-8');
  
  // Find Quick Links section
  const quickLinksMatch = content.match(/QUICK LINKS[\s\S]*?<\/div>\s*<\/div>/);
  assert.ok(quickLinksMatch, 'Quick Links section should exist');
  
  const quickLinksSection = quickLinksMatch[0];
  
  // Check that all Quick Links use px-3 py-4 pattern
  const linkMatches = quickLinksSection.matchAll(/className="([^"]*?)"/g);
  const linkClasses = Array.from(linkMatches)
    .map(m => m[1])
    .filter(cls => cls.includes('bg-white') && cls.includes('rounded-xl'));
  
  assert.ok(linkClasses.length >= 4, 'Should have at least 4 Quick Link buttons');
  
  for (const cls of linkClasses) {
    assert.ok(
      cls.includes('py-4'),
      `Quick Link should use py-4 for 48px height, found: ${cls}`
    );
    assert.ok(
      !cls.match(/\bp-3\b/),
      `Quick Link should not use p-3 (40px), found: ${cls}`
    );
  }
});

test('Quick Links maintain horizontal padding px-3', async () => {
  const content = await readFile(COMMAND_CENTER_PAGE, 'utf-8');
  
  const quickLinksMatch = content.match(/QUICK LINKS[\s\S]*?<\/div>\s*<\/div>/);
  const quickLinksSection = quickLinksMatch[0];
  
  const linkMatches = quickLinksSection.matchAll(/className="([^"]*?)"/g);
  const linkClasses = Array.from(linkMatches)
    .map(m => m[1])
    .filter(cls => cls.includes('bg-white') && cls.includes('rounded-xl'));
  
  for (const cls of linkClasses) {
    assert.ok(
      cls.includes('px-3'),
      `Quick Link should maintain px-3 horizontal padding, found: ${cls}`
    );
  }
});

test('Quick Links section contains all required navigation items', async () => {
  const content = await readFile(COMMAND_CENTER_PAGE, 'utf-8');
  
  const requiredLinks = [
    { text: 'Franchise Brain', href: '/dashboard/franchise-brain' },
    { text: 'Marketing Hub', href: '/dashboard/marketing' },
    { text: 'Hermes Kanban', href: '/dashboard/hermes-kanban' },
    { text: 'Agent Roster', href: '/dashboard/agents' }
  ];
  
  for (const link of requiredLinks) {
    assert.ok(
      content.includes(link.href),
      `Should include link to ${link.href}`
    );
    assert.ok(
      content.includes(link.text),
      `Should include text "${link.text}"`
    );
  }
});
