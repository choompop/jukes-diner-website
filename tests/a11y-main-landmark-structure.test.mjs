/**
 * A11Y Test: Main Landmark Structure (Static Analysis)
 * 
 * Validates that DashboardLayout.tsx has:
 * 1. Exactly ONE <main> landmark (no duplicates)
 * 2. Root element is <div>, not <main> (prevents nesting)
 * 3. No nested main elements in the JSX structure
 * 
 * Issue: t_c191fe29
 * Fix: Dashboard layout uses single <main> with <div> wrapper
 * 
 * Note: This is a static code analysis test. For runtime DOM testing,
 * use the Playwright test (a11y-main-landmark.test.mjs) once Playwright is configured.
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

test('DashboardLayout.tsx should have exactly one main element', () => {
  const layoutPath = join(projectRoot, 'app/dashboard/components/DashboardLayout.tsx');
  const content = readFileSync(layoutPath, 'utf-8');
  
  // Count <main tags (opening tags only, with space or >)
  const mainMatches = content.match(/<main[\s>]/g) || [];
  const mainCount = mainMatches.length;
  
  assert.strictEqual(
    mainCount,
    1,
    `Expected exactly 1 <main> element, found ${mainCount}`
  );
});

test('DashboardLayout.tsx root should be div, not main', () => {
  const layoutPath = join(projectRoot, 'app/dashboard/components/DashboardLayout.tsx');
  const content = readFileSync(layoutPath, 'utf-8');
  
  // Find the return statement's root element
  const returnMatch = content.match(/return\s*\(\s*\n?\s*<(\w+)/);
  
  assert(returnMatch, 'Could not find return statement in component');
  
  const rootElement = returnMatch[1];
  
  assert.strictEqual(
    rootElement,
    'div',
    `Root element should be <div>, found <${rootElement}>`
  );
});

test('DashboardLayout.tsx should not have nested main elements', () => {
  const layoutPath = join(projectRoot, 'app/dashboard/components/DashboardLayout.tsx');
  const content = readFileSync(layoutPath, 'utf-8');
  
  // Check for nested main pattern (main inside main)
  // This is a simple text search - for precise validation, use Playwright
  const hasNestedMain = /<main[^>]*>[\s\S]*<main/i.test(content);
  
  assert.strictEqual(
    hasNestedMain,
    false,
    'Found nested <main> elements - this creates accessibility violations'
  );
});

test('app/dashboard/page.js should render a heading while client redirect resolves', () => {
  const pagePath = join(projectRoot, 'app/dashboard/page.js');
  const content = readFileSync(pagePath, 'utf-8');

  assert(
    /<h1[\s>]/i.test(content),
    'dashboard redirect page should include an h1 so axe page-has-heading-one passes before redirect'
  );
});

test('app/dashboard/layout.tsx should delegate to DashboardLayout component', () => {
  const layoutPath = join(projectRoot, 'app/dashboard/layout.tsx');
  const content = readFileSync(layoutPath, 'utf-8');
  
  // Verify it imports and uses DashboardLayout
  assert(
    content.includes('import DashboardLayout'),
    'layout.tsx should import DashboardLayout component'
  );
  
  assert(
    content.includes('<DashboardLayout>'),
    'layout.tsx should render DashboardLayout component'
  );
  
  // Ensure it doesn't have its own <main> tag
  const hasOwnMain = /<main[\s>]/i.test(content);
  assert.strictEqual(
    hasOwnMain,
    false,
    'app/dashboard/layout.tsx should not have its own <main> tag'
  );
});
