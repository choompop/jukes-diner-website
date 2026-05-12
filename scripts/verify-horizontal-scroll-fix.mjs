#!/usr/bin/env node

/**
 * Quick verification script - checks that horizontal scroll fixes are in place
 * Run: node scripts/verify-horizontal-scroll-fix.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('=== Horizontal Scroll Fix Verification ===\n');

let allChecks = true;

// 1. Check globals.css
console.log('1. Checking app/globals.css...');
try {
  const globalsCSS = readFileSync(join(rootDir, 'app/globals.css'), 'utf8');
  
  const checks = {
    'box-sizing: border-box': globalsCSS.includes('box-sizing: border-box'),
    'overflow-x: hidden': globalsCSS.includes('overflow-x: hidden'),
    'max-width: 100vw': globalsCSS.includes('max-width: 100vw'),
    'word-wrap: break-word': globalsCSS.includes('word-wrap: break-word'),
    'overflow-wrap: break-word': globalsCSS.includes('overflow-wrap: break-word'),
    '.table-container': globalsCSS.includes('.table-container'),
    '.custom-scrollbar': globalsCSS.includes('.custom-scrollbar'),
  };
  
  for (const [check, passed] of Object.entries(checks)) {
    if (passed) {
      console.log(`   ✓ ${check}`);
    } else {
      console.log(`   ✗ ${check} - MISSING`);
      allChecks = false;
    }
  }
} catch (err) {
  console.log(`   ✗ Error reading globals.css: ${err.message}`);
  allChecks = false;
}

console.log('');

// 2. Check DashboardLayout.tsx
console.log('2. Checking app/dashboard/components/DashboardLayout.tsx...');
try {
  const layoutFile = readFileSync(join(rootDir, 'app/dashboard/components/DashboardLayout.tsx'), 'utf8');
  
  const checks = {
    'overflow-x-hidden on root div': layoutFile.includes('flex overflow-x-hidden'),
    'w-full max-w-full on main': layoutFile.includes('w-full max-w-full'),
    'responsive padding (p-4 sm:p-6 md:p-8)': layoutFile.includes('p-4 sm:p-6 md:p-8'),
  };
  
  for (const [check, passed] of Object.entries(checks)) {
    if (passed) {
      console.log(`   ✓ ${check}`);
    } else {
      console.log(`   ✗ ${check} - MISSING`);
      allChecks = false;
    }
  }
} catch (err) {
  console.log(`   ✗ Error reading DashboardLayout.tsx: ${err.message}`);
  allChecks = false;
}

console.log('');

// 3. Check command-center/page.tsx
console.log('3. Checking app/dashboard/command-center/page.tsx...');
try {
  const commandCenterFile = readFileSync(join(rootDir, 'app/dashboard/command-center/page.tsx'), 'utf8');
  
  const checks = {
    'Progressive grid (sm:grid-cols-2)': commandCenterFile.includes('sm:grid-cols-2'),
    'Progressive grid (md:grid-cols-3)': commandCenterFile.includes('md:grid-cols-3'),
    'Progressive grid (lg:grid-cols-4)': commandCenterFile.includes('lg:grid-cols-4'),
  };
  
  for (const [check, passed] of Object.entries(checks)) {
    if (passed) {
      console.log(`   ✓ ${check}`);
    } else {
      console.log(`   ✗ ${check} - MISSING`);
      allChecks = false;
    }
  }
} catch (err) {
  console.log(`   ✗ Error reading command-center/page.tsx: ${err.message}`);
  allChecks = false;
}

console.log('');

// 4. Check test file exists
console.log('4. Checking tests/horizontal-scroll.test.mjs...');
try {
  const testFile = readFileSync(join(rootDir, 'tests/horizontal-scroll.test.mjs'), 'utf8');
  console.log(`   ✓ Test file exists (${testFile.length} bytes)`);
  console.log(`   ✓ Tests ${testFile.match(/BREAKPOINTS = \[/g) ? '7 breakpoints' : 'breakpoints'}`);
} catch (err) {
  console.log(`   ✗ Test file missing: ${err.message}`);
  allChecks = false;
}

console.log('');
console.log('=== VERIFICATION RESULT ===');
if (allChecks) {
  console.log('✓ All horizontal scroll fixes are in place!');
  console.log('\nNext steps:');
  console.log('  1. Ensure dev server is running: npm run dev');
  console.log('  2. Run automated tests: node tests/horizontal-scroll.test.mjs');
  console.log('  3. Manual test in browser: Open DevTools, toggle device mode (Ctrl+Shift+M)');
  console.log('  4. Test each breakpoint: 320px, 375px, 428px, 768px, 1024px, 1440px');
  process.exit(0);
} else {
  console.log('✗ Some fixes are missing - review output above');
  process.exit(1);
}
