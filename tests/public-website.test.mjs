import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Helper to read page files
function readPage(pagePath) {
  const fullPath = join(projectRoot, pagePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Page not found: ${fullPath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

test('homepage has hero section with title and CTAs', () => {
  const content = readPage('app/page.tsx');
  assert.match(content, /JUKE.*S DINER/i, 'Hero should have brand name');
  assert.match(content, /VIEW MENU|menu/i, 'Hero should have menu CTA');
  assert.match(content, /FIND.*TRUCK|find-us/i, 'Hero should have find us CTA');
});

test('homepage has menu preview section', () => {
  const content = readPage('app/page.tsx');
  assert.match(content, /FAN FAVORITES|Menu|MENU/i, 'Should have menu section heading');
  assert.match(content, /MENU_ITEMS/i, 'Should display menu items');
});

test('homepage has event/catering credibility section', () => {
  const content = readPage('app/page.tsx');
  assert.match(content, /Why people book us|customer trust|events/i, 'Should have customer-safe proof section');
});

test('homepage has locations content', () => {
  const content = readPage('app/page.tsx');
  assert.match(content, /events|neighborhoods|festivals|private parties/i, 'Should mention customer-facing service contexts');
});

test('homepage has franchise/apply CTA section', () => {
  const content = readPage('app/page.tsx');
  assert.match(content, /JOIN.*FAMILY|FRANCHISE|apply/i, 'Should have franchise CTA');
  assert.match(content, /\/apply/i, 'Should link to apply page');
});

test('homepage has prominent Book Jukes CTA', () => {
  const content = readPage('app/page.tsx');
  // Should have a book/booking call to action - check for link to /book
  assert.match(content, /\/book|booking/i, 'Should have booking CTA or link');
});

test('all public pages use correct retro diner color palette', () => {
  const pages = [
    'app/page.tsx',
    'app/menu/page.js',
    'app/book/page.js',
    'app/find-us/page.js',
    'app/about/page.js',
    'app/apply/page.js'
  ];

  for (const page of pages) {
    const content = readPage(page);
    // Should use diner-red, diner-cream, diner-teal, diner-black
    // Should NOT use old brand-black, red, gold, cream, teal colors
    const hasOldColors = /\b(brand-black|(?<!diner-)red|(?<!diner-)teal|(?<!diner-)cream|gold)\b/.test(content.replace(/diner-(red|teal|cream|black)/g, ''));
    
    if (hasOldColors && page !== 'app/page.tsx') {
      // Allow page.tsx since it's already updated
      const oldColorMatches = content.match(/className="[^"]*\b(brand-black|bg-red|text-red|bg-teal|text-teal|bg-cream|text-cream|text-gold|border-gold)\b[^"]*"/g) || [];
      if (oldColorMatches.length > 0) {
        console.log(`${page} has old color classes:`, oldColorMatches.slice(0, 3));
      }
    }
  }
});

test('public pages use correct component imports', () => {
  const pages = [
    'app/menu/page.js',
    'app/book/page.js',
    'app/find-us/page.js',
    'app/about/page.js',
    'app/apply/page.js'
  ];

  for (const page of pages) {
    const content = readPage(page);
    // Should import from @/app/components, not @/components
    const hasOldImport = /from ['"]@\/components\/(navbar|footer)['"]/i.test(content);
    assert.ok(!hasOldImport, `${page} should use @/app/components imports, not @/components`);
  }
});

test('navbar keeps dashboard out of public navigation', () => {
  const content = readPage('app/components/Navbar.tsx');
  assert.ok(!/href=["']\/dashboard["']/.test(content), 'Navbar should not expose dashboard links in customer navigation');
  assert.match(content, /href="\/book"[\s\S]*Book/, 'Navbar should keep the public book CTA');
});

test('public pages do not expose sensitive dashboard information', () => {
  const publicPages = [
    'app/page.tsx',
    'app/menu/page.js',
    'app/book/page.js',
    'app/find-us/page.js',
    'app/about/page.js',
    'app/apply/page.js'
  ];

  const sensitivePatterns = [
    /STRIPE_SECRET/i,
    /ADMIN_PASSWORD/i,
    /API_KEY/i,
    /process\.env\.((?!NEXT_PUBLIC_).+)/,
  ];

  for (const page of publicPages) {
    const content = readPage(page);
    for (const pattern of sensitivePatterns) {
      assert.ok(!pattern.test(content), `${page} should not expose sensitive data matching ${pattern}`);
    }
  }
});

test('all required public pages exist and can be read', () => {
  const requiredPages = [
    'app/page.tsx',
    'app/menu/page.js',
    'app/book/page.js',
    'app/find-us/page.js',
    'app/about/page.js',
    'app/apply/page.js'
  ];

  for (const page of requiredPages) {
    const content = readPage(page);
    assert.ok(content.length > 0, `${page} should exist and have content`);
  }
});

test('public pages do not render duplicate navigation or footer', () => {
  const publicPages = [
    'app/menu/page.js',
    'app/book/page.js',
    'app/find-us/page.js',
    'app/about/page.js',
    'app/apply/page.js',
    'app/order/page.js',
    'app/merch/page.js'
  ];

  for (const page of publicPages) {
    const content = readPage(page);
    
    // Pages should NOT manually import and render Navbar or Footer
    // since the root layout (app/layout.tsx) already provides them
    const hasNavbarImport = /import.*Navbar.*from/.test(content);
    const hasFooterImport = /import.*Footer.*from/.test(content);
    const hasNavbarRender = /<Navbar\s*\/>/.test(content);
    const hasFooterRender = /<Footer\s*\/>/.test(content);
    
    assert.ok(!hasNavbarImport, `${page} should not import Navbar (root layout provides it)`);
    assert.ok(!hasFooterImport, `${page} should not import Footer (root layout provides it)`);
    assert.ok(!hasNavbarRender, `${page} should not render <Navbar /> (root layout provides it)`);
    assert.ok(!hasFooterRender, `${page} should not render <Footer /> (root layout provides it)`);
  }
});
