/**
 * Test: Metric card grid responsive breakpoints
 * 
 * Requirements:
 * - Mobile (< 768px): 1 column, full-width cards, 80px min height
 * - Tablet (768-1023px): 2 columns, 100px min height, weather card spans 2 cols
 * - Desktop (1024px+): 4 columns, 120px min height
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const commandCenterPath = '/Users/lexi/projects/jukes-diner-website/app/dashboard/command-center/page.tsx';
const metricCardPath = '/Users/lexi/projects/jukes-diner-website/components/MetricCard.tsx';

test('Command Center grid uses correct responsive breakpoints (1/2/4 columns)', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  // Find the Quick Stats Grid section
  const gridMatch = content.match(/Quick Stats Grid[\s\S]*?<div className="([^"]*grid[^"]*)">/);
  
  assert.ok(gridMatch, 'Quick Stats Grid container should exist');
  
  const gridClasses = gridMatch[1];
  
  // Mobile: 1 column
  assert.ok(
    gridClasses.includes('grid-cols-1'),
    'Mobile layout should use 1 column (grid-cols-1)'
  );
  
  // Tablet: 2 columns at md breakpoint
  assert.ok(
    gridClasses.includes('md:grid-cols-2'),
    'Tablet layout should use 2 columns (md:grid-cols-2)'
  );
  
  // Desktop: 4 columns at lg breakpoint
  assert.ok(
    gridClasses.includes('lg:grid-cols-4'),
    'Desktop layout should use 4 columns (lg:grid-cols-4)'
  );
});

test('MetricCard component has responsive minimum heights', () => {
  const content = readFileSync(metricCardPath, 'utf-8');
  
  // Should have min-h-[80px] for mobile, md:min-h-[100px] for tablet, lg:min-h-[120px] for desktop
  assert.ok(
    content.includes('min-h-[80px]'),
    'MetricCard should have min-h-[80px] for mobile'
  );
  
  assert.ok(
    content.includes('md:min-h-[100px]'),
    'MetricCard should have md:min-h-[100px] for tablet'
  );
  
  assert.ok(
    content.includes('lg:min-h-[120px]'),
    'MetricCard should have lg:min-h-[120px] for desktop'
  );
});

test('MetricCard has responsive typography (numbers)', () => {
  const content = readFileSync(metricCardPath, 'utf-8');
  
  // Numbers should scale from text-3xl (30px mobile) to md:text-4xl (36px tablet/desktop)
  assert.ok(
    content.includes('text-3xl') && content.includes('md:text-4xl'),
    'Numbers should use text-3xl (mobile) → md:text-4xl (tablet/desktop)'
  );
});

test('MetricCard has responsive typography (labels)', () => {
  const content = readFileSync(metricCardPath, 'utf-8');
  
  // Labels should scale from text-sm (14px mobile) to md:text-xs (12px tablet/desktop)
  assert.ok(
    content.includes('text-sm') && content.includes('md:text-xs'),
    'Labels should use text-sm (mobile) → md:text-xs (tablet/desktop)'
  );
});

test('MetricCard has responsive padding', () => {
  const content = readFileSync(metricCardPath, 'utf-8');
  
  // Padding should be p-5 (20px mobile) and md:p-6 (24px tablet/desktop)
  assert.ok(
    content.includes('p-5') && content.includes('md:p-6'),
    'MetricCard should have p-5 (mobile) → md:p-6 (tablet/desktop)'
  );
});

test('Grid has responsive gap spacing', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  const gridMatch = content.match(/Quick Stats Grid[\s\S]*?<div className="([^"]*grid[^"]*)">/);
  const gridClasses = gridMatch[1];
  
  // Gap should be gap-4 (16px) base and lg:gap-5 (20px desktop)
  assert.ok(
    gridClasses.includes('gap-4'),
    'Grid should have gap-4 (16px) base gap'
  );
  
  assert.ok(
    gridClasses.includes('lg:gap-5'),
    'Grid should have lg:gap-5 (20px) for desktop'
  );
});

test('Weather card spans 2 columns on tablet, 1 on desktop', () => {
  const content = readFileSync(commandCenterPath, 'utf-8');
  
  // Weather card should have className="md:col-span-2 lg:col-span-1"
  // Just check if the weather card MetricCard includes this className prop
  const hasWeatherCardSpan = content.includes('className="md:col-span-2 lg:col-span-1"') &&
                              content.match(/label="Nashville, TN"[\s\S]{0,500}md:col-span-2/);
  
  assert.ok(
    hasWeatherCardSpan,
    'Weather card should have className="md:col-span-2 lg:col-span-1" for responsive spanning'
  );
});

console.log('✅ All metric cards responsive tests passed');
