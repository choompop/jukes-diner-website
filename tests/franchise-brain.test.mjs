import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, readFile, rm } from 'node:fs/promises';

import {
  FRANCHISE_BRAIN_LAYER_IDS,
  createDefaultFranchiseBrain,
  getFranchiseBrainItems,
  getFranchiseBrainStats,
  readFranchiseBrain,
  writeFranchiseBrain,
  getFranchiseBrainReferenceFiles,
  getFranchiseBrainCommandCenter,
  routeSlackSignalToBrainItem,
  addFranchiseBrainSignal,
  updateFranchiseBrainSignal,
  validateFranchiseBrainSignalUpdate,
  convertFranchiseBrainSignalToItem,
  archiveFranchiseBrainSignal,
  filterFranchiseBrainSignals,
  readFranchiseBrainSignals,
  getFranchiseBrainSignalStats,
  validateFranchiseBrainItemUpdate,
  updateFranchiseBrainItem,
  archiveFranchiseBrainItem,
  createFranchiseBrainItem,
  linkFranchiseBrainItemToKanbanTask,
  createKanbanTaskForFranchiseBrainItem,
} from '../lib/franchise-brain.mjs';

test('default franchise brain keeps the two required operating layers', () => {
  const brain = createDefaultFranchiseBrain();

  assert.deepEqual(
    brain.layers.map((layer) => layer.id),
    FRANCHISE_BRAIN_LAYER_IDS,
  );
  assert.equal(brain.layers.length, 2);
  assert.ok(brain.layers.every((layer) => layer.items.length >= 3));
});

test('franchise brain items flatten into a layer-aware board for UI and API use', () => {
  const brain = createDefaultFranchiseBrain();
  const items = getFranchiseBrainItems(brain);

  assert.equal(items.length, 8);
  assert.deepEqual(
    [...new Set(items.map((item) => item.layerId))],
    FRANCHISE_BRAIN_LAYER_IDS,
  );
  assert.ok(items.every((item) => item.layerName && item.owner && item.status && item.priority));
  assert.match(items[0].title, /capture|calendar|ops/i);
});

test('franchise brain stats summarize active work across both layers', () => {
  const stats = getFranchiseBrainStats(createDefaultFranchiseBrain());

  assert.deepEqual(stats, {
    layers: 2,
    items: 8,
    activeItems: 6,
    blockedItems: 1,
    highPriorityItems: 4,
  });
});

test('franchise brain storage helpers persist and reload local JSON cleanly', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-'));
  const filePath = path.join(tempDir, 'brain.json');
  const brain = createDefaultFranchiseBrain();

  await writeFranchiseBrain(brain, filePath);
  const raw = await readFile(filePath, 'utf8');
  const reloaded = await readFranchiseBrain(filePath);

  assert.match(raw, /"content-pipeline"/);
  assert.equal(reloaded.layers[0].name, 'Content Pipeline');
  assert.equal(reloaded.layers[1].items.at(-1).status, 'blocked');

  await rm(tempDir, { recursive: true, force: true });
});

test('reading a missing franchise brain file falls back to the default model', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-missing-'));
  const missingPath = path.join(tempDir, 'missing.json');

  const brain = await readFranchiseBrain(missingPath);

  assert.deepEqual(
    brain.layers.map((layer) => layer.id),
    FRANCHISE_BRAIN_LAYER_IDS,
  );

  await rm(tempDir, { recursive: true, force: true });
});

test('franchise brain exposes canonical reference files for retrieval', () => {
  const files = getFranchiseBrainReferenceFiles(createDefaultFranchiseBrain());

  assert.equal(files.length, 8);
  assert.deepEqual(
    [...new Set(files.map((file) => file.layerId))],
    FRANCHISE_BRAIN_LAYER_IDS,
  );
  assert.ok(files.some((file) => file.id === 'brand-voice' && /voice/i.test(file.title)));
  assert.ok(files.every((file) => file.path.startsWith('brain/files/')));
});

test('franchise command center groups brain records by workstream and urgency', () => {
  const commandCenter = getFranchiseBrainCommandCenter(createDefaultFranchiseBrain());

  assert.equal(commandCenter.sections.length, 4);
  assert.deepEqual(commandCenter.sections.map((section) => section.id), [
    'capture-inbox',
    'content-engine',
    'ops-control',
    'franchise-scale',
  ]);
  assert.equal(commandCenter.urgentItems.length, 4);
  assert.ok(commandCenter.sections.every((section) => section.items.length >= 1));
});

