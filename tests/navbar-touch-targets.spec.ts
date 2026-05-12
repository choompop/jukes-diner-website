import { test, expect } from '@playwright/test';

/**
 * WCAG Touch Target Size Tests
 * 
 * WCAG 2.5.5 (AAA): Touch targets must be at least 44x44px
 * Best practice: 48x48px for better usability
 * 
 * Testing all top navigation links for proper touch target height
 */

test.describe('Navbar Touch Targets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('desktop nav links meet 48px minimum height', async ({ page }) => {
    // Get all desktop navigation links (not mobile menu)
    const desktopNav = page.locator('nav div.hidden.md\\:flex');
    const navLinks = desktopNav.locator('a');
    
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0); // Ensure we found the links

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      const box = await link.boundingBox();
      
      expect(box).not.toBeNull();
      expect(box!.height, `Link "${text}" should be at least 48px tall`).toBeGreaterThanOrEqual(48);
    }
  });

  test('all desktop nav links are consistently sized', async ({ page }) => {
    const desktopNav = page.locator('nav div.hidden.md\\:flex');
    const navLinks = desktopNav.locator('a');
    
    const heights: number[] = [];
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const box = await navLinks.nth(i).boundingBox();
      if (box) heights.push(box.height);
    }

    // All main nav links (excluding dashboard button) should have same height
    const mainNavHeights = heights.slice(0, -1); // Exclude dashboard which has different styling
    const firstHeight = mainNavHeights[0];
    
    mainNavHeights.forEach((height, index) => {
      expect(height, `Link ${index} height should match first link`).toBe(firstHeight);
    });
  });

  test('dashboard button meets 48px minimum height', async ({ page }) => {
    const dashboardLink = page.locator('nav a[href="/dashboard"]').first();
    const box = await dashboardLink.boundingBox();
    
    expect(box).not.toBeNull();
    expect(box!.height, 'Dashboard button should be at least 48px tall').toBeGreaterThanOrEqual(48);
  });

  test('mobile nav links meet 48px minimum height', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    const menuButton = page.locator('button', { hasText: /menu|close/i }).or(page.locator('button svg'));
    await menuButton.click();
    
    // Get mobile nav links
    const mobileNav = page.locator('div.md\\:hidden');
    const mobileLinks = mobileNav.locator('a');
    
    const count = await mobileLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = mobileLinks.nth(i);
      const text = await link.textContent();
      const box = await link.boundingBox();
      
      expect(box).not.toBeNull();
      expect(box!.height, `Mobile link "${text}" should be at least 48px tall`).toBeGreaterThanOrEqual(48);
    }
  });

  test('hover states maintain touch target size', async ({ page }) => {
    const firstLink = page.locator('nav div.hidden.md\\:flex a').first();
    
    // Get initial height
    const initialBox = await firstLink.boundingBox();
    expect(initialBox).not.toBeNull();
    
    // Hover and check height doesn't change
    await firstLink.hover();
    await page.waitForTimeout(100); // Brief wait for transition
    
    const hoverBox = await firstLink.boundingBox();
    expect(hoverBox).not.toBeNull();
    expect(hoverBox!.height).toBe(initialBox!.height);
  });
});
