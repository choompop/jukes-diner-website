/**
 * Test: Command Center Spacing Consistency
 * 
 * Verifies that all card lists use consistent spacing patterns
 * as defined in lib/design-system.ts
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

describe('Command Center Spacing Consistency', () => {
  let pageContent;

  before(() => {
    // Read the command center page source
    const pagePath = './app/dashboard/command-center/page.tsx';
    pageContent = fs.readFileSync(pagePath, 'utf-8');
  });

  it('should import CARD_PATTERNS from design-system', () => {
    assert.ok(pageContent.includes("import { CARD_PATTERNS } from '../../../lib/design-system'"));
  });

  it('should use CARD_PATTERNS.LIST_WITH_DIVIDERS for main content lists', () => {
    // TODAY'S PRIORITIES section
    const prioritiesMatch = pageContent.match(
      /TODAY'S PRIORITIES[\s\S]*?<div className=\{CARD_PATTERNS\.LIST_WITH_DIVIDERS\.container\}/
    );
    assert.ok(prioritiesMatch, 'TODAY\'S PRIORITIES should use LIST_WITH_DIVIDERS');

    // BOOKINGS & LEADS section
    const bookingsMatch = pageContent.match(
      /BOOKINGS & LEADS[\s\S]*?<div className=\{CARD_PATTERNS\.LIST_WITH_DIVIDERS\.container\}/
    );
    assert.ok(bookingsMatch, 'BOOKINGS & LEADS should use LIST_WITH_DIVIDERS');

    // OPEN OPS ISSUES section
    const opsMatch = pageContent.match(
      /OPEN OPS ISSUES[\s\S]*?<div className=\{CARD_PATTERNS\.LIST_WITH_DIVIDERS\.container\}/
    );
    assert.ok(opsMatch, 'OPEN OPS ISSUES should use LIST_WITH_DIVIDERS');
  });

  it('should use CARD_PATTERNS.COMPACT_LIST for sidebar widgets', () => {
    // MEDIA APPROVALS section
    const mediaMatch = pageContent.match(
      /MEDIA APPROVALS[\s\S]*?<div className=\{CARD_PATTERNS\.COMPACT_LIST\.container\}/
    );
    assert.ok(mediaMatch, 'MEDIA APPROVALS should use COMPACT_LIST');
  });

  it('should not have any hardcoded p-4 hover:bg-gray-50 on card items in main lists', () => {
    // Extract the TODAY'S PRIORITIES section
    const prioritiesSection = pageContent.match(
      /TODAY'S PRIORITIES[\s\S]*?{priorities\.slice[\s\S]*?<\/motion\.div>/
    );
    
    if (prioritiesSection) {
      // Check it doesn't have hardcoded spacing
      assert.ok(!prioritiesSection[0].includes('className="p-4 hover:bg-gray-50'));
      // But should use the pattern
      assert.ok(prioritiesSection[0].includes('CARD_PATTERNS.LIST_WITH_DIVIDERS.item'));
    }
  });

  it('should not use space-y-3 with p-3 pattern for main content cards', () => {
    // Make sure main content sections don't use the old inconsistent pattern
    const mainContentSection = pageContent.match(
      /TODAY'S PRIORITIES[\s\S]*?OPEN OPS ISSUES[\s\S]*?<\/div>/
    );
    
    if (mainContentSection) {
      // Old pattern was: p-4 space-y-3 with p-3 items
      // New pattern uses CARD_PATTERNS
      const badPattern = /p-4 space-y-3.*?p-3 bg-gray-50/;
      assert.ok(!badPattern.test(mainContentSection[0]));
    }
  });
});

describe('Design System Spacing Scale', () => {
  let designSystem;

  before(() => {
    const designSystemPath = './lib/design-system.ts';
    const content = fs.readFileSync(designSystemPath, 'utf-8');
    designSystem = content;
  });

  it('should define standard spacing scale', () => {
    assert.ok(designSystem.includes('TIGHT'));
    assert.ok(designSystem.includes('CLOSE'));
    assert.ok(designSystem.includes('CARD_GAP'));
    assert.ok(designSystem.includes('CARD_PADDING'));
    assert.ok(designSystem.includes('SECTION'));
    assert.ok(designSystem.includes('MAJOR'));
  });

  it('should define card list patterns', () => {
    assert.ok(designSystem.includes('LIST_WITH_DIVIDERS'));
    assert.ok(designSystem.includes('LIST_WITH_SPACING'));
    assert.ok(designSystem.includes('COMPACT_LIST'));
  });

  it('LIST_WITH_DIVIDERS should use consistent 16px (p-4) padding', () => {
    assert.ok(designSystem.includes("item: 'p-4 hover:bg-gray-50 transition-colors'"));
  });

  it('COMPACT_LIST should use 12px (p-3) padding for sidebar widgets', () => {
    assert.ok(designSystem.includes("item: 'p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'"));
  });
});
