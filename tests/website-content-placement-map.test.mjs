import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const requiredSlotIds = [
  'hero',
  'menu-highlights',
  'catering-private-events',
  'truck',
  'staff-story',
  'dining-room-social-proof',
  'instagram-tiktok-embeds-gallery',
  'press-reviews',
  'seasonal-campaigns',
];

async function readPlacementMap() {
  const raw = await readFile(new URL('../data/website-content-placement-map.json', import.meta.url), 'utf8');
  return JSON.parse(raw);
}

test('website placement map includes all required curated slots', async () => {
  const map = await readPlacementMap();
  const slotIds = map.slots.map((slot) => slot.id);

  assert.deepEqual(slotIds, requiredSlotIds);
  assert.equal(map.title, "Juke's Diner Website Content Placement Map");
  assert.match(map.purpose, /curate/i);
  assert.match(map.purpose, /without dumping/i);
});

test('each website placement slot has asset type tags approval fallback and cadence', async () => {
  const map = await readPlacementMap();

  for (const slot of map.slots) {
    assert.ok(slot.idealAssetType, `${slot.id} needs idealAssetType`);
    assert.ok(Array.isArray(slot.tagsRequired) && slot.tagsRequired.length >= 5, `${slot.id} needs required tags`);
    assert.ok(slot.tagsRequired.includes('approved'), `${slot.id} must require approved tag`);
    assert.ok(slot.tagsRequired.includes('website-approved'), `${slot.id} must require website-approved tag`);
    assert.ok(slot.tagsRequired.includes('brand-safe'), `${slot.id} must require brand-safe tag`);
    assert.ok(Array.isArray(slot.approvalCriteria) && slot.approvalCriteria.length >= 3, `${slot.id} needs approval criteria`);
    assert.ok(slot.fallbackCopy, `${slot.id} needs fallback copy`);
    assert.ok(slot.updateCadence, `${slot.id} needs update cadence`);
    assert.ok(slot.doNotUse, `${slot.id} needs guardrail`);
  }
});

test('website placement map prioritizes bookings catering and brand trust over public dumping', async () => {
  const map = await readPlacementMap();
  const rules = map.globalRules.join(' ');
  const bookingSlots = map.slots.filter((slot) =>
    slot.tagsRequired.includes('booking-cta') || slot.tagsRequired.includes('catering-conversion') || slot.tagsRequired.includes('social-proof'),
  );

  assert.ok(bookingSlots.length >= 4, 'Should emphasize booking, catering, and social-proof slots');
  assert.match(rules, /Only use assets with status=approved/i);
  assert.match(rules, /Do not publish private docs/i);
  assert.match(rules, /small number of high-converting visuals/i);
  assert.match(map.globalRules.join(' '), /Drive|publicly|website/i);
});
