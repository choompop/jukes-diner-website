import { test, expect } from '@playwright/test';

/**
 * A11Y: Nav landmarks should have unique aria-labels
 * Issue: t_0880823c
 * Axe rule: landmark-unique (moderate impact)
 */

test.describe('Navigation Landmarks A11Y', () => {
  test('top navbar should have "Main navigation" aria-label', async ({ page }) => {
    await page.goto('/');
    
    const mainNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mainNav).toBeVisible();
    
    // Verify it's the sticky top navbar
    const hasExpectedClasses = await mainNav.evaluate((el) => 
      el.classList.contains('sticky') && 
      el.classList.contains('top-0') &&
      el.classList.contains('bg-diner-red')
    );
    expect(hasExpectedClasses).toBe(true);
  });

  test('dashboard sidebar should have "Dashboard sidebar" aria-label', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Navigate to dashboard
    await page.waitForURL('/dashboard');
    
    const sidebarNav = page.locator('nav[aria-label="Dashboard sidebar"]');
    await expect(sidebarNav).toBeVisible();
    
    // Verify it contains navigation items
    const navGroups = await sidebarNav.locator('div > p').count();
    expect(navGroups).toBeGreaterThan(0);
  });

  test('all nav elements should have unique aria-labels', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Get all nav elements and their aria-labels
    const navLabels = await page.locator('nav').evaluateAll((navs) => 
      navs.map((n) => n.getAttribute('aria-label')).filter(Boolean)
    );
    
    // Verify we have at least 2 nav landmarks
    expect(navLabels.length).toBeGreaterThanOrEqual(2);
    
    // Verify labels are unique
    const uniqueLabels = new Set(navLabels);
    expect(uniqueLabels.size).toBe(navLabels.length);
    
    // Verify expected labels exist
    expect(navLabels).toContain('Main navigation');
    expect(navLabels).toContain('Dashboard sidebar');
  });

  test('screen reader can distinguish nav landmarks by aria-label', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Verify navigation landmarks can be identified programmatically
    const mainNav = await page.locator('nav[aria-label="Main navigation"]').count();
    const sidebarNav = await page.locator('nav[aria-label="Dashboard sidebar"]').count();
    
    expect(mainNav).toBe(1);
    expect(sidebarNav).toBe(1);
    
    // Verify no nav elements without aria-label (except potentially mobile-only ones)
    const navsWithoutLabel = await page.locator('nav:not([aria-label])').count();
    expect(navsWithoutLabel).toBe(0);
  });
});
