import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('weather widget displays Nashville, TN location label instead of condition', () => {
  const source = readFileSync('app/dashboard/command-center/page.tsx', 'utf8');
  
  // Verify the label is set to "Nashville, TN"
  assert.match(source, /label="Nashville, TN"/);
  
  // Verify weather.condition is NOT used as a label
  assert.doesNotMatch(source, /label=\{weather\.condition\}/);
  
  // Verify CloudSun icon is present for weather widget
  assert.match(source, /<CloudSun.*\/>/);
});

test('weather widget MetricCard has responsive className for proper grid behavior', () => {
  const source = readFileSync('app/dashboard/command-center/page.tsx', 'utf8');
  
  // Find the weather MetricCard section
  const weatherSection = source.match(/label="Nashville, TN"[\s\S]{0,500}className="md:col-span-2 lg:col-span-1"[\s\S]{0,80}\/>/);
  assert.ok(weatherSection, 'Nashville, TN MetricCard should exist');
  
  // Verify it has responsive grid classes
  assert.match(
    weatherSection[0],
    /className=".*md:col-span.*lg:col-span.*"/,
    'Weather card should have responsive grid classes'
  );
});
