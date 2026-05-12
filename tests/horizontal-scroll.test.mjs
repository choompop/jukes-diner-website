/**
 * Horizontal Scroll Prevention Tests
 * 
 * Verifies that the dashboard prevents horizontal scrolling at all
 * mobile and tablet breakpoints (320px - 1920px).
 * 
 * Run with: node tests/horizontal-scroll.test.mjs
 * Requires: Playwright or Puppeteer (auto-detected)
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Breakpoints to test (aligned with responsive design spec)
const BREAKPOINTS = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 12/13/14', width: 375, height: 667 },
  { name: 'iPhone Pro Max', width: 428, height: 926 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
];

// Pages to test for horizontal scroll
const PAGES_TO_TEST = [
  '/dashboard/command-center',
  '/dashboard/bookings',
  '/dashboard/menu-mgmt',
  '/dashboard/financials',
  '/dashboard/operations',
  '/dashboard/marketing',
];

function assertStaticScrollGuards() {
  const globalsPath = join(__dirname, '..', 'app', 'globals.css');
  const globals = readFileSync(globalsPath, 'utf8');

  const requiredRules = [
    { name: 'global border-box sizing', pattern: /\*,\s*\*::before,\s*\*::after\s*\{[^}]*box-sizing:\s*border-box/ },
    { name: 'html/body horizontal overflow guard', pattern: /html,\s*body\s*\{[^}]*overflow-x:\s*hidden/ },
    { name: 'media elements max-width guard', pattern: /img,\s*video,\s*iframe,\s*svg\s*\{[^}]*max-width:\s*100%/ },
    { name: 'text wrapping guard', pattern: /overflow-wrap:\s*break-word/ },
  ];

  const missingRules = requiredRules.filter((rule) => !rule.pattern.test(globals));
  if (missingRules.length > 0) {
    throw new Error(`Missing horizontal-scroll CSS guard(s): ${missingRules.map((rule) => rule.name).join(', ')}`);
  }
}

async function isServerReachable(baseUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(baseUrl, {
      method: 'HEAD',
      signal: controller.signal,
    });
    return response.ok || response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Check if horizontal scroll exists at current viewport
 */
async function checkHorizontalScroll(page) {
  return await page.evaluate(() => {
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = window.innerWidth;
    const hasHorizontalScroll = scrollWidth > clientWidth;
    
    // Find any elements that overflow the viewport
    const overflowingElements = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > clientWidth + 1) { // +1px tolerance for rounding
        overflowingElements.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          overflow: rect.right - clientWidth,
        });
      }
    });
    
    return {
      hasHorizontalScroll,
      scrollWidth,
      clientWidth,
      overflow: scrollWidth - clientWidth,
      overflowingElements: overflowingElements.slice(0, 5), // Top 5 culprits
    };
  });
}

/**
 * Verify CSS rules are present in compiled stylesheet
 */
async function verifyCSSRules(page) {
  return await page.evaluate(() => {
    const checks = {
      'box-sizing: border-box': false,
      'overflow-x: hidden (html/body)': false,
      'word-wrap: break-word': false,
    };
    
    // Check computed styles on html/body
    const htmlStyles = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);
    
    if (htmlStyles.boxSizing === 'border-box') {
      checks['box-sizing: border-box'] = true;
    }
    
    if (htmlStyles.overflowX === 'hidden' || bodyStyles.overflowX === 'hidden') {
      checks['overflow-x: hidden (html/body)'] = true;
    }
    
    // Note: max-width: 100vw check removed - computed style varies by browser
    // The actual scroll prevention is validated by checkHorizontalScroll()
    
    // Check word-wrap on a paragraph (sample element)
    const p = document.querySelector('p, div, h1');
    if (p) {
      const pStyles = window.getComputedStyle(p);
      if (pStyles.wordWrap === 'break-word' || pStyles.overflowWrap === 'break-word') {
        checks['word-wrap: break-word'] = true;
      }
    }
    
    return checks;
  });
}

/**
 * Run tests with detected browser automation library
 */
