/**
 * Footer Social Media Links Accessibility Test
 *
 * Verifies footer social actions are either real, accessible links or plain
 * non-focusable copy. Placeholder href="#" icon links are not acceptable on
 * public customer routes.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'fs';

const footerPath = 'app/components/Footer.tsx';
const socialSectionPattern = /<div className="mt-6 flex flex-wrap items-center gap-3"[^>]*>([\s\S]*?)<\/div>/;

function readFooter() {
  return readFileSync(footerPath, 'utf-8');
}

function readSocialSection() {
  const content = readFooter();
  const socialLinksMatch = content.match(socialSectionPattern);
  assert.ok(socialLinksMatch, 'Social actions container should exist');
  return socialLinksMatch[1];
}

test('Footer has no href="#" placeholder social actions', () => {
  const content = readFooter();

  assert.doesNotMatch(
    content,
    /<a\s+[^>]*href="#"[^>]*>[\s\S]*?<(?:Camera|MessageCircle|Globe)/,
    'Footer must not render fake focusable social icon links with href="#"'
  );
});

test('Footer renders approved Instagram social URL as the only social icon link', () => {
  const socialLinksSection = readSocialSection();
  const linkMatches = socialLinksSection.match(/<a\s+[^>]*>/g) ?? [];

  assert.strictEqual(linkMatches.length, 1, 'Only approved social URLs should render as icon links');
  assert.match(linkMatches[0], /href="https:\/\/www\.instagram\.com\/jukesdiner"/);
  assert.match(linkMatches[0], /aria-label="Follow Juke's Diner on Instagram"/);
});

test('Unavailable social channels are non-focusable copy, not aria-labeled fake links', () => {
  const socialLinksSection = readSocialSection();

  assert.doesNotMatch(socialLinksSection, /Follow us on Twitter/);
  assert.doesNotMatch(socialLinksSection, /Visit our website/);
  assert.doesNotMatch(socialLinksSection, /aria-label="Follow us on Twitter"/);
  assert.doesNotMatch(socialLinksSection, /aria-label="Visit our website"/);
  assert.match(socialLinksSection, /Updates drop on Instagram/);
});

test('Footer imports only icons used by social actions', () => {
  const content = readFooter();

  assert.match(
    content,
    /import \{[^}]*Camera[^}]*\} from 'lucide-react'/,
    'Footer renders <Camera> and must import it from lucide-react so public pages do not crash'
  );
  assert.doesNotMatch(content, /<MessageCircle\b/);
  assert.doesNotMatch(content, /<Globe\b/);
});
