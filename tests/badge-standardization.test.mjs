import { promises as fs } from 'fs';
import { test } from 'node:test';
import assert from 'node:assert';

/**
 * Badge Standardization Tests
 * 
 * Validates that all badge usage across the dashboard follows the standardized StatusBadge component.
 * This ensures visual consistency across all badge types.
 */

test('StatusBadge component exists and exports correct types', async () => {
  const badgeComponent = await fs.readFile('./components/StatusBadge.tsx', 'utf8');
  
  // Verify component export
  assert.match(badgeComponent, /export function StatusBadge/, 'StatusBadge function is exported');
  
  // Verify all variant types are defined
  const variants = [
    'urgent', 'high', 'medium', 'low',
    'booking', 'lead',
    'daily-ops', 'emergency',
    'image', 'video',
    'success', 'warning', 'error', 'info', 'neutral'
  ];
  
  for (const variant of variants) {
    assert.match(badgeComponent, new RegExp(`'${variant}'`), `Variant '${variant}' is defined`);
  }
  
  // Verify size variants
  assert.match(badgeComponent, /'sm'.*'md'.*'lg'/, 'Size variants (sm, md, lg) are defined');
  
  // Verify consistent base styles
  assert.match(badgeComponent, /rounded-full/, 'Uses rounded-full for border-radius');
  assert.match(badgeComponent, /uppercase/, 'Uses uppercase text transform');
  assert.match(badgeComponent, /tracking-widest/, 'Uses consistent letter-spacing');
});

test('Design system exports badge variant constants', async () => {
  const designSystem = await fs.readFile('./lib/design-system.ts', 'utf8');
  
  assert.match(designSystem, /BADGE_VARIANTS/, 'BADGE_VARIANTS constant is exported');
  assert.match(designSystem, /PRIORITY:/, 'Priority variants are documented');
  assert.match(designSystem, /BOOKING:/, 'Booking variants are documented');
  assert.match(designSystem, /SOP:/, 'SOP variants are documented');
  assert.match(designSystem, /MEDIA:/, 'Media type variants are documented');
});

test('Command center page uses StatusBadge component', async () => {
  const commandCenter = await fs.readFile('./app/dashboard/command-center/page.tsx', 'utf8');
  
  // Verify import
  assert.match(commandCenter, /import.*StatusBadge.*from.*StatusBadge/, 'StatusBadge is imported');
  
  // Verify old inline badge patterns are replaced
  assert.doesNotMatch(
    commandCenter,
    /getPriorityColor|getSeverityColor/,
    'Old color helper functions are removed'
  );
  
  // Verify StatusBadge usage for priority
  assert.match(commandCenter, /<StatusBadge variant={task\.priority/, 'Priority badges use StatusBadge');
  
  // Verify StatusBadge usage for booking/lead
  assert.match(commandCenter, /StatusBadge variant={item\.type === 'booking'/, 'Booking/lead badges use StatusBadge');
  
  // Verify StatusBadge usage for severity
  assert.match(commandCenter, /StatusBadge variant={issue\.severity/, 'Severity badges use StatusBadge');
  
  // Verify StatusBadge usage for media types
  assert.match(commandCenter, /StatusBadge variant={item\.type === 'video'/, 'Media type badges use StatusBadge');
  
  // Verify StatusBadge usage for SOP categories
  assert.match(commandCenter, /StatusBadge variant={sop\.category === 'emergency'/, 'SOP badges use StatusBadge');
});

test('Badge variants have consistent styling properties', async () => {
  const badgeComponent = await fs.readFile('./components/StatusBadge.tsx', 'utf8');
  
  // Extract variant styles section
  const variantStylesMatch = badgeComponent.match(/const variantStyles[^}]+}[^}]+}/s);
  assert.ok(variantStylesMatch, 'variantStyles object exists');
  
  const variantStyles = variantStylesMatch[0];
  
  // All variants should have bg-* and text-* classes
  const variantNames = [
    'urgent', 'high', 'medium', 'low',
    'booking', 'lead',
    'daily-ops', 'emergency',
    'image', 'video'
  ];
  
  for (const variant of variantNames) {
    // Handle hyphenated variant names - they appear in quotes in the source
    const variantKey = variant.includes('-') ? `'${variant}'` : variant;
    const variantPattern = new RegExp(`${variantKey.replace('-', '\\-')}:.*'bg-\\w+-\\d+.*text-\\w+-\\d+`);
    assert.match(variantStyles, variantPattern, `Variant '${variant}' has consistent bg/text color pattern`);
  }
});

test('All badge sizes use rounded-full consistently', async () => {
  const badgeComponent = await fs.readFile('./components/StatusBadge.tsx', 'utf8');
  
  // Extract size styles section
  const sizeStylesMatch = badgeComponent.match(/const sizeStyles[^}]+}[^}]+}/s);
  assert.ok(sizeStylesMatch, 'sizeStyles object exists');
  
  const sizeStyles = sizeStylesMatch[0];
  
  // All sizes should have rounded-full
  const sizes = ['sm', 'md', 'lg'];
  for (const size of sizes) {
    assert.match(sizeStyles, new RegExp(`${size}:.*rounded-full`), `Size '${size}' uses rounded-full`);
  }
});

test('Badge component has usage documentation', async () => {
  const badgeComponent = await fs.readFile('./components/StatusBadge.tsx', 'utf8');
  
  // Verify JSDoc comments exist
  assert.match(badgeComponent, /\/\*\*[\s\S]*Usage Examples:/, 'Usage examples are documented');
  
  // Verify examples for each badge type
  assert.match(badgeComponent, /Priority badge:/, 'Priority badge example exists');
  assert.match(badgeComponent, /Booking status:/, 'Booking status example exists');
  assert.match(badgeComponent, /SOP category:/, 'SOP category example exists');
  assert.match(badgeComponent, /Media type:/, 'Media type example exists');
});

console.log('✓ All badge standardization tests defined');