async function runTests() {
  assertStaticScrollGuards();

  const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
  console.log(`Testing against: ${BASE_URL}\n`);

  const serverReachable = await isServerReachable(BASE_URL);
  if (!serverReachable) {
    console.log('✓ Static horizontal-scroll CSS guards verified');
    console.log('ℹ Skipping live viewport crawl because no Next.js server is reachable.');
    console.log('  Start the app and set TEST_URL to run live horizontal-scroll checks.');
    return;
  }

  let browser, page;
  let browserType = 'unknown';
  
  // Try to load Playwright first, then Puppeteer
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    page = await context.newPage();
    browserType = 'playwright';
    console.log('✓ Using Playwright');
  } catch (e) {
    try {
      const puppeteer = await import('puppeteer');
      browser = await puppeteer.launch({ headless: true });
      page = await browser.newPage();
      browserType = 'puppeteer';
      console.log('✓ Using Puppeteer');
    } catch (e2) {
      console.error('ERROR: Neither Playwright nor Puppeteer found.');
      console.error('Install one with: npm install -D playwright OR npm install -D puppeteer');
      process.exit(1);
    }
  }
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failures = [];
  
  // Test CSS rules are present (once)
  console.log('=== CSS Rules Verification ===');
  totalTests++;
  try {
    await page.goto(`${BASE_URL}/dashboard/command-center`, { waitUntil: 'networkidle' });
    const cssChecks = await verifyCSSRules(page);
    
    let allPassed = true;
    for (const [rule, passed] of Object.entries(cssChecks)) {
      if (!passed) {
        allPassed = false;
        console.log(`  ✗ ${rule}`);
      } else {
        console.log(`  ✓ ${rule}`);
      }
    }
    
    if (allPassed) {
      passedTests++;
      console.log('✓ CSS rules verification PASSED\n');
    } else {
      failedTests++;
      failures.push({ test: 'CSS Rules', reason: 'Missing required CSS rules' });
      console.log('✗ CSS rules verification FAILED\n');
    }
  } catch (err) {
    failedTests++;
    failures.push({ test: 'CSS Rules', reason: err.message });
    console.log(`✗ CSS rules verification ERROR: ${err.message}\n`);
  }
  
  // Test each page at each breakpoint
  for (const testPage of PAGES_TO_TEST) {
    console.log(`=== Testing ${testPage} ===`);
    
    for (const breakpoint of BREAKPOINTS) {
      totalTests++;
      const testName = `${testPage} @ ${breakpoint.name} (${breakpoint.width}px)`;
      
      try {
        // Set viewport
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        
        // Navigate to page
        await page.goto(`${BASE_URL}${testPage}`, { 
          waitUntil: browserType === 'playwright' ? 'networkidle' : 'networkidle0',
          timeout: 10000,
        });
        
        // Wait a bit for any dynamic content
        await page.waitForTimeout(500);
        
        // Check for horizontal scroll
        const result = await checkHorizontalScroll(page);
        
        if (!result.hasHorizontalScroll) {
          passedTests++;
          console.log(`  ✓ ${breakpoint.name} (${breakpoint.width}px) - No horizontal scroll`);
        } else {
          failedTests++;
          console.log(`  ✗ ${breakpoint.name} (${breakpoint.width}px) - HORIZONTAL SCROLL DETECTED`);
          console.log(`    Scroll width: ${result.scrollWidth}px, Viewport: ${result.clientWidth}px, Overflow: ${result.overflow}px`);
          
          if (result.overflowingElements.length > 0) {
            console.log(`    Top overflowing elements:`);
            result.overflowingElements.forEach(el => {
              console.log(`      - ${el.tag}.${el.className || '(no class)'}: overflow ${el.overflow}px`);
            });
          }
          
          failures.push({
            test: testName,
            scrollWidth: result.scrollWidth,
            clientWidth: result.clientWidth,
            overflow: result.overflow,
            culprits: result.overflowingElements,
          });
        }
      } catch (err) {
        failedTests++;
        console.log(`  ✗ ${breakpoint.name} (${breakpoint.width}px) - ERROR: ${err.message}`);
        failures.push({ test: testName, reason: err.message });
      }
    }
    
    console.log('');
  }
  
  // Summary
  console.log('=== TEST SUMMARY ===');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} (${Math.round(passedTests / totalTests * 100)}%)`);
  console.log(`Failed: ${failedTests} (${Math.round(failedTests / totalTests * 100)}%)`);
  
  if (failures.length > 0) {
    console.log('\n=== FAILURES ===');
    failures.forEach((failure, idx) => {
      console.log(`${idx + 1}. ${failure.test}`);
      if (failure.reason) {
        console.log(`   Reason: ${failure.reason}`);
      } else if (failure.overflow) {
        console.log(`   Overflow: ${failure.overflow}px (${failure.scrollWidth}px scroll width vs ${failure.clientWidth}px viewport)`);
      }
    });
  }
  
  await browser.close();
  
  // Exit with error code if tests failed
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
