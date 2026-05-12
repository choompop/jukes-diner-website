/**
 * Touch Target Verification Test
 * 
 * This test verifies that all sidebar navigation links meet WCAG 2.5.5 AAA
 * compliance with minimum 48px height touch targets.
 * 
 * Test runs against: /dashboard/command-center
 * Expected: All 20 navigation links should be >= 48px tall
 */

import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation Touch Targets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/command-center');
    await page.waitForLoadState('networkidle');
  });

  test('all sidebar navigation links should be at least 48px tall (WCAG AAA)', async ({ page }) => {
    // Get all navigation links in the sidebar
    const navLinks = await page.locator('nav a').all();
    
    expect(navLinks.length).toBeGreaterThan(0);
    
    const results = [];
    let failCount = 0;
    
    for (const link of navLinks) {
      const text = await link.innerText();
      const box = await link.boundingBox();
      
      if (box) {
        const height = Math.round(box.height);
        const passes = height >= 48;
        
        results.push({
          name: text,
          height,
          passes,
          status: passes ? '✓' : '✗'
        });
        
        if (!passes) {
          failCount++;
        }
        
        // Individual assertion for each link
        expect(height, `${text} should be at least 48px tall`).toBeGreaterThanOrEqual(48);
      }
    }
    
    // Log results for documentation
    console.log('\n=== Touch Target Verification Results ===');
    console.log(`Total links tested: ${results.length}`);
    console.log(`Passed: ${results.length - failCount}`);
    console.log(`Failed: ${failCount}\n`);
    
    results.forEach(r => {
      console.log(`${r.status} ${r.name.padEnd(30)} ${r.height}px`);
    });
    console.log('=========================================\n');
    
    // Overall assertion
    expect(failCount).toBe(0);
  });

  test('touch targets should work on mobile viewport (375px)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]');
    await hamburgerButton.click();
    
    // Wait for menu to be visible
    await page.waitForSelector('nav a', { state: 'visible' });
    
    // Get all navigation links
    const navLinks = await page.locator('nav a').all();
    
    const results = [];
    let failCount = 0;
    
    for (const link of navLinks) {
      const text = await link.innerText();
      const box = await link.boundingBox();
      
      if (box) {
        const height = Math.round(box.height);
        const passes = height >= 48;
        
        results.push({
          name: text,
          height,
          passes
        });
        
        if (!passes) {
          failCount++;
        }
        
        expect(height, `${text} (mobile) should be at least 48px tall`).toBeGreaterThanOrEqual(48);
      }
    }
    
    console.log('\n=== Mobile Touch Target Results (375px) ===');
    console.log(`Total links tested: ${results.length}`);
    console.log(`Passed: ${results.length - failCount}`);
    console.log(`Failed: ${failCount}`);
    console.log('==========================================\n');
    
    expect(failCount).toBe(0);
  });

  test('hover states should still work correctly', async ({ page }) => {
    // Get first non-active navigation link
    const firstLink = page.locator('nav a').first();
    
    // Get initial background color
    const initialBg = await firstLink.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Hover over the link
    await firstLink.hover();
    
    // Wait a bit for transition
    await page.waitForTimeout(100);
    
    // Get hover background color
    const hoverBg = await firstLink.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Background should change on hover (unless it's the active page)
    const isActive = await firstLink.evaluate(el => 
      el.classList.contains('bg-diner-red')
    );
    
    if (!isActive) {
      expect(hoverBg).not.toBe(initialBg);
    }
  });

  test('spacing between items should be visually balanced', async ({ page }) => {
    const navLinks = await page.locator('nav a').all();
    
    if (navLinks.length < 2) {
      return; // Skip if not enough links
    }
    
    // Get positions of first two links
    const firstBox = await navLinks[0].boundingBox();
    const secondBox = await navLinks[1].boundingBox();
    
    if (firstBox && secondBox) {
      // Calculate gap between links
      const gap = secondBox.y - (firstBox.y + firstBox.height);
      
      // Gap should be positive (items don't overlap) and reasonable (4px based on space-y-1)
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThanOrEqual(16); // Max reasonable gap
      
      console.log(`\nSpacing between navigation items: ${gap}px`);
    }
  });
});
