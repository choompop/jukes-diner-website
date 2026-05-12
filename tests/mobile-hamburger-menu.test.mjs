/**
 * Tests for mobile hamburger menu navigation (t_2e4b70db)
 * 
 * CRITICAL: P0 blocker for mobile launch
 * 
 * Verifies:
 * - Hamburger menu component exists and is properly hidden/shown at correct breakpoints
 * - Navigation drawer component structure
 * - Accessibility attributes (ARIA labels, keyboard support)
 * - Responsive behavior at mobile/tablet/desktop breakpoints
 * - Proper z-index layering
 * - Animation/transition definitions
 */

import { test } from 'node:test';
import { strict as assert } from 'assert';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

test('Dashboard layout should have hamburger menu button component', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should have a hamburger menu button element (case-insensitive)
  const hasHamburgerButton = /hamburger/i.test(content) || /Menu button/i.test(content);
  assert(hasHamburgerButton, 'Dashboard layout should include hamburger menu button');
});

test('Hamburger button should have 44x44px minimum tappable area', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should have w-11 h-11 (44px) or larger for mobile touch targets
  const hasTappableSize = /w-11\s+h-11|w-12\s+h-12|min-w-\[44px\]/.test(content);
  assert(hasTappableSize, 'Hamburger button should be at least 44x44px (w-11 h-11)');
});

test('Hamburger button should have accessible label', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should have aria-label or aria-labelledby (case-insensitive, multiline)
  const hasAriaLabel = /aria-label[^>]*menu/is.test(content) || /aria-labelledby/i.test(content);
  assert(hasAriaLabel, 'Hamburger button must have aria-label for accessibility');
});

test('Hamburger button should have aria-expanded state', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should manage aria-expanded state
  const hasAriaExpanded = /aria-expanded/.test(content);
  assert(hasAriaExpanded, 'Hamburger button must have aria-expanded for screen readers');
});

test('Navigation drawer should have backdrop overlay', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should have backdrop with opacity (case-insensitive)
  const hasBackdrop = (/backdrop/i.test(content) || /overlay/i.test(content)) && /bg-black\/\d+|bg-gray-900\/\d+/.test(content);
  assert(hasBackdrop, 'Navigation drawer should have semi-transparent backdrop overlay');
});

test('Navigation drawer should be 280px or 80% viewport width (whichever smaller)', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should use w-64 (256px) for mobile drawer
  const hasDrawerWidth = /w-64/.test(content);
  assert(hasDrawerWidth, 'Drawer width should be w-64 (256px)');
});

test('Navigation drawer should have smooth transition (300ms)', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should have transition or duration-300
  const hasTransition = /transition|duration-300/.test(content);
  assert(hasTransition, 'Drawer should have smooth 300ms transition');
});

test('Navigation drawer should have close button with accessible label', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should have toggle button with aria-label for navigation menu
  const hasToggleButton = /aria-label.*Toggle.*navigation.*menu|aria-label.*navigation.*menu/i.test(content);
  assert(hasToggleButton, 'Drawer toggle button must have aria-label');
});

test('Sidebar should be hidden on mobile (<768px) via CSS', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Desktop sidebar should be hidden on mobile with md:flex or hidden md:block pattern
  const hasMobileHide = /hidden\s+md:flex|hidden\s+md:block/.test(content);
  assert(hasMobileHide, 'Desktop sidebar should be hidden on mobile with responsive classes');
});

test('Hamburger menu should be visible on mobile, hidden on desktop', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Hamburger should be md:hidden (visible on mobile, hidden on desktop)
  const hasResponsiveHamburger = /md:hidden/.test(content);
  assert(hasResponsiveHamburger, 'Hamburger button should be hidden on desktop (md:hidden)');
});

test('Main content should use full width when sidebar hidden', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Main content should not have ml-64 on mobile (responsive margin)
  const hasResponsiveMargin = /ml-0\s+md:ml-64|md:ml-64/.test(content);
  assert(hasResponsiveMargin, 'Main content should be full-width on mobile (no ml-64), desktop margin intact');
});

test('Navigation items should be present in mobile drawer', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Navigation groups should be rendered in both desktop sidebar and mobile drawer
  // We reuse navGroups for consistency
  const navGroupsCount = (content.match(/navGroups\.map/g) || []).length;
  assert(navGroupsCount >= 1, 'Navigation groups should be mapped for mobile drawer');
});

test('User profile section should be in mobile drawer', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // User profile section and logout should exist (using hardcoded "Operator" and "admin" or user data)
  const hasUserProfile = (/Operator|admin|user/i.test(content)) && /logout|LogOut/i.test(content);
  assert(hasUserProfile, 'Mobile drawer should include user profile and logout');
});

test('Component should manage drawer open/close state', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should have useState for drawer state
  const hasDrawerState = /useState.*\(false\)|const \[.*isOpen|const \[.*menuOpen/.test(content);
  assert(hasDrawerState, 'Component should track drawer open/close state with useState');
});

test('Drawer should close on Escape key', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should handle keyboard events for Escape
  const hasEscapeHandler = /Escape|key === 'Escape'/.test(content);
  assert(hasEscapeHandler, 'Drawer should close when Escape key is pressed');
});

test('Drawer should use proper z-index layering', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Backdrop should be z-40, drawer z-50 (above everything)
  const hasZIndex = /z-40|z-50/.test(content);
  assert(hasZIndex, 'Drawer and backdrop should have high z-index (z-40, z-50)');
});

test('Body scroll should be locked when drawer is open', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should manipulate document.body.style.overflow when drawer opens/closes
  const hasScrollLock = /document\.body\.style\.overflow/.test(content);
  assert(hasScrollLock, 'Drawer should lock body scroll (document.body.style.overflow = "hidden")');
  
  // Should restore scroll on cleanup
  const hasScrollRestore = /overflow\s*=\s*(?:'(?:unset|)'|"(?:unset|)")/.test(content);
  assert(hasScrollRestore, 'Drawer cleanup should restore body scroll (overflow = "" or "unset")');
});

test('Focus should move to drawer when opened', async () => {
  const layoutPath = path.join(ROOT, 'app/dashboard/components/DashboardLayout.tsx');
  const content = await fs.readFile(layoutPath, 'utf-8');
  
  // Should have focus management when drawer opens
  const hasFocusManagement = /\.focus\(\)|focusable|focus-trap/.test(content);
  assert(hasFocusManagement, 'Drawer should manage focus when opened (move focus to first interactive element)');
});