test('Slack signals can be routed into durable brain items without generic memory', () => {
  const routed = routeSlackSignalToBrainItem({
    text: 'Customer asked about catering trays for 40 next Friday and gluten-free options',
    user: 'U123',
    channel: 'all-jukes-diner',
    ts: '1778283407.693619',
  });

  assert.equal(routed.source.platform, 'slack');
  assert.equal(routed.type, 'catering_lead');
  assert.equal(routed.layerId, 'internal-ops');
  assert.equal(routed.priority, 'high');
  assert.match(routed.title, /catering/i);
  assert.ok(routed.tags.includes('catering'));
});

test('brain signal inbox persists routed Slack notes for the dashboard', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-signals-'));
  const filePath = path.join(tempDir, 'signals.json');

  const saved = await addFranchiseBrainSignal({
    text: 'Post a reel about the lunch rush and save the customer quote',
    user: 'U456',
    channel: 'growth',
    ts: '1778289999.100',
    createdAt: '2026-05-08T20:00:00.000Z',
  }, filePath);
  const reloaded = await readFranchiseBrainSignals(filePath);
  const stats = getFranchiseBrainSignalStats(reloaded);

  assert.equal(saved.type, 'content_idea');
  assert.equal(reloaded.length, 1);
  assert.equal(reloaded[0].layerId, 'content-pipeline');
  assert.deepEqual(stats, {
    signals: 1,
    newSignals: 1,
    triagedSignals: 0,
    highPrioritySignals: 0,
    contentSignals: 1,
    opsSignals: 0,
  });

  await rm(tempDir, { recursive: true, force: true });
});

test('brain signal inbox preserves structured manual records', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-manual-signals-'));
  const filePath = path.join(tempDir, 'signals.json');

  const saved = await addFranchiseBrainSignal({
    id: 'manual-sop-update',
    type: 'sop_update',
    title: 'Update closing checklist',
    summary: 'Add a reminder to photograph the catering prep area before close.',
    layerId: 'internal-ops',
    priority: 'normal',
    source: { platform: 'manual', channel: 'dashboard', user: 'john', ts: 'manual' },
  }, filePath);

  assert.equal(saved.id, 'manual-sop-update');
  assert.equal(saved.type, 'sop_update');
  assert.equal(saved.source.platform, 'manual');

  await rm(tempDir, { recursive: true, force: true });
});

test('brain signal triage updates status owner priority and next action', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-update-signals-'));
  const filePath = path.join(tempDir, 'signals.json');

  await addFranchiseBrainSignal({
    id: 'signal-to-triage',
    type: 'ops_note',
    title: 'Dishwasher is leaking',
    summary: 'Team reported dishwasher leak after close.',
    layerId: 'internal-ops',
    priority: 'normal',
  }, filePath);

  const updates = validateFranchiseBrainSignalUpdate({
    status: 'triaged',
    priority: 'high',
    owner: 'Operations Lead',
    nextAction: 'Call maintenance vendor before lunch service.',
    tags: 'maintenance, equipment',
  });
  const updated = await updateFranchiseBrainSignal('signal-to-triage', updates, filePath);
  const reloaded = await readFranchiseBrainSignals(filePath);
  const stats = getFranchiseBrainSignalStats(reloaded);

  assert.equal(updated.status, 'triaged');
  assert.equal(updated.owner, 'Operations Lead');
  assert.deepEqual(updated.tags, ['maintenance', 'equipment']);
  assert.equal(stats.newSignals, 0);
  assert.equal(stats.triagedSignals, 1);
  assert.equal(stats.highPrioritySignals, 1);

  await rm(tempDir, { recursive: true, force: true });
});

test('brain signal triage rejects invalid status values', () => {
  assert.throws(
    () => validateFranchiseBrainSignalUpdate({ status: 'send_email_now' }),
    /Invalid status/,
  );
});

test('brain signals can be filtered by search status layer priority and type', () => {
  const signals = [
    {
      id: 'catering-1',
      type: 'catering_lead',
      title: 'Catering for school event',
      summary: 'Needs trays for 80 people',
      layerId: 'internal-ops',
      status: 'new',
      priority: 'high',
      owner: 'Catering response owner',
    },
    {
      id: 'content-1',
      type: 'content_idea',
      title: 'Lunch rush reel',
      summary: 'Film the grill line and customer quote',
      layerId: 'content-pipeline',
      status: 'triaged',
      priority: 'normal',
      owner: 'Marketing Lead',
    },
  ];

  assert.deepEqual(filterFranchiseBrainSignals(signals, { query: 'school' }).map((item) => item.id), ['catering-1']);
  assert.deepEqual(filterFranchiseBrainSignals(signals, { layerId: 'content-pipeline' }).map((item) => item.id), ['content-1']);
  assert.deepEqual(filterFranchiseBrainSignals(signals, { status: 'new', priority: 'high', type: 'catering_lead' }).map((item) => item.id), ['catering-1']);
});

