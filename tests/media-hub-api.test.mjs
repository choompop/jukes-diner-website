import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';

import {
  createDefaultMediaHub,
  writeMediaHub,
  applyMediaHubAction,
} from '../lib/media-hub.mjs';

test('applyMediaHubAction handles addAsset workflow action', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'media-hub-api-'));
  const filePath = path.join(tempDir, 'media-hub.json');
  await writeMediaHub(createDefaultMediaHub(), filePath);

  const result = await applyMediaHubAction('addAsset', {
    title: 'New weekend catering highlight',
    type: 'photo',
    owner: 'Catering lead',
    tags: ['catering-conversion', 'food-proof'],
    channels: ['instagram'],
  }, filePath);

  assert.equal(result.asset.id, 'new-weekend-catering-highlight');
  assert.equal(result.asset.status, 'needs-approval');
  assert.deepEqual(result.asset.tags, ['catering-conversion', 'food-proof']);

  await rm(tempDir, { recursive: true, force: true });
});

test('applyMediaHubAction handles tagAsset workflow action', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'media-hub-api-'));
  const filePath = path.join(tempDir, 'media-hub.json');
  await writeMediaHub(createDefaultMediaHub(), filePath);

  const result = await applyMediaHubAction('tagAsset', {
    assetId: 'prep-routine-vertical',
    tags: ['build-in-public', 'prep'],
  }, filePath);

  assert.equal(result.asset.status, 'needs-approval');
  assert.deepEqual(result.asset.tags, ['build-in-public', 'prep']);

  await rm(tempDir, { recursive: true, force: true });
});

test('applyMediaHubAction handles reviewAsset approve workflow action', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'media-hub-api-'));
  const filePath = path.join(tempDir, 'media-hub.json');
  await writeMediaHub(createDefaultMediaHub(), filePath);

  const result = await applyMediaHubAction('reviewAsset', {
    assetId: 'catering-table-spread',
    decision: 'approve',
    reviewer: 'Brand lead',
  }, filePath);

  assert.equal(result.asset.status, 'approved');
  assert.equal(result.asset.reviewedBy, 'Brand lead');
  assert.ok(result.asset.storagePath.includes('/approved/'));

  await rm(tempDir, { recursive: true, force: true });
});

test('applyMediaHubAction handles reviewAsset reject workflow action', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'media-hub-api-'));
  const filePath = path.join(tempDir, 'media-hub.json');
  await writeMediaHub(createDefaultMediaHub(), filePath);

  const result = await applyMediaHubAction('reviewAsset', {
    assetId: 'catering-table-spread',
    decision: 'reject',
    reviewer: 'Brand lead',
    reason: 'Lighting too dark for web use',
  }, filePath);

  assert.equal(result.asset.status, 'rejected');
  assert.equal(result.asset.rejectionReason, 'Lighting too dark for web use');

  await rm(tempDir, { recursive: true, force: true });
});

test('applyMediaHubAction handles promoteAsset workflow action', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'media-hub-api-'));
  const filePath = path.join(tempDir, 'media-hub.json');
  await writeMediaHub(createDefaultMediaHub(), filePath);

  // First approve an asset
  await applyMediaHubAction('reviewAsset', {
    assetId: 'catering-table-spread',
    decision: 'approve',
    reviewer: 'Brand lead',
  }, filePath);

  // Then promote it
  const result = await applyMediaHubAction('promoteAsset', {
    assetId: 'catering-table-spread',
    promotedBy: 'Marketing lead',
  }, filePath);

  assert.equal(result.asset.promotedToRepurposing, true);
  assert.equal(result.asset.promotedBy, 'Marketing lead');
  assert.ok(result.queueItems.length > 0);

  await rm(tempDir, { recursive: true, force: true });
});

test('applyMediaHubAction rejects unsupported action types', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'media-hub-api-'));
  const filePath = path.join(tempDir, 'media-hub.json');
  await writeMediaHub(createDefaultMediaHub(), filePath);

  await assert.rejects(
    () => applyMediaHubAction('deleteAsset', { assetId: 'test' }, filePath),
    /unsupported/i
  );

  await rm(tempDir, { recursive: true, force: true });
});

test('applyMediaHubAction persists all workflow actions to disk', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'media-hub-api-'));
  const filePath = path.join(tempDir, 'media-hub.json');
  await writeMediaHub(createDefaultMediaHub(), filePath);

  // Add an asset
  await applyMediaHubAction('addAsset', {
    title: 'Workflow test asset',
    type: 'photo',
    tags: ['test'],
  }, filePath);

  // Tag it
  await applyMediaHubAction('tagAsset', {
    assetId: 'workflow-test-asset',
    tags: ['food-proof', 'test'],
  }, filePath);

  // Approve it
  await applyMediaHubAction('reviewAsset', {
    assetId: 'workflow-test-asset',
    decision: 'approve',
  }, filePath);

  // Verify persistence - import separately to avoid cached modules
  const { readMediaHub: freshReadMediaHub } = await import('../lib/media-hub.mjs');
  const reloaded = await freshReadMediaHub(filePath);
  
  const asset = reloaded.assets.find((a) => a.id === 'workflow-test-asset');
  assert.ok(asset, 'Asset should persist after workflow actions');
  assert.equal(asset.status, 'approved');
  assert.ok(asset.tags.includes('food-proof'));

  await rm(tempDir, { recursive: true, force: true });
});
