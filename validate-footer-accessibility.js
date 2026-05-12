#!/usr/bin/env node
/**
 * Quick validation script for footer touch targets
 */
const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, 'app/components/Footer.tsx');
const content = fs.readFileSync(footerPath, 'utf-8');

console.log('=== Footer Touch Target Validation ===\n');

// Check text links
const textLinks = ['Menu', 'Find Us', 'Book Events', 'Franchise', 'Privacy Policy', 'Terms of Service'];
let textLinksPass = true;

textLinks.forEach(linkText => {
  const pattern = new RegExp(`className="[^"]*py-4[^"]*inline-block[^"]*"[^>]*>${linkText}`);
  const match = pattern.test(content);
  console.log(`${match ? '✓' : '✗'} ${linkText}: ${match ? 'py-4 inline-block found' : 'MISSING py-4 inline-block'}`);
  if (!match) textLinksPass = false;
});

console.log();

// Check social icons
const socialIcons = ['Camera', 'MessageCircle', 'Globe'];
let socialIconsPass = true;
const socialMatches = content.match(/<a href="#" [^>]*className="[^"]*p-3[^"]*"[^>]*>[\s\S]*?<(?:Camera|MessageCircle|Globe)/g);

console.log(`Social icons with p-3: ${socialMatches ? socialMatches.length : 0}/3`);
socialIcons.forEach(icon => {
  const pattern = new RegExp(`<a[^>]*p-3[^>]*>[\\s\\S]*?<${icon}`);
  const match = pattern.test(content);
  console.log(`${match ? '✓' : '✗'} ${icon}: ${match ? 'p-3 found' : 'MISSING p-3'}`);
  if (!match) socialIconsPass = false;
});

console.log();
console.log('=== Summary ===');
console.log(`Text links (py-4 inline-block): ${textLinksPass ? 'PASS ✓' : 'FAIL ✗'}`);
console.log(`Social icons (p-3): ${socialIconsPass ? 'PASS ✓' : 'FAIL ✗'}`);
console.log();

process.exit(textLinksPass && socialIconsPass ? 0 : 1);
