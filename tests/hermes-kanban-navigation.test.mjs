import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('DashboardLayout includes Hermes Kanban navigation link', async () => {
  const layoutSource = await readFile(
    'app/dashboard/components/DashboardLayout.tsx',
    'utf-8'
  );

  // Verify Kanban icon is imported
  assert.match(
    layoutSource,
    /import.*\{[^}]*Kanban[^}]*\}.*from 'lucide-react'/,
    'Kanban icon should be imported from lucide-react'
  );

  // Verify Hermes/Kanban nav group exists
  assert.match(
    layoutSource,
    /label:\s*['"]Hermes \/ Kanban['"]/,
    'Hermes / Kanban navigation group should exist'
  );

  // Verify Hermes Kanban nav item with correct path
  assert.match(
    layoutSource,
    /\{\s*name:\s*['"]Hermes Kanban['"],\s*path:\s*['"]\/dashboard\/hermes-kanban['"]/,
    'Hermes Kanban navigation item should exist with path /dashboard/hermes-kanban'
  );

  // Verify the icon is Kanban (matching suggestion in task)
  const hermesKanbanLineMatch = layoutSource.match(
    /\{\s*name:\s*['"]Hermes Kanban['"],\s*path:\s*['"]\/dashboard\/hermes-kanban['"],\s*icon:\s*<([A-Za-z]+)/
  );
  
  assert.ok(hermesKanbanLineMatch, 'Should find Hermes Kanban nav item with icon');
  assert.equal(
    hermesKanbanLineMatch[1],
    'Kanban',
    'Hermes Kanban should use Kanban icon (matches dashboard visual language)'
  );

  // Verify active state logic exists (pathname === item.path check)
  assert.match(
    layoutSource,
    /pathname\s*===\s*item\.path/,
    'Active state logic should exist to highlight current page'
  );

  // Verify active state styling exists
  assert.match(
    layoutSource,
    /bg-diner-red.*text-white.*shadow/,
    'Active navigation items should have diner-red background styling'
  );
});

test('Hermes Kanban page exists and is configured correctly', async () => {
  const pageSource = await readFile(
    'app/dashboard/hermes-kanban/page.tsx',
    'utf-8'
  );

  // Verify it's a dynamic route
  assert.match(
    pageSource,
    /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/,
    'Hermes Kanban page should be a dynamic route'
  );

  // Verify it imports kanban data function
  assert.match(
    pageSource,
    /import.*getKanbanBoard.*from.*hermes-kanban/,
    'Page should import getKanbanBoard function'
  );
});
