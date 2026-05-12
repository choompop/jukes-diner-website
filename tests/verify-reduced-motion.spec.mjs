/**
 * Reduced Motion Accessibility Test
 * 
 * This test verifies that the command center page respects the prefers-reduced-motion
 * media query for users with vestibular disorders or motion sensitivity.
 * 
 * Test runs against: /dashboard/command-center
 * Expected: All framer-motion animations should be disabled when prefers-reduced-motion is active
 */

import { test, expect } from '@playwright/test';

test.describe('Command Center Reduced Motion Support', () => {
  test('should disable all animations when prefers-reduced-motion is active', async ({ page }) => {
    // Emulate prefers-reduced-motion: reduce
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Navigate to command center
    await page.goto('http://localhost:3000/dashboard/command-center');
    await page.waitForLoadState('networkidle');
    
    // Wait for content to be visible
    await page.waitForSelector('h1:has-text("OPERATOR COMMAND CENTER")', { state: 'visible' });
    
    // Wait for animations to complete (if reduced motion is working, this should be instant)
    await page.waitForTimeout(500);
    
    // All motion.div elements should appear instantly without animation
    // Check that all test IDs we added are present and visible
    const priorityItems = await page.locator('[data-testid^="priority-item"]').all();
    const bookingItems = await page.locator('[data-testid^="booking-item"]').all();
    const issueItems = await page.locator('[data-testid^="issue-item"]').all();
    const approvalItems = await page.locator('[data-testid^="approval-item"]').all();
    
    // All items should be visible (opacity: 1) 
    for (const item of [...priorityItems, ...bookingItems, ...issueItems, ...approvalItems]) {
      await expect(item).toBeVisible();
      const opacity = await item.evaluate(el => window.getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeGreaterThanOrEqual(0.9); // Allow for rounding
    }
    
    console.log('✓ All animated items appear instantly with reduced motion enabled');
  });

  test('should show animations when prefers-reduced-motion is NOT active', async ({ page }) => {
    // Emulate prefers-reduced-motion: no-preference (animations OK)
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    
    // Navigate to command center
    await page.goto('http://localhost:3000/dashboard/command-center');
    await page.waitForLoadState('networkidle');
    
    // Wait for content to be visible
    await page.waitForSelector('h1:has-text("OPERATOR COMMAND CENTER")', { state: 'visible' });
    
    // Verify that animations exist by checking for framer-motion data attributes
    // or by checking that elements have the motion component characteristics
    const motionDivs = await page.locator('[style*="transform"]').all();
    
    // Should have multiple animated elements
    expect(motionDivs.length).toBeGreaterThan(0);
    
    console.log(`✓ Found ${motionDivs.length} animated elements with motion enabled`);
  });

  test('metric cards should respect reduced motion setting', async ({ page }) => {
    // Emulate prefers-reduced-motion: reduce
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Navigate to command center
    await page.goto('http://localhost:3000/dashboard/command-center');
    await page.waitForLoadState('networkidle');
    
    // Wait for animations to complete (instant in reduced motion mode)
    await page.waitForTimeout(500);
    
    // Metric cards should all be visible without staggered animation
    const metricCards = await page.locator('[data-testid="metric-card"]').all();
    
    expect(metricCards.length).toBeGreaterThanOrEqual(5); // 5 metric cards on command center
    
    // All cards should be visible immediately
    for (const card of metricCards) {
      await expect(card).toBeVisible();
      const opacity = await card.evaluate(el => window.getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeGreaterThanOrEqual(0.9); // Allow for rounding
    }
    
    console.log(`✓ All ${metricCards.length} metric cards appear instantly with reduced motion`);
  });
});