test('brain signal can be converted into a canonical layer item and marked done', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-convert-'));
  const brainPath = path.join(tempDir, 'brain.json');
  const signalsPath = path.join(tempDir, 'signals.json');

  await writeFranchiseBrain(createDefaultFranchiseBrain(), brainPath);
  await addFranchiseBrainSignal({
    id: 'convert-catering-lead',
    type: 'catering_lead',
    title: 'Catering lead for Vanderbilt lunch',
    summary: 'Prospect needs trays for 65 people next Thursday.',
    rawText: 'Prospect needs trays for 65 people next Thursday.',
    layerId: 'internal-ops',
    priority: 'high',
    owner: 'Catering response owner',
    tags: ['catering', 'lead'],
  }, signalsPath);

  const result = await convertFranchiseBrainSignalToItem('convert-catering-lead', {
    targetTitle: 'Vanderbilt catering follow-up',
    cadence: 'once',
    output: 'Qualified catering opportunity',
  }, brainPath, signalsPath);
  const brain = await readFranchiseBrain(brainPath);
  const signals = await readFranchiseBrainSignals(signalsPath);
  const items = getFranchiseBrainItems(brain, 'internal-ops');

  assert.equal(result.item.title, 'Vanderbilt catering follow-up');
  assert.ok(items.some((item) => item.id === result.item.id && item.priority === 'high' && item.status === 'active'));
  assert.equal(signals.find((signal) => signal.id === 'convert-catering-lead').status, 'done');
  assert.match(signals.find((signal) => signal.id === 'convert-catering-lead').nextAction, /Converted/);

  await rm(tempDir, { recursive: true, force: true });
});

test('brain signal can be archived without deleting its audit trail', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-archive-'));
  const filePath = path.join(tempDir, 'signals.json');

  await addFranchiseBrainSignal({
    id: 'archive-me',
    title: 'No-action FYI',
    summary: 'Team noted a resolved issue that needs no follow-up.',
  }, filePath);
  const archived = await archiveFranchiseBrainSignal('archive-me', 'No further action.', filePath);

  assert.equal(archived.status, 'archived');
  assert.equal(archived.nextAction, 'Archived: No further action.');

  await rm(tempDir, { recursive: true, force: true });
});

test('canonical brain card updates preserve layer storage and derived board fields', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-card-update-'));
  const brainPath = path.join(tempDir, 'brain.json');
  await writeFranchiseBrain(createDefaultFranchiseBrain(), brainPath);

  const updates = validateFranchiseBrainItemUpdate({
    status: 'blocked',
    priority: 'urgent',
    owner: 'Ops Support Lead',
    summary: 'Escalate supplier outage before operators have to chase it.',
    inputs: 'Supplier text,Operator report',
    outputs: ['Escalation owner assigned'],
  });
  const result = await updateFranchiseBrainItem('vendor-sync', updates, brainPath);
  const items = getFranchiseBrainItems(result.brain, 'internal-ops');
  const updated = items.find((item) => item.id === 'vendor-sync');

  assert.equal(result.item.id, 'vendor-sync');
  assert.equal(updated.status, 'blocked');
  assert.equal(updated.priority, 'urgent');
  assert.equal(updated.owner, 'Ops Support Lead');
  assert.deepEqual(updated.inputs, ['Supplier text', 'Operator report']);
  assert.deepEqual(updated.outputs, ['Escalation owner assigned']);
  assert.ok(result.brain.updatedAt);

  await rm(tempDir, { recursive: true, force: true });
});

test('canonical brain card can move layers and keeps command center links intact by id', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-card-move-'));
  const brainPath = path.join(tempDir, 'brain.json');
  await writeFranchiseBrain(createDefaultFranchiseBrain(), brainPath);

  const result = await updateFranchiseBrainItem('weekly-content-calendar', {
    layerId: 'internal-ops',
    owner: 'Area Coach',
    cadence: 'weekly ops review',
  }, brainPath);
  const contentItems = getFranchiseBrainItems(result.brain, 'content-pipeline');
  const opsItems = getFranchiseBrainItems(result.brain, 'internal-ops');
  const commandCenter = getFranchiseBrainCommandCenter(result.brain);

  assert.equal(contentItems.some((item) => item.id === 'weekly-content-calendar'), false);
  assert.equal(opsItems.some((item) => item.id === 'weekly-content-calendar' && item.owner === 'Area Coach'), true);
  assert.ok(commandCenter.sections.find((section) => section.id === 'content-engine').items.some((item) => item.id === 'weekly-content-calendar'));

  await rm(tempDir, { recursive: true, force: true });
});

