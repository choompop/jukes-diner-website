#!/usr/bin/env node
/**
 * QA verification: Approved-only guardrail
 * Tests that ONLY approved assets can be promoted (needs-approval should be rejected)
 */

import {
  createDefaultMediaHub,
  addMediaAsset,
  promoteMediaAssetToRepurposing,
} from './lib/media-hub.mjs';

console.log('QA Verification: Approved-Only Promotion Guardrail');
console.log('==================================================\n');

let hub = createDefaultMediaHub();

console.log('Step 1: Add asset with "needs-approval" status');
let result = addMediaAsset(hub, {
  title: 'Unapproved test asset',
  type: 'photo',
  tags: ['food-proof', 'test'],
  owner: 'QA Test',
});
hub = result.hub;
const assetId = result.asset.id;
console.log(`✓ Created asset: ${assetId} with status: ${result.asset.status}\n`);

console.log('Step 2: Attempt to promote unapproved asset');
try {
  promoteMediaAssetToRepurposing(hub, assetId, { promotedBy: 'QA' });
  console.log('❌ FAIL: Promotion succeeded when it should have been rejected');
  console.log('❌ GUARDRAIL BROKEN: Non-approved assets can be promoted\n');
  process.exit(1);
} catch (error) {
  if (error.message.toLowerCase().includes('approved')) {
    console.log(`✅ PASS: Promotion correctly rejected with error: "${error.message}"`);
    console.log('✅ GUARDRAIL HOLDING: Only approved assets can be promoted\n');
  } else {
    console.log(`⚠ UNEXPECTED ERROR: ${error.message}\n`);
    process.exit(1);
  }
}

console.log('==================================================');
console.log('APPROVED-ONLY GUARDRAIL VERIFIED');
