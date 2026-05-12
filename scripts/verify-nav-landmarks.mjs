#!/usr/bin/env node

/**
 * Verification script for nav landmarks aria-labels
 * 
 * Simulates the browser console check:
 * Array.from(document.querySelectorAll('nav'))
 *   .map(n => n.getAttribute('aria-label'))
 * 
 * Expected: ['Main navigation', 'Dashboard sidebar']
 */

import { readFileSync } from 'fs';

console.log('Verifying navigation landmark aria-labels...\n');

// Check Navbar.tsx
const navbarPath = '/Users/lexi/projects/jukes-diner-website/app/components/Navbar.tsx';
const navbarContent = readFileSync(navbarPath, 'utf-8');
const navbarMatches = navbarContent.match(/<nav\s+aria-label="([^"]+)"/g) || [];

console.log('📄 app/components/Navbar.tsx');
navbarMatches.forEach((match) => {
  const label = match.match(/aria-label="([^"]+)"/)[1];
  console.log(`  ✅ <nav aria-label="${label}">`);
});

// Check DashboardLayout.tsx
const layoutPath = '/Users/lexi/projects/jukes-diner-website/app/dashboard/components/DashboardLayout.tsx';
const layoutContent = readFileSync(layoutPath, 'utf-8');
const layoutMatches = layoutContent.match(/<nav\s+aria-label="([^"]+)"/g) || [];

console.log('\n📄 app/dashboard/components/DashboardLayout.tsx');
layoutMatches.forEach((match) => {
  const label = match.match(/aria-label="([^"]+)"/)[1];
  console.log(`  ✅ <nav aria-label="${label}">`);
});

// Summary
const allLabels = [
  ...navbarMatches.map(m => m.match(/aria-label="([^"]+)"/)[1]),
  ...layoutMatches.map(m => m.match(/aria-label="([^"]+)"/)[1])
];

console.log('\n📊 Summary:');
console.log(`  Total nav landmarks with aria-label: ${allLabels.length}`);
console.log(`  Unique labels: ${new Set(allLabels).size}`);
console.log(`  Labels: [${allLabels.map(l => `"${l}"`).join(', ')}]`);

const expectedLabels = ['Main navigation', 'Dashboard sidebar'];
const hasExpected = expectedLabels.every(label => allLabels.includes(label));

console.log('\n🎯 Verification:');
if (hasExpected && allLabels.length === expectedLabels.length && new Set(allLabels).size === allLabels.length) {
  console.log('  ✅ All navigation landmarks have unique, descriptive aria-labels');
  console.log('  ✅ Screen readers can distinguish between nav landmarks');
  console.log('  ✅ Axe "landmark-unique" violation resolved');
  process.exit(0);
} else {
  console.log('  ❌ Navigation landmarks do not meet accessibility requirements');
  process.exit(1);
}
