import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('DashboardLayout includes Workflow navigation link in Hermes/Kanban section', async () => {
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

  // Verify Workflow Board nav item with path /dashboard/workflow
  assert.match(
    layoutSource,
    /\{\s*name:\s*['"]Workflow Board['"],[^}]*path:\s*['"]\/dashboard\/workflow['"]/,
    'Workflow Board navigation item should exist with path /dashboard/workflow'
  );

  // Verify Operator Dashboard section exists (main operator area)
  assert.match(
    layoutSource,
    /label:\s*['"]Operator Dashboard['"]/,
    'Operator Dashboard section should exist to separate operator from Hermes views'
  );

  // Verify Public Website section exists (clear separation)
  assert.match(
    layoutSource,
    /label:\s*['"]Public Website['"]/,
    'Public Website section should exist to separate public from internal dashboard'
  );
});
