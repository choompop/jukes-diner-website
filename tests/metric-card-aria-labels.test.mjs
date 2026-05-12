/**
 * Accessibility Test: MetricCard Link Aria Labels
 * 
 * Ensures all MetricCard components with linkTo prop have descriptive
 * aria-labels for screen reader users.
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'fs';

const metricCardPath = '/Users/lexi/projects/jukes-diner-website/components/MetricCard.tsx';
const commandCenterPath = '/Users/lexi/projects/jukes-diner-website/app/dashboard/command-center/page.tsx';

test('MetricCard component accepts ariaLabel prop', () => {
  const content = readFileSync(metricCardPath, 'utf-8');
  
  // Check that ariaLabel is in the interface
  assert(
    /interface MetricCardProps[\s\S]*?ariaLabel\?:\s*string/.test(content),
    'MetricCard interface should include optional ariaLabel prop'
  );
});

test('MetricCard applies aria-label to Link with fallback', () => {
  const content = readFileSync(metricCardPath, 'utf-8');
  
  // Check that Link receives aria-label with fallback pattern
  assert(
    /aria-label=\{ariaLabel\s*\|\|\s*`View \$\{label\}`\}/.test(content),
    'Link should have aria-label with fallback to `View ${label}`'
  );
});

test('All MetricCard instances with linkTo have descriptive aria-labels', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  // Count linkTo and ariaLabel occurrences in MetricCard blocks
  const linkToCount = (content.match(/linkTo="[^"]+"/g) || []).length;
  const ariaLabelCount = (content.match(/ariaLabel="[^"]+"/g) || []).length;
  
  assert(
    linkToCount > 0,
    'Should find at least one MetricCard with linkTo in command-center'
  );
  
  assert.strictEqual(
    ariaLabelCount,
    linkToCount,
    `All ${linkToCount} MetricCard instances with linkTo should have ariaLabel prop`
  );
});

test('Urgent Tasks MetricCard has descriptive aria-label', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  // Check for ariaLabel near "Urgent Tasks" label
  assert(
    content.includes('label="Urgent Tasks"') &&
    /label="Urgent Tasks"[\s\S]{0,500}ariaLabel="View today's urgent tasks/.test(content),
    'Urgent Tasks card should have descriptive aria-label about viewing urgent tasks'
  );
});

test('Today Bookings MetricCard has descriptive aria-label', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  assert(
    content.includes('label="Today Bookings"') &&
    /label="Today Bookings"[\s\S]{0,500}ariaLabel="Go to today's bookings/.test(content),
    'Today Bookings card should have descriptive aria-label about going to bookings'
  );
});

test('Open Issues MetricCard has descriptive aria-label', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  assert(
    content.includes('label="Open Issues"') &&
    /label="Open Issues"[\s\S]{0,500}ariaLabel="View open operations issues"/.test(content),
    'Open Issues card should have descriptive aria-label about viewing operations issues'
  );
});

test('Media Approvals MetricCard has descriptive aria-label', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  assert(
    content.includes('label="Media Approvals"') &&
    /label="Media Approvals"[\s\S]{0,500}ariaLabel="View pending media approvals"/.test(content),
    'Media Approvals card should have descriptive aria-label about viewing media approvals'
  );
});

test('Weather MetricCard without link has no aria-label requirement', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  // Find the weather card section
  const weatherSection = content.match(
    /label="Nashville, TN"[\s\S]{0,300}/
  )?.[0];
  
  assert.ok(weatherSection, 'Should find weather MetricCard');
  assert(
    !weatherSection.includes('linkTo='),
    'Weather card should not have linkTo (it is informational only)'
  );
  // ariaLabel is optional when there's no link
});
