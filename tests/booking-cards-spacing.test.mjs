/**
 * Tests for booking card spacing and alignment fixes (t_64fddce5)
 * 
 * Verifies:
 * - Adequate padding (20px minimum)
 * - Price breathing room (8px+ gap from customer name)
 * - Consistent internal spacing (12px gaps)
 * - Visual hierarchy clarity
 */

import { test } from 'node:test';
import { strict as assert } from 'assert';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

/**
 * Helper to extract spacing patterns from content
 */
function getSpacingPattern(content, sectionMarker) {
  const startIdx = content.indexOf(sectionMarker);
  if (startIdx === -1) return null;
  
  // Extract ~1000 chars after the marker to capture full booking card structure
  const section = content.slice(startIdx, startIdx + 1000);
  return section;
}

test('Booking cards should have 20px padding', async () => {
  const commandCenterPath = path.join(ROOT, 'app/dashboard/command-center/page.tsx');
  const commandCenterContent = await fs.readFile(commandCenterPath, 'utf-8');
  
  // Look for the booking cards section
  const bookingSection = getSpacingPattern(commandCenterContent, 'BOOKINGS & LEADS');
  assert(bookingSection, 'Could not find BOOKINGS & LEADS section');
  
  // Should use p-5 (20px) instead of p-4 (16px)
  const hasProperPadding = /p-5/.test(bookingSection);
  assert(hasProperPadding, 'Booking cards should use p-5 (20px padding), found p-4 or less');
});

test('Booking cards should have consistent internal spacing (12px gap)', async () => {
  const commandCenterPath = path.join(ROOT, 'app/dashboard/command-center/page.tsx');
  const commandCenterContent = await fs.readFile(commandCenterPath, 'utf-8');
  
  const bookingSection = getSpacingPattern(commandCenterContent, 'BOOKINGS & LEADS');
  
  // Should use gap-3 (12px) or space-y-3 for internal card elements
  const hasGap = /gap-3|space-y-3/.test(bookingSection);
  assert(hasGap, 'Booking cards should use gap-3 (12px) for internal spacing');
});

test('Booking cards should have breathing room between price and customer name (8px minimum)', async () => {
  const commandCenterPath = path.join(ROOT, 'app/dashboard/command-center/page.tsx');
  const commandCenterContent = await fs.readFile(commandCenterPath, 'utf-8');
  
  const valueIdx = commandCenterContent.indexOf('item.value');
  // Look backwards and forwards to capture the full price/customer section context
  const bookingSection = commandCenterContent.slice(valueIdx - 300, valueIdx + 300);
  
  // Price should have margin-top or be in a container with spacing
  // Look for mt-2 (8px) or mt-3 (12px) on the metadata section
  const hasMargin = /mt-[23]/.test(bookingSection);
  assert(hasMargin, 'Price/customer section should have mt-2 or mt-3 for breathing room');
});

test('Booking cards should maintain visual hierarchy with structured layout', async () => {
  const commandCenterPath = path.join(ROOT, 'app/dashboard/command-center/page.tsx');
  const commandCenterContent = await fs.readFile(commandCenterPath, 'utf-8');
  
  const bookingSection = getSpacingPattern(commandCenterContent, 'BOOKINGS & LEADS');
  
  // Should use flex-direction or structured divs for clear separation
  const hasStructure = /flex-grow|flex items-center/.test(bookingSection);
  assert(hasStructure, 'Booking cards should use flex layout for visual hierarchy');
});

test('Price should have prominent styling (1.25rem, bold)', async () => {
  const commandCenterPath = path.join(ROOT, 'app/dashboard/command-center/page.tsx');
  const commandCenterContent = await fs.readFile(commandCenterPath, 'utf-8');
  
  const valueIdx = commandCenterContent.indexOf('item.value');
  // Look backwards and forwards to capture the styling context
  const bookingSection = commandCenterContent.slice(valueIdx - 100, valueIdx + 100);
  
  // Price should be emphasized - check for text-lg or text-xl (1.125rem/1.25rem)
  // and font-medium or font-bold
  const hasEmphasis = /(text-lg|text-xl)/.test(bookingSection) && 
                      /font-(medium|bold|semibold)/.test(bookingSection);
  assert(hasEmphasis, 'Price should have prominent typography (text-lg/xl + font-medium/bold)');
});

test('Design system should have BOOKING_CARD or LIST_WITH_SPACIOUS pattern', async () => {
  const designSystemPath = path.join(ROOT, 'lib/design-system.ts');
  const designSystemContent = await fs.readFile(designSystemPath, 'utf-8');
  
  // Check if design system has been updated with a BOOKING_CARD pattern
  const hasBookingPattern = /BOOKING_CARD|LIST_WITH_SPACIOUS/.test(designSystemContent);
  
  if (hasBookingPattern) {
    // If pattern exists, verify it has adequate spacing
    const pattern = getSpacingPattern(designSystemContent, 'BOOKING_CARD') || 
                    getSpacingPattern(designSystemContent, 'LIST_WITH_SPACIOUS');
    
    const hasGoodPadding = /p-5|p-6/.test(pattern);
    assert(hasGoodPadding, 'BOOKING_CARD pattern should specify p-5 or p-6 padding');
  }
  // If no specific pattern, that's OK - just a recommendation
});

test('Booking cards should not use cramped LIST_WITH_DIVIDERS without overrides', async () => {
  const commandCenterPath = path.join(ROOT, 'app/dashboard/command-center/page.tsx');
  const commandCenterContent = await fs.readFile(commandCenterPath, 'utf-8');
  
  const bookingSection = getSpacingPattern(commandCenterContent, 'BOOKINGS & LEADS');
  
  // We want to move away from the tight LIST_WITH_DIVIDERS pattern
  // Check if it's still using CARD_PATTERNS.LIST_WITH_DIVIDERS
  const usesOldPattern = /CARD_PATTERNS\.LIST_WITH_DIVIDERS/.test(bookingSection);
  
  // It's OK to still use it IF we've overridden with custom classes
  if (usesOldPattern) {
    // Verify we have custom spacing overrides
    const hasOverrides = /className=.*p-5/.test(bookingSection);
    assert(hasOverrides, 
      'If using LIST_WITH_DIVIDERS, must override with p-5 padding via className');
  }
});
