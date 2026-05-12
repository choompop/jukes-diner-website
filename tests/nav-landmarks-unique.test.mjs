import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * A11Y Test: Navigation Landmarks Unique Labels
 * 
 * Validates that:
 * 1. Top navbar has aria-label="Main navigation"
 * 2. Dashboard sidebar nav has aria-label="Dashboard sidebar"
 * 3. Both nav elements have unique, descriptive labels
 * 
 * Issue: t_0880823c
 * Axe rule: landmark-unique (moderate impact)
 * Source QA task: t_fb7613c7
 */

test('Top navbar should have aria-label="Main navigation"', () => {
  const navbarPath = '/Users/lexi/projects/jukes-diner-website/app/components/Navbar.tsx';
  const content = readFileSync(navbarPath, 'utf-8');
  
  // Check for the nav element with aria-label
  const hasMainNavLabel = content.includes('<nav aria-label="Main navigation"');
  assert.ok(
    hasMainNavLabel,
    'Top navbar should have aria-label="Main navigation"'
  );
  
  // Verify it's on the sticky top nav
  const navRegex = /<nav\s+aria-label="Main navigation"\s+className="[^"]*sticky[^"]*top-0[^"]*bg-diner-cream[^"]*">/;
  assert.ok(
    navRegex.test(content),
    'Main navigation label should be on the sticky public navbar'
  );
});

test('Dashboard sidebar nav should have aria-label="Dashboard sidebar"', () => {
  const layoutPath = '/Users/lexi/projects/jukes-diner-website/app/dashboard/components/DashboardLayout.tsx';
  const content = readFileSync(layoutPath, 'utf-8');
  
  // Check for the nav element with aria-label
  const hasSidebarLabel = content.includes('<nav aria-label="Dashboard sidebar"');
  assert.ok(
    hasSidebarLabel,
    'Dashboard sidebar should have aria-label="Dashboard sidebar"'
  );
  
  // Verify it has navigation content (overflow-y-auto for scrolling nav)
  const navRegex = /<nav\s+aria-label="Dashboard sidebar"\s+className="[^"]*overflow-y-auto[^"]*">/;
  assert.ok(
    navRegex.test(content),
    'Dashboard sidebar label should be on the navigation element with overflow-y-auto'
  );
});

test('Both nav landmarks should have unique labels', () => {
  const navbarPath = '/Users/lexi/projects/jukes-diner-website/app/components/Navbar.tsx';
  const layoutPath = '/Users/lexi/projects/jukes-diner-website/app/dashboard/components/DashboardLayout.tsx';
  
  const navbarContent = readFileSync(navbarPath, 'utf-8');
  const layoutContent = readFileSync(layoutPath, 'utf-8');
  
  // Extract aria-label values
  const navbarMatch = navbarContent.match(/aria-label="([^"]+)"/);
  const layoutMatch = layoutContent.match(/aria-label="Dashboard sidebar"/);
  
  assert.ok(navbarMatch, 'Navbar should have an aria-label');
  assert.ok(layoutMatch, 'Dashboard sidebar should have an aria-label');
  
  // Verify labels are different
  const navbarLabel = navbarMatch[1];
  assert.notEqual(
    navbarLabel,
    'Dashboard sidebar',
    'Nav labels must be unique (navbar should not use "Dashboard sidebar")'
  );
  
  assert.equal(
    navbarLabel,
    'Main navigation',
    'Navbar label should be "Main navigation"'
  );
});

test('No nav elements should exist without aria-label', () => {
  const navbarPath = '/Users/lexi/projects/jukes-diner-website/app/components/Navbar.tsx';
  const layoutPath = '/Users/lexi/projects/jukes-diner-website/app/dashboard/components/DashboardLayout.tsx';
  
  const navbarContent = readFileSync(navbarPath, 'utf-8');
  const layoutContent = readFileSync(layoutPath, 'utf-8');
  
  // Find all nav tags
  const navbarNavs = navbarContent.match(/<nav[\s>]/g) || [];
  const layoutNavs = layoutContent.match(/<nav[\s>]/g) || [];
  
  // Find nav tags with aria-label
  const navbarLabeledNavs = navbarContent.match(/<nav\s+aria-label="/g) || [];
  const layoutLabeledNavs = layoutContent.match(/<nav\s+aria-label="/g) || [];
  
  assert.equal(
    navbarNavs.length,
    navbarLabeledNavs.length,
    'All nav elements in Navbar.tsx should have aria-label'
  );
  
  assert.equal(
    layoutNavs.length,
    layoutLabeledNavs.length,
    'All nav elements in DashboardLayout.tsx should have aria-label'
  );
});
