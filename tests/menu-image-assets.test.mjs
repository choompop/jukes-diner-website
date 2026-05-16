import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';

import { MENU_ITEMS } from '../lib/constants.js';

const affectedBrokenImageItems = new Set([
  'Texas BLT',
  'Chicken Salad Sandwich',
  'Buffalo Chicken Wrap',
  '615 Chicken Fries',
  'Funnel Cake Fries',
  'Hot Honey Chicken Biscuit',
  'Side Sausage',
]);

function publicAssetPath(src) {
  assert.match(src, /^\/images\//, `${src} must be a local approved public image asset`);
  return new URL(`../public${src}`, import.meta.url);
}

test('menu items use approved local website image assets instead of remote placeholders', async () => {
  for (const item of MENU_ITEMS) {
    assert.ok(item.image, `${item.name} needs an image`);
    assert.doesNotMatch(item.image, /^https?:\/\//, `${item.name} must not use remote image URL ${item.image}`);
    assert.doesNotMatch(item.image, /unsplash/i, `${item.name} must not use unapproved Unsplash placeholder`);
    await access(publicAssetPath(item.image), fsConstants.R_OK);
  }
});

test('previously broken audited menu items no longer point at remote placeholders', () => {
  const byName = new Map(MENU_ITEMS.map((item) => [item.name, item]));

  for (const name of affectedBrokenImageItems) {
    const item = byName.get(name);
    assert.ok(item, `${name} should still exist in the menu`);
    assert.match(item.image, /^\/images\//, `${name} should use a curated local image asset`);
    assert.doesNotMatch(item.image, /^https?:\/\//, `${name} should not use a remote URL`);
  }
});

test('Texas BLT uses the approved BLT-on-Texas-toast image instead of burger media', () => {
  const texasBlt = MENU_ITEMS.find((item) => item.name === 'Texas BLT');

  assert.ok(texasBlt, 'Texas BLT should still exist in the menu');
  assert.equal(
    texasBlt.image,
    '/images/drive/sandwich-closeup.jpg',
    'Texas BLT should use brand-safe BLT/Texas-toast media, not burger-style media',
  );
});

test('homepage and menu preserve menu image alt text and fixed card aspect ratios', async () => {
  const [homePage, menuPage] = await Promise.all([
    readFile(new URL('../app/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/menu/page.js', import.meta.url), 'utf8'),
  ]);

  assert.match(homePage, /<img\s+src=\{item\.image\}\s+alt=\{item\.name\}[^>]*className="h-48 w-full object-cover"/s);
  assert.match(menuPage, /<img\s+src=\{item\.image\}\s+alt=\{item\.name\}[^>]*className="h-44 w-full object-cover"/s);
});
