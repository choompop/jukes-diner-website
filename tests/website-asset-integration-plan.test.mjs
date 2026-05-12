import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const planUrl = new URL('../docs/plans/2026-05-11-approved-media-website-integration.md', import.meta.url);

async function readPlan() {
  return readFile(planUrl, 'utf8');
}

test('approved website media integration plan documents required implementation gates', async () => {
  const plan = await readPlan();

  assert.match(plan, /Gallery and data structure/i);
  assert.match(plan, /optimization strategy/i);
  assert.match(plan, /alt text/i);
  assert.match(plan, /consent checks/i);
  assert.match(plan, /content-board links/i);
  assert.match(plan, /Do not publish/i);
  assert.match(plan, /John approval/i);
});

test('approved website media integration plan ties every public slot to approval metadata', async () => {
  const [plan, placementRaw] = await Promise.all([
    readPlan(),
    readFile(new URL('../data/website-content-placement-map.json', import.meta.url), 'utf8'),
  ]);
  const placementMap = JSON.parse(placementRaw);

  for (const slot of placementMap.slots) {
    assert.ok(plan.includes(`| \`${slot.id}\` |`), `${slot.id} needs an implementation row`);
  }

  for (const requiredField of [
    'assetId',
    'slotId',
    'status',
    'websiteApprovedAt',
    'approvedBy',
    'consentStatus',
    'altText',
    'optimizedSrc',
    'kanbanTaskId',
    'contentCardId',
  ]) {
    assert.match(plan, new RegExp(`\\b${requiredField}\\b`), `${requiredField} must be in the planned schema`);
  }
});

test('approved website media integration plan protects Drive/private media from public dumping', async () => {
  const plan = await readPlan();

  assert.match(plan, /only assets marked approved/i);
  assert.match(plan, /website-approved/i);
  assert.match(plan, /public-safe/i);
  assert.match(plan, /mock placeholder/i);
  assert.match(plan, /Never auto-sync/i);
  assert.match(plan, /private docs/i);
  assert.match(plan, /license plates/i);
  assert.match(plan, /minors/i);
  assert.match(plan, /faces/i);
});
