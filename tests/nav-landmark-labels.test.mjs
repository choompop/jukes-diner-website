import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Navbar has unique aria-label for landmark navigation', async () => {
  const navbarSource = await readFile(
    'app/components/Navbar.tsx',
    'utf-8'
  );

  // Verify top nav has aria-label="Main navigation"
  assert.match(
    navbarSource,
    /<nav\s+aria-label="Main navigation"/,
    'Top navbar should have aria-label="Main navigation" for screen reader landmark navigation'
  );

  // Verify the sticky top navbar still has its styling classes
  assert.match(
    navbarSource,
    /<nav\s+aria-label="Main navigation"\s+className="[^"]*sticky[^"]*top-0[^"]*bg-diner-cream[^"]*">/,
    'Top navbar should maintain its styling classes along with aria-label'
  );
});

test('DashboardLayout sidebar has unique aria-label for landmark navigation', async () => {
  const dashboardSource = await readFile(
    'app/dashboard/components/DashboardLayout.tsx',
    'utf-8'
  );

  // Verify sidebar nav has aria-label="Dashboard sidebar"
  assert.match(
    dashboardSource,
    /<nav\s+aria-label="Dashboard sidebar"/,
    'Dashboard sidebar should have aria-label="Dashboard sidebar" for screen reader landmark navigation'
  );

  // Verify the sidebar nav still has its styling classes
  assert.match(
    dashboardSource,
    /<nav\s+aria-label="Dashboard sidebar"\s+className="flex-grow overflow-y-auto p-4 custom-scrollbar">/,
    'Dashboard sidebar should maintain its styling classes along with aria-label'
  );
});

test('Navigation landmarks have unique, distinguishable labels', async () => {
  const navbarSource = await readFile('app/components/Navbar.tsx', 'utf-8');
  const dashboardSource = await readFile('app/dashboard/components/DashboardLayout.tsx', 'utf-8');

  // Extract aria-label values
  const navbarMatch = navbarSource.match(/aria-label="([^"]+)"/);
  const sidebarMatch = dashboardSource.match(/<nav\s+aria-label="([^"]+)"/);

  assert.ok(navbarMatch, 'Top navbar should have an aria-label');
  assert.ok(sidebarMatch, 'Dashboard sidebar should have an aria-label');

  // Ensure they're different (not both labeled just "navigation")
  assert.notEqual(
    navbarMatch[1],
    sidebarMatch[1],
    'Navigation landmarks should have unique, distinguishable aria-labels'
  );

  // Verify labels are meaningful
  assert.match(
    navbarMatch[1],
    /main|primary|top/i,
    'Top navbar label should indicate it is the main/primary/top navigation'
  );

  assert.match(
    sidebarMatch[1],
    /sidebar|dashboard/i,
    'Sidebar nav label should indicate it is the dashboard sidebar navigation'
  );
});
