#!/usr/bin/env node

/**
 * Horizontal Scroll QA Test Suite
 * Tests dashboard.jukesdiner.com for horizontal scroll at all breakpoints
 */

import { chromium } from 'playwright';

const BREAKPOINTS = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 12/13/14', width: 375, height: 667 },
  { name: 'iPhone Pro Max', width: 428, height: 926 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
];

const PAGES = [
  '/dashboard/command-center',
  '/dashboard/bookings',
  '/dashboard/menu',
  '/dashboard/financials',
  '/dashboard/operations',
  '/dashboard/brand',
];

async function checkHorizontalScroll(page, pageName, breakpoint) {
  const result = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Find all elements that might be causing overflow
    const overflowElements = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > window.innerWidth) {
        const rect = el.getBoundingClientRect();
        overflowElements.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          scrollWidth: el.scrollWidth,
          overflow: el.scrollWidth - window.innerWidth,
          rect: {
            width: rect.width,
            left: rect.left,
            right: rect.right
          }
        });
      }
    });
    
    return {
      hasHScroll: html.scrollWidth > window.innerWidth,
      scrollWidth: html.scrollWidth,
      innerWidth: window.innerWidth,
      overflow: html.scrollWidth - window.innerWidth,
      bodyScrollWidth: body.scrollWidth,
      overflowElements: overflowElements.slice(0, 5) // Top 5 offenders
    };
  });
  
  return {
    page: pageName,
    breakpoint: `${breakpoint.name} (${breakpoint.width}px)`,
    ...result
  };
}

async function runTests() {
  console.log('🔍 Horizontal Scroll QA Test Suite\n');
  console.log('Testing URL: http://localhost:3000');
  console.log(`Breakpoints: ${BREAKPOINTS.length}`);
  console.log(`Pages: ${PAGES.length}`);
  console.log(`Total tests: ${BREAKPOINTS.length * PAGES.length}\n`);
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  let failures = 0;
  
  for (const bp of BREAKPOINTS) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    
    for (const pagePath of PAGES) {
      try {
        await page.goto(`http://localhost:3000${pagePath}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });
        
        // Wait for content to settle
        await page.waitForTimeout(500);
        
        const result = await checkHorizontalScroll(page, pagePath, bp);
        results.push(result);
        
        const status = result.hasHScroll ? '❌ FAIL' : '✅ PASS';
        console.log(`${status} ${result.breakpoint.padEnd(30)} ${result.page}`);
        
        if (result.hasHScroll) {
          failures++;
          console.log(`  └─ Overflow: ${result.overflow}px (${result.scrollWidth}px > ${result.innerWidth}px)`);
          
          if (result.overflowElements.length > 0) {
            console.log(`  └─ Top offending elements:`);
            result.overflowElements.forEach(el => {
              console.log(`     • ${el.tag}${el.className ? '.' + el.className.split(' ')[0] : ''}: ${el.overflow}px overflow`);
            });
          }
        }
        
      } catch (error) {
        console.log(`⚠️  ERROR ${bp.name.padEnd(30)} ${pagePath}: ${error.message}`);
      }
    }
    
    console.log(''); // Blank line between breakpoints
  }
  
  await browser.close();
  
  console.log('\n📊 Summary');
  console.log('─'.repeat(50));
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${results.length - failures} ✅`);
  console.log(`Failed: ${failures} ❌`);
  console.log(`Success rate: ${((results.length - failures) / results.length * 100).toFixed(1)}%`);
  
  // Show failures by breakpoint
  const failuresByBreakpoint = {};
  results.filter(r => r.hasHScroll).forEach(r => {
    if (!failuresByBreakpoint[r.breakpoint]) {
      failuresByBreakpoint[r.breakpoint] = [];
    }
    failuresByBreakpoint[r.breakpoint].push(r.page);
  });
  
  if (Object.keys(failuresByBreakpoint).length > 0) {
    console.log('\n❌ Failures by breakpoint:');
    Object.entries(failuresByBreakpoint).forEach(([bp, pages]) => {
      console.log(`  ${bp}:`);
      pages.forEach(p => console.log(`    • ${p}`));
    });
  }
  
  process.exit(failures > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
