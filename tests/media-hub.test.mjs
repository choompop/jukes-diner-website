import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';

import {
  createDefaultMediaHub,
  getMediaHubStats,
  getMediaByTag,
  getBrandBoard,
  getMediaCaptureQueue,
  getContentRepurposingQueue,
  readMediaHub,
  writeMediaHub,
  addMediaAsset,
  tagMediaAsset,
  reviewMediaAsset,
  promoteMediaAssetToRepurposing,
} from '../lib/media-hub.mjs';

test('default media hub creates one searchable source of truth for Jukes media', () => {
  const hub = createDefaultMediaHub();

  assert.equal(hub.title, "Juke's Diner Media + Brand Hub");
  assert.deepEqual(hub.storage.roots.map((root) => root.id), ['raw-capture', 'approved-assets', 'brand-board', 'operator-uploads']);
  assert.ok(hub.assets.length >= 8);
  assert.ok(hub.assets.every((asset) => asset.id && asset.storagePath && Array.isArray(asset.tags)));
});

test('media hub stats separate approved assets from items needing tags or approvals', () => {
  const stats = getMediaHubStats(createDefaultMediaHub());

  assert.equal(stats.totalAssets, 8);
  assert.equal(stats.approvedAssets, 4);
  assert.equal(stats.needsTags, 2);
  assert.equal(stats.needsApproval, 2);
  assert.equal(stats.campaignReadyAssets, 6);
});

test('media search can pull assets by food brand catering and franchise tags', () => {
  const foodAssets = getMediaByTag(createDefaultMediaHub(), 'food-proof');
  const franchiseAssets = getMediaByTag(createDefaultMediaHub(), 'franchise-signal');

  assert.ok(foodAssets.some((asset) => /burger/i.test(asset.title)));
  assert.ok(franchiseAssets.some((asset) => /unit economics/i.test(asset.title)));
});

test('brand board exposes palette typography voice rules and content pillars', () => {
  const board = getBrandBoard(createDefaultMediaHub());

  assert.deepEqual(board.palette.map((color) => color.token), ['diner-red', 'diner-cream', 'diner-teal', 'diner-black']);
  assert.ok(board.voiceRules.some((rule) => /retro/i.test(rule)));
  assert.deepEqual(board.contentPillars.map((pillar) => pillar.id), ['food-proof', 'build-in-public', 'catering-conversion', 'franchise-signal']);
});

test('capture queue tells operators what media to collect next', () => {
  const queue = getMediaCaptureQueue(createDefaultMediaHub());

  assert.equal(queue[0].priority, 'urgent');
  assert.ok(queue.some((item) => /vertical video/i.test(item.request.toLowerCase())));
  assert.ok(queue.every((item) => item.owner && item.channelUse));
});

test('repurposing queue turns approved media into posts and brand-board assets', () => {
  const queue = getContentRepurposingQueue(createDefaultMediaHub());

  assert.ok(queue.length >= 4);
  assert.ok(queue.some((item) => item.output === 'Instagram carousel'));
  assert.ok(queue.some((item) => item.output === 'Franchise proof card'));
});

test('media hub storage persists local JSON cleanly', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'media-hub-'));
  const filePath = path.join(tempDir, 'media-hub.json');

  await writeMediaHub(createDefaultMediaHub(), filePath);
  const reloaded = await readMediaHub(filePath);

  assert.equal(reloaded.assets.length, 8);
  assert.equal(getMediaHubStats(reloaded).approvedAssets, 4);

  await rm(tempDir, { recursive: true, force: true });
});

test('operators can add media metadata into the local JSON hub', () => {
  const result = addMediaAsset(createDefaultMediaHub(), {
    title: 'Saturday catering setup reel',
    type: 'video',
    owner: 'Catering owner',
    storagePath: 'media/jukes-diner/operator-uploads/saturday-catering-setup.mp4',
    channels: ['instagram', 'tiktok'],
    tags: ['catering-conversion'],
  });

  assert.equal(result.asset.id, 'saturday-catering-setup-reel');
  assert.equal(result.asset.status, 'needs-approval');
  assert.equal(result.hub.assets.length, 9);
  assert.ok(result.hub.assets.some((asset) => asset.title === 'Saturday catering setup reel'));
});

test('operators can tag raw assets and move them into approval review', () => {
  const result = tagMediaAsset(createDefaultMediaHub(), 'prep-routine-vertical', ['build-in-public', 'prep', 'tiktok', 'prep']);

  assert.equal(result.asset.status, 'needs-approval');
  assert.deepEqual(result.asset.tags, ['build-in-public', 'prep', 'tiktok']);
  assert.equal(getMediaHubStats(result.hub).needsTags, 1);
  assert.equal(getMediaHubStats(result.hub).needsApproval, 3);
});

test('brand reviewers can approve or reject media assets with audit metadata', () => {
  const approved = reviewMediaAsset(createDefaultMediaHub(), 'catering-table-spread', {
    decision: 'approve',
    reviewer: 'Brand lead',
  });
  const rejected = reviewMediaAsset(approved.hub, 'trailer-park-night-sign', {
    decision: 'reject',
    reviewer: 'Brand lead',
    reason: 'Too dark for paid social.',
  });

  assert.equal(approved.asset.status, 'approved');
  assert.equal(approved.asset.reviewedBy, 'Brand lead');
  assert.equal(rejected.asset.status, 'rejected');
  assert.equal(rejected.asset.rejectionReason, 'Too dark for paid social.');
  assert.equal(getMediaHubStats(rejected.hub).approvedAssets, 5);
  assert.equal(getMediaHubStats(rejected.hub).needsApproval, 0);
});

test('only approved assets can be promoted into the repurposing queue', () => {
  assert.throws(
    () => promoteMediaAssetToRepurposing(createDefaultMediaHub(), 'catering-table-spread'),
    /approved/i,
  );

  const approved = reviewMediaAsset(createDefaultMediaHub(), 'catering-table-spread', { decision: 'approve', reviewer: 'Brand lead' });
  const promoted = promoteMediaAssetToRepurposing(approved.hub, 'catering-table-spread', { promotedBy: 'Marketing lead' });

  assert.equal(promoted.asset.promotedToRepurposing, true);
  assert.equal(promoted.asset.promotedBy, 'Marketing lead');
  assert.ok(promoted.queueItems.some((item) => item.assetId === 'catering-table-spread' && item.output === 'Instagram carousel'));
});
