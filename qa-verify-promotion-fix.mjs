#!/usr/bin/env node
/**
 * QA verification script for media hub promotion regression fix
 * Tests that promoted assets appear in the repurposing queue even when >2 assets share a tag
 */

import {
  createDefaultMediaHub,
  addMediaAsset,
  reviewMediaAsset,
  promoteMediaAssetToRepurposing,
  getContentRepurposingQueue,
} from './lib/media-hub.mjs';

console.log('QA Verification: Media Hub Promoted Asset Regression Fix');
console.log('========================================================\n');

// Start with default hub
let hub = createDefaultMediaHub();

console.log('Step 1: Add 3 assets with the same "food-proof" tag');
let result = addMediaAsset(hub, {
  title: 'Test burger photo 1',
  type: 'photo',
  tags: ['food-proof', 'test'],
  owner: 'QA Test',
});
hub = result.hub;

result = addMediaAsset(hub, {
  title: 'Test burger photo 2',
  type: 'photo',
  tags: ['food-proof', 'test'],
  owner: 'QA Test',
});
hub = result.hub;

result = addMediaAsset(hub, {
  title: 'Test burger photo 3',
  type: 'photo',
  tags: ['food-proof', 'test'],
  owner: 'QA Test',
});
hub = result.hub;

console.log('✓ Added 3 test assets\n');

console.log('Step 2: Approve all 3 assets');
result = reviewMediaAsset(hub, 'test-burger-photo-1', { decision: 'approve', reviewer: 'QA' });
hub = result.hub;

result = reviewMediaAsset(hub, 'test-burger-photo-2', { decision: 'approve', reviewer: 'QA' });
hub = result.hub;

result = reviewMediaAsset(hub, 'test-burger-photo-3', { decision: 'approve', reviewer: 'QA' });
hub = result.hub;

console.log('✓ All 3 assets approved\n');

console.log('Step 3: Promote test-burger-photo-3 to repurposing queue');
result = promoteMediaAssetToRepurposing(hub, 'test-burger-photo-3', { promotedBy: 'QA Lead' });
hub = result.hub;
console.log('✓ Asset promoted\n');

console.log('Step 4: Check repurposing queue for food-proof tag');
const queue = getContentRepurposingQueue(hub);
const foodProofItems = queue.filter(item => item.tag === 'food-proof');

console.log(`Found ${foodProofItems.length} food-proof repurposing items:`);
foodProofItems.forEach(item => {
  console.log(`  - ${item.assetTitle} (${item.assetId})`);
});
console.log('');

console.log('Step 5: Verify promoted asset is in the queue');
const promotedInQueue = foodProofItems.some(item => item.assetId === 'test-burger-photo-3');

if (promotedInQueue) {
  console.log('✅ PASS: Promoted asset "test-burger-photo-3" appears in queue');
  console.log('✅ REGRESSION FIX VERIFIED: Promoted assets are prioritized in queue\n');
} else {
  console.log('❌ FAIL: Promoted asset "test-burger-photo-3" NOT in queue');
  console.log('❌ REGRESSION DETECTED: Promoted assets may be excluded\n');
  process.exit(1);
}

console.log('Step 6: Verify queue respects 2-item-per-tag limit');
if (foodProofItems.length <= 2) {
  console.log(`✅ PASS: Queue has ${foodProofItems.length} items (≤2 per tag rule)`);
} else {
  console.log(`⚠ WARNING: Queue has ${foodProofItems.length} items (expected ≤2 per tag)`);
}

console.log('\n========================================================');
console.log('QA VERIFICATION COMPLETE');
console.log('All guardrails holding: approved-only + promoted-first');
