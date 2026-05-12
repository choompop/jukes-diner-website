import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Footer text links have AAA-compliant touch targets (py-4 inline-block)', async () => {
  const footerSource = await readFile(
    'app/components/Footer.tsx',
    'utf-8'
  );

  // Verify Quick Links have proper padding and display
  // Pattern: className comes before the link text in JSX
  assert.match(
    footerSource,
    /className="[^"]*py-4[^"]*inline-block[^"]*"[^>]*>Menu/,
    'Menu link should have py-4 and inline-block for 48px touch target'
  );

  assert.match(
    footerSource,
    /className="[^"]*py-4[^"]*inline-block[^"]*"[^>]*>Find Us/,
    'Find Us link should have py-4 and inline-block for 48px touch target'
  );

  assert.match(
    footerSource,
    /className="[^"]*py-4[^"]*inline-block[^"]*"[^>]*>Book Events/,
    'Book Events link should have py-4 and inline-block for 48px touch target'
  );

  assert.match(
    footerSource,
    /className="[^"]*min-h-11[^"]*items-center[^"]*py-4[^"]*"[^>]*>Jobs \/ Franchise/,
    'Jobs / Franchise link should have min-h-11, items-center, and py-4 for touch target'
  );

  // Verify bottom footer links have proper padding
  assert.match(
    footerSource,
    /className="[^"]*py-4[^"]*inline-block[^"]*"[^>]*>Privacy Policy/,
    'Privacy Policy link should have py-4 and inline-block for 48px touch target'
  );

  assert.match(
    footerSource,
    /className="[^"]*py-4[^"]*inline-block[^"]*"[^>]*>Terms of Service/,
    'Terms of Service link should have py-4 and inline-block for 48px touch target'
  );
});

test('Footer real social icon links have AAA-compliant touch targets (p-3)', async () => {
  const footerSource = await readFile(
    'app/components/Footer.tsx',
    'utf-8'
  );

  const socialIconMatches = footerSource.match(
    /<a href="https:\/\/www\.instagram\.com\/jukesdiner" [^>]*className="[^"]*p-3[^"]*"[^>]*>[\s\S]*?<Camera/g
  );

  assert.ok(
    socialIconMatches && socialIconMatches.length === 1,
    'The approved Instagram icon link should have p-3 for a 48x48px touch target'
  );
});

test('Footer links maintain hover states', async () => {
  const footerSource = await readFile(
    'app/components/Footer.tsx',
    'utf-8'
  );

  // Text links should have hover:text-white
  assert.match(
    footerSource,
    /className="[^"]*hover:text-white[^"]*"[^>]*>Menu/,
    'Text links should maintain hover:text-white'
  );

  // Social icons should have hover:text-diner-red
  assert.match(
    footerSource,
    /className="[^"]*hover:text-diner-red[^"]*"[^>]*>[\s\S]*?<Camera/,
    'Social icons should maintain hover:text-diner-red'
  );
});
