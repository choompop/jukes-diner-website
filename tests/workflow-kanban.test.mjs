import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';

import {
  WORKFLOW_LANE_IDS,
  WORKFLOW_AREA_IDS,
  createDefaultWorkflowBoard,
  getWorkflowLanes,
  getWorkflowStats,
  getWorkflowTasksByArea,
  readWorkflowBoard,
  writeWorkflowBoard,
} from '../lib/workflow-kanban.mjs';

test('default workflow board exposes the required kanban lanes in operator order', () => {
  const board = createDefaultWorkflowBoard();

  assert.deepEqual(board.lanes.map((lane) => lane.id), WORKFLOW_LANE_IDS);
  assert.deepEqual(WORKFLOW_LANE_IDS, ['backlog', 'ready', 'in_progress', 'blocked', 'done']);
  assert.ok(board.lanes.every((lane) => lane.title && lane.operatorPrompt));
});

test('workflow tasks include visible ownership priority and dashboard area links', () => {
  const lanes = getWorkflowLanes(createDefaultWorkflowBoard());
  const tasks = lanes.flatMap((lane) => lane.tasks);

  assert.ok(tasks.length >= 8);
  assert.ok(tasks.every((task) => task.title && task.owner && task.priority && task.areaId && task.areaHref));
  assert.deepEqual([...new Set(tasks.map((task) => task.areaId))].sort(), WORKFLOW_AREA_IDS.toSorted());
  assert.ok(tasks.some((task) => task.areaHref === '/dashboard/financials'));
  assert.ok(tasks.some((task) => task.areaHref === '/dashboard/social'));
  assert.ok(tasks.some((task) => task.areaHref === '/dashboard/franchise-brain'));
});

test('workflow stats summarize active blocked done and high priority build work', () => {
  const stats = getWorkflowStats(createDefaultWorkflowBoard());

  assert.deepEqual(stats, {
    lanes: 5,
    tasks: 10,
    activeTasks: 7,
    blockedTasks: 2,
    doneTasks: 1,
    highPriorityTasks: 5,
  });
});

test('workflow tasks can be grouped by financial media and franchise brain area', () => {
  const grouped = getWorkflowTasksByArea(createDefaultWorkflowBoard());

  assert.deepEqual(Object.keys(grouped).sort(), WORKFLOW_AREA_IDS.toSorted());
  assert.ok(grouped.financial.every((task) => task.areaHref === '/dashboard/financials'));
  assert.ok(grouped.media.every((task) => task.areaHref === '/dashboard/social'));
  assert.ok(grouped['franchise-brain'].every((task) => task.areaHref === '/dashboard/franchise-brain'));
});

test('workflow board storage persists local JSON and falls back safely when missing', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'workflow-kanban-'));
  const filePath = path.join(tempDir, 'workflow-kanban.json');

  await writeWorkflowBoard(createDefaultWorkflowBoard(), filePath);
  const reloaded = await readWorkflowBoard(filePath);
  const missing = await readWorkflowBoard(path.join(tempDir, 'missing.json'));

  assert.equal(reloaded.title, "Juke's Build + Operator Workflow");
  assert.equal(getWorkflowStats(reloaded).tasks, 10);
  assert.deepEqual(missing.lanes.map((lane) => lane.id), WORKFLOW_LANE_IDS);

  await rm(tempDir, { recursive: true, force: true });
});
