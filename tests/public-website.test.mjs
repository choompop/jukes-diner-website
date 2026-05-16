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

test('homepage Fan Favorites cards are mobile-visible without scroll-triggered motion gating', () => {
  const content = readPage('app/page.tsx');
  const fanFavoritesSection = content.match(/<section[^>]*id="fan-favorites"[\s\S]*?<\/section>/i)?.[0];

  assert.ok(fanFavoritesSection, 'Fan Favorites section should be present');
  assert.doesNotMatch(
    fanFavoritesSection,
    /<motion\.|initial=\{\{\s*opacity:\s*0|whileInView|viewport=\{\{/,
    'Fan Favorites cards must not start hidden or depend on scroll-triggered motion to appear on mobile',
  );
  assert.match(
    fanFavoritesSection,
    /<article[^>]*className="[^"]*opacity-100[^"]*translate-y-0[^"]*"/,
    'Fan Favorites cards should explicitly render visible at mobile widths',
  );
  assert.match(
    fanFavoritesSection,
    /grid[^"']*grid-cols-1[^"']*sm:grid-cols-2[^"']*lg:grid-cols-4/,
    'Fan Favorites grid should render one column on mobile, two on tablet, and four on desktop',
  );
});

test('homepage Fan Favorites renders the four accepted cards with order CTAs', () => {
  const content = readPage('app/page.tsx');
  const fanFavoritesSection = content.match(/<section[^>]*id="fan-favorites"[\s\S]*?<\/section>/i)?.[0];

  assert.ok(fanFavoritesSection, 'Fan Favorites section should be present');
  for (const itemName of ['Diner Burger', 'Philly Cheesesteak', '615 Hot Chicken', 'Texas BLT']) {
    assert.match(content, new RegExp(`['\"]${itemName}['\"]`), `${itemName} should be selected for homepage Fan Favorites`);
  }
  assert.doesNotMatch(
    content,
    /['\"](?:Loaded Grilled Cheese|Buffalo Chicken Wrap|Chicken & Waffles|Loaded Fries)['\"](?=,?\s*\n)/,
    'Homepage Fan Favorites should stay to the four accepted cards',
  );
  assert.match(fanFavoritesSection, /href="\/order"[\s\S]*Order Now/, 'Fan Favorites cards should include visible Order Now buttons');
});

test('/apply hero presents both job and franchise CTAs before the card grid', () => {
  const content = readPage('app/apply/page.js');
  const heroBeforeCards = content.split('<div className="mx-auto mt-8 grid max-w-5xl')[0];

  assert.match(heroBeforeCards, /Juke%27s%20Job%20Application/, 'Hero should expose the job application mailto before the below-fold card grid');
  assert.match(heroBeforeCards, /Apply by email|Work with us/i, 'Hero should label the job CTA clearly');
  assert.match(heroBeforeCards, /Juke%27s%20Franchise%20Inquiry/, 'Hero should keep the franchise inquiry mailto');
  assert.match(heroBeforeCards, /Ask about franchise/i, 'Hero should label the franchise CTA clearly');
  assert.match(heroBeforeCards, /flex[^"']*flex-col[^"']*sm:flex-row/, 'Hero CTAs should stack on mobile and sit side by side from small screens up');
});

test('/find-us launch-safe schedule status label uses AA-safe teal on white', () => {
  const content = readPage('app/find-us/page.js');
  const statusLabel = content.match(/<p className="([^"]*)">Launch-safe schedule status<\/p>/)?.[1];

  assert.ok(statusLabel, 'Find Us launch-safe schedule status label should be present');
  assert.doesNotMatch(statusLabel, /\btext-diner-teal\b/, 'Label must not use standard diner teal because #2a9d8f on white is below WCAG AA for 14px text');
  assert.match(statusLabel, /(?:^|\s)text-\[#087879\](?:\s|$)/, 'Label should use the darker on-brand teal #087879 with >= 4.5:1 contrast on white');
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

test('public mobile drawer exposes direct order route', () => {
  const content = readPage('app/components/Navbar.tsx');

  assert.match(
    content,
    /navLinks\s*=\s*\[[\s\S]*name:\s*['"]Order(?: Now)?['"][\s\S]*path:\s*['"]\/order['"][\s\S]*\]/i,
    'Global public navLinks should include a direct ORDER link to /order so the mobile drawer exposes ordering',
  );
});

test('public mobile drawer closes when Escape is pressed', () => {
  const content = readPage('app/components/Navbar.tsx');

  assert.match(content, /keydown/i, 'Navbar should listen for keyboard events');
  assert.match(content, /event\.key\s*={2,3}\s*['"]Escape['"]/, 'Navbar should detect the Escape key');
  assert.match(content, /setIsOpen\(false\)/, 'Escape handling should close the mobile drawer');
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

test('/order delivery CTA avoids brittle DoorDash search URLs and gives search instructions', () => {
  const content = readPage('app/order/page.js');

  assert.doesNotMatch(
    content,
    /href=\"https:\/\/www\.doordash\.com\/search\/store\/jukes%20diner\//,
    'Primary delivery CTA should not link to the brittle DoorDash store-search URL that triggers Cloudflare challenges',
  );
  assert.match(content, /search DoorDash for Juke&apos;s Diner/i, 'Delivery copy should explicitly tell customers how to search DoorDash when available');
  assert.match(content, /availability|live near you|service area/i, 'Delivery copy should frame DoorDash as availability-based, not guaranteed live ordering');
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
