import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function readPage(pagePath) {
  return readFileSync(join(projectRoot, pagePath), 'utf-8');
}

function firstSection(content) {
  const match = content.match(/<section[\s\S]*?<\/section>/);
  assert.ok(match, 'page should have a first section');
  return match[0];
}

const requiredHeroCtas = [
  {
    route: '/menu',
    file: 'app/menu/page.js',
    href: '/order',
    label: /Order \/ Delivery Options/i,
  },
  {
    route: '/find-us',
    file: 'app/find-us/page.js',
    href: '/book',
    label: /Ask about a date|Book the Truck/i,
  },
  {
    route: '/apply',
    file: 'app/apply/page.js',
    href: /mailto:contact@jukesdiner\.com\?subject=Juke%27s%20Franchise%20Inquiry|mailto:contact@jukesdiner\.com\?subject=Juke%27s%20Job%20Application/,
    label: /Ask about franchise|Apply by email/i,
  },
  {
    route: '/merch',
    file: 'app/merch/page.js',
    href: 'https://www.instagram.com/jukesdiner',
    label: /Follow on Instagram/i,
  },
  {
    route: '/order',
    file: 'app/order/page.js',
    href: '#ordering-options',
    label: /See ordering options|Order \/ Delivery Options/i,
  },
  {
    route: '/book',
    file: 'app/book/page.js',
    href: '#booking-inquiry',
    label: /Start Booking Request|Start Booking Inquiry|Jump to form/i,
  },
];

test('mobile public route hero sections include compact first-screen conversion CTAs', () => {
  for (const requirement of requiredHeroCtas) {
    const hero = firstSection(readPage(requirement.file));
    const hrefPattern = requirement.href instanceof RegExp
      ? requirement.href
      : new RegExp(`href=[{]?['\"]${requirement.href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"]`);

    assert.match(hero, hrefPattern, `${requirement.route} hero should link to its conversion next step`);
    assert.match(hero, requirement.label, `${requirement.route} hero should label its above-the-fold CTA clearly`);
    assert.match(hero, /retro-button/, `${requirement.route} hero CTA should use the existing button treatment`);
    assert.match(hero, /mt-[2346]/, `${requirement.route} hero CTA should sit close enough to the heading/copy for mobile first viewport`);
  }
});
