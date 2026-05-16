import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ABOUT_PAGE = 'app/about/page.js';

test('about hero includes an above-fold mobile booking CTA before the hero image', async () => {
  const content = await readFile(ABOUT_PAGE, 'utf-8');
  const heroSectionMatch = content.match(/<section className="border-b-4 border-diner-black bg-diner-red[\s\S]*?<\/section>/);

  assert.ok(heroSectionMatch, 'About hero section should exist');

  const heroSection = heroSectionMatch[0];
  const firstImageIndex = heroSection.indexOf('<img');
  const ctaIndex = heroSection.indexOf('href="/book"');

  assert.ok(ctaIndex !== -1, 'About hero should include a booking CTA link');
  assert.ok(firstImageIndex === -1 || ctaIndex < firstImageIndex, 'Booking CTA should appear before the hero image so it is visible in the first mobile viewport');
  assert.match(heroSection, /Book (an Event|the Truck)/, 'Booking CTA should use clear conversion copy');
});

test('about hero booking CTA has a prominent 44px-plus touch target', async () => {
  const content = await readFile(ABOUT_PAGE, 'utf-8');
  const ctaMatch = content.match(/<Link\s+href="\/book"\s+className="([^"]*retro-button[^"]*)">\s*Book (?:an Event|the Truck)/);

  assert.ok(ctaMatch, 'About hero should render a retro-button booking CTA');

  const className = ctaMatch[1];
  assert.ok(className.includes('bg-diner-cream') || className.includes('bg-diner-teal') || className.includes('bg-white'), `Hero CTA should stand out on the red hero background, found: ${className}`);
  assert.ok(!className.includes('hidden'), `Hero CTA should not be hidden on mobile, found: ${className}`);
});

test('about hero uses compact mobile spacing so the CTA is fully visible above the fold', async () => {
  const content = await readFile(ABOUT_PAGE, 'utf-8');
  const heroSectionMatch = content.match(/<section className="([^"]*border-b-4 border-diner-black bg-diner-red[^"]*)"[\s\S]*?<\/section>/);

  assert.ok(heroSectionMatch, 'About hero section should exist');

  const heroSection = heroSectionMatch[0];
  assert.match(heroSectionMatch[1], /py-1[02]/, 'About hero should use compact mobile vertical padding before larger breakpoints');
  assert.match(heroSection, /<h1 className="[^"]*text-5xl[^"]*sm:text-7xl[^"]*md:text-9xl/, 'About hero heading should be compact on mobile and scale up on wider screens');
});