test('canonical brain card archive marks the card without deleting operational history', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-card-archive-'));
  const brainPath = path.join(tempDir, 'brain.json');
  await writeFranchiseBrain(createDefaultFranchiseBrain(), brainPath);

  const result = await archiveFranchiseBrainItem('performance-feedback-loop', 'Folded into weekly content calendar.', brainPath);
  const archived = getFranchiseBrainItems(result.brain).find((item) => item.id === 'performance-feedback-loop');

  assert.equal(result.item.status, 'archived');
  assert.equal(archived.status, 'archived');
  assert.ok(archived.outputs.includes('Archived: Folded into weekly content calendar.'));

  await rm(tempDir, { recursive: true, force: true });
});

test('canonical brain card update rejects invalid operating status and priority', () => {
  assert.throws(
    () => validateFranchiseBrainItemUpdate({ status: 'new' }),
    /Invalid item status/,
  );
  assert.throws(
    () => validateFranchiseBrainItemUpdate({ priority: 'panic' }),
    /Invalid item priority/,
  );
});

test('canonical brain card creation adds owned work directly to the selected layer', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-card-create-'));
  const brainPath = path.join(tempDir, 'brain.json');
  await writeFranchiseBrain(createDefaultFranchiseBrain(), brainPath);

  const result = await createFranchiseBrainItem({
    layerId: 'internal-ops',
    title: 'May royalty close checklist',
    summary: 'Confirm unit sales, royalty calc, and deposit backup before month-end.',
    owner: 'Finance Lead',
    status: 'planned',
    priority: 'high',
    cadence: 'monthly',
    inputs: 'POS close, Bank deposit export, Stripe status',
    outputs: ['Royalty close packet'],
  }, brainPath);
  const items = getFranchiseBrainItems(result.brain, 'internal-ops');
  const created = items.find((item) => item.id === result.item.id);

  assert.equal(result.item.id, 'may-royalty-close-checklist');
  assert.equal(created.owner, 'Finance Lead');
  assert.equal(created.status, 'planned');
  assert.equal(created.priority, 'high');
  assert.deepEqual(created.inputs, ['POS close', 'Bank deposit export', 'Stripe status']);
  assert.ok(result.brain.updatedAt);

  await rm(tempDir, { recursive: true, force: true });
});

test('canonical brain card creation requires a real title and valid layer', async () => {
  await assert.rejects(
    () => createFranchiseBrainItem({ layerId: 'internal-ops', title: '  ' }),
    /Brain item title is required/,
  );
  await assert.rejects(
    () => createFranchiseBrainItem({ layerId: 'outside-system', title: 'Escalation loop' }),
    /Invalid item layer/,
  );
});

test('canonical brain card can be linked to an existing kanban task id and status', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-kanban-link-'));
  const brainPath = path.join(tempDir, 'brain.json');
  await writeFranchiseBrain(createDefaultFranchiseBrain(), brainPath);

  const result = await linkFranchiseBrainItemToKanbanTask('vendor-sync', {
    taskId: 't_vendor_sync',
    status: 'blocked',
    url: '/dashboard/workflow#t_vendor_sync',
  }, brainPath);
  const linked = getFranchiseBrainItems(result.brain).find((item) => item.id === 'vendor-sync');

  assert.equal(result.item.kanbanTaskId, 't_vendor_sync');
  assert.equal(linked.kanbanTaskId, 't_vendor_sync');
  assert.equal(linked.kanbanTaskStatus, 'blocked');
  assert.equal(linked.kanbanTaskUrl, '/dashboard/workflow#t_vendor_sync');

  await rm(tempDir, { recursive: true, force: true });
});

test('canonical brain card creates one linked kanban task and reuses it on repeat calls', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-brain-kanban-create-'));
  const brainPath = path.join(tempDir, 'brain.json');
  const workflowPath = path.join(tempDir, 'workflow-kanban.json');
  await writeFranchiseBrain(createDefaultFranchiseBrain(), brainPath);

  const first = await createKanbanTaskForFranchiseBrainItem('opening-playbook', {
    laneId: 'ready',
    taskId: 't_opening_playbook',
    summary: 'Ship operator opening playbook execution card.',
  }, brainPath, workflowPath);
  const second = await createKanbanTaskForFranchiseBrainItem('opening-playbook', {
    laneId: 'ready',
    taskId: 't_opening_playbook_duplicate',
  }, brainPath, workflowPath);

  const readyTasks = second.workflow.lanes.find((lane) => lane.id === 'ready').tasks;
  const matchingTasks = readyTasks.filter((task) => task.brainItemId === 'opening-playbook');
  const linked = getFranchiseBrainItems(second.brain).find((item) => item.id === 'opening-playbook');

  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(second.task.id, 't_opening_playbook');
  assert.equal(matchingTasks.length, 1);
  assert.equal(linked.kanbanTaskId, 't_opening_playbook');
  assert.equal(linked.kanbanTaskStatus, 'ready');

  await rm(tempDir, { recursive: true, force: true });
});
