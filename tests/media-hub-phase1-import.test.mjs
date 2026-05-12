import test from 'node:test';
import assert from 'node:assert/strict';
import { readMediaHub, getMediaHubStats } from '../lib/media-hub.mjs';

test('Phase 1 asset import populated media hub with 12 approved assets from public/images', async () => {
  const hub = await readMediaHub();
  const stats = getMediaHubStats(hub);

  // Verify all 12 assets were imported
  assert.equal(hub.assets.length, 12, 'Should have 12 assets from public/images');
  assert.equal(stats.totalAssets, 12);
  
  // All assets should be approved (they're already in production)
  assert.equal(stats.approvedAssets, 12, 'All imported assets should be approved');
  assert.equal(stats.needsApproval, 0, 'No assets should need approval');
  assert.equal(stats.needsTags, 0, 'No assets should need tags');
  
  // Verify asset types match expected distribution
  const logoCount = hub.assets.filter(a => a.type === 'logo').length;
  const photoCount = hub.assets.filter(a => a.type === 'photo').length;
  const imageCount = hub.assets.filter(a => a.type === 'image').length;
  
  assert.equal(logoCount, 7, 'Should have 7 logo assets');
  assert.equal(photoCount, 4, 'Should have 4 photo assets');
  assert.equal(imageCount, 1, 'Should have 1 image asset');
});

test('imported assets preserve original public/images paths without file moves', async () => {
  const hub = await readMediaHub();
  
  // All assets should reference public/images
  const allInPublicImages = hub.assets.every(asset => 
    asset.storagePath.startsWith('public/images/')
  );
  
  assert.ok(allInPublicImages, 'All assets should reference public/images paths');
  
  // Verify specific critical assets exist
  const criticalAssets = [
    'jukes-diner-logo-primary',
    'food-photo-jpg',
    'truck-png'
  ];
  
  criticalAssets.forEach(assetId => {
    const asset = hub.assets.find(a => a.id === assetId);
    assert.ok(asset, `Critical asset ${assetId} should exist`);
    assert.equal(asset.status, 'approved');
  });
});

test('content pillar tagging enables food-proof catering-conversion and build-in-public content', async () => {
  const hub = await readMediaHub();
  
  const foodProofAssets = hub.assets.filter(a => a.tags.includes('food-proof'));
  const cateringAssets = hub.assets.filter(a => a.tags.includes('catering-conversion'));
  const buildInPublicAssets = hub.assets.filter(a => a.tags.includes('build-in-public'));
  
  assert.equal(foodProofAssets.length, 2, 'Should have 2 food-proof assets');
  assert.equal(cateringAssets.length, 2, 'Should have 2 catering-conversion assets');
  assert.equal(buildInPublicAssets.length, 2, 'Should have 2 build-in-public assets');
  
  // Verify food assets are photos
  assert.ok(foodProofAssets.every(a => a.type === 'photo'), 'Food-proof assets should be photos');
  
  // Verify truck assets have both catering and build-in-public tags
  const truckAssets = hub.assets.filter(a => a.tags.includes('truck'));
  assert.ok(truckAssets.every(a => 
    a.tags.includes('catering-conversion') && a.tags.includes('build-in-public')
  ), 'Truck assets should be tagged for both catering and build-in-public');
});

test('brand board metadata includes diner palette typography and voice rules', async () => {
  const hub = await readMediaHub();
  const { brandBoard } = hub;
  
  // Verify palette includes retro diner colors
  const paletteTokens = brandBoard.palette.map(c => c.token);
  assert.deepEqual(
    paletteTokens,
    ['diner-red', 'diner-cream', 'diner-teal', 'diner-black'],
    'Palette should include diner color tokens'
  );
  
  // Verify typography updated to Bebas Neue + Inter (not Bungee + Playfair)
  const fonts = brandBoard.typography.map(t => t.name);
  assert.ok(fonts.includes('Bebas Neue'), 'Should use Bebas Neue for display');
  assert.ok(fonts.includes('Inter'), 'Should use Inter for sans-serif');
  assert.ok(!fonts.includes('Bungee'), 'Should not use old Bungee font');
  assert.ok(!fonts.includes('Playfair Display'), 'Should not use old Playfair font');
  
  // Verify voice rules exist
  assert.ok(brandBoard.voiceRules.length >= 4, 'Should have voice rules');
  assert.ok(
    brandBoard.voiceRules.some(r => /retro/i.test(r)),
    'Voice rules should mention retro diner energy'
  );
});

test('storage root paths are structured for future public-site use', async () => {
  const hub = await readMediaHub();
  const { storage } = hub;
  
  assert.equal(storage.provider, 'local-now-cloud-later');
  assert.equal(storage.rootPath, 'media/jukes-diner');
  
  // Verify all expected storage roots exist
  const rootIds = storage.roots.map(r => r.id);
  assert.deepEqual(
    rootIds,
    ['raw-capture', 'approved-assets', 'brand-board', 'operator-uploads'],
    'Should have all expected storage roots'
  );
  
  // Verify each root has proper metadata
  storage.roots.forEach(root => {
    assert.ok(root.path, `Root ${root.id} should have path`);
    assert.ok(root.owner, `Root ${root.id} should have owner`);
    assert.ok(root.rule, `Root ${root.id} should have usage rule`);
  });
});

test('capture requests guide operators on what media to collect next', async () => {
  const hub = await readMediaHub();
  
  assert.ok(hub.captureRequests.length >= 4, 'Should have capture requests');
  
  // Verify urgent catering capture request exists
  const urgentCapture = hub.captureRequests.find(r => r.priority === 'urgent');
  assert.ok(urgentCapture, 'Should have urgent priority capture request');
  assert.ok(
    /catering/i.test(urgentCapture.request),
    'Urgent request should be about catering'
  );
  
  // Verify all requests have required fields
  hub.captureRequests.forEach(req => {
    assert.ok(req.id, 'Capture request should have id');
    assert.ok(req.priority, 'Capture request should have priority');
    assert.ok(req.request, 'Capture request should have request text');
    assert.ok(req.owner, 'Capture request should have owner');
    assert.ok(req.channelUse, 'Capture request should have channel use');
  });
});

test('media hub JSON file exists and is valid', async () => {
  const hub = await readMediaHub();
  
  // Basic structure validation
  assert.equal(hub.version, 1);
  assert.equal(hub.title, "Juke's Diner Media + Brand Hub");
  assert.ok(hub.updatedAt);
  assert.ok(Array.isArray(hub.assets));
  assert.ok(Array.isArray(hub.captureRequests));
  assert.ok(Array.isArray(hub.repurposingRules));
  assert.ok(hub.storage);
  assert.ok(hub.brandBoard);
});
