# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/a11y-main-landmark.test.mjs >> Main Landmark Accessibility >> /dashboard/brain-dump should have exactly one top-level main landmark
- Location: tests/a11y-main-landmark.test.mjs:50:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/dashboard/brain-dump", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | 
  4   | /**
  5   |  * A11Y Test: Main Landmark Structure
  6   |  * 
  7   |  * Validates that dashboard pages have:
  8   |  * 1. Exactly ONE <main> landmark (no duplicates)
  9   |  * 2. Main is top-level (not nested within another main)
  10  |  * 3. No landmark-unique violations
  11  |  * 
  12  |  * Issue: t_c191fe29 - Previous structure had nested main elements
  13  |  * Fix: Changed root layout outer <main> to <div>
  14  |  */
  15  | 
  16  | const DASHBOARD_PAGES = [
  17  |   '/dashboard',
  18  |   '/dashboard/brain-dump',
  19  |   '/dashboard/onboarding',
  20  |   '/dashboard/training',
  21  |   '/dashboard/operations',
  22  |   '/dashboard/bookings',
  23  |   '/dashboard/menu-mgmt',
  24  |   '/dashboard/financials',
  25  |   '/dashboard/marketing',
  26  |   '/dashboard/pipeline',
  27  |   '/dashboard/drive',
  28  |   '/dashboard/workflow',
  29  |   '/dashboard/outputs',
  30  |   '/dashboard/franchise-brain',
  31  |   '/dashboard/agents',
  32  |   '/dashboard/hermes-kanban',
  33  |   '/dashboard/resources',
  34  |   '/dashboard/support',
  35  | ];
  36  | 
  37  | test.describe('Main Landmark Accessibility', () => {
  38  |   test.beforeEach(async ({ page }) => {
  39  |     // Mock authentication
  40  |     await page.addInitScript(() => {
  41  |       localStorage.setItem('jukes_user', JSON.stringify({
  42  |         name: 'Test Operator',
  43  |         email: 'test@jukesdiner.com',
  44  |         role: 'admin'
  45  |       }));
  46  |     });
  47  |   });
  48  | 
  49  |   for (const pagePath of DASHBOARD_PAGES) {
  50  |     test(`${pagePath} should have exactly one top-level main landmark`, async ({ page }) => {
> 51  |       await page.goto(`http://localhost:3000${pagePath}`);
      |                  ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  52  |       await page.waitForLoadState('domcontentloaded');
  53  | 
  54  |       // Count main elements
  55  |       const mainCount = await page.locator('main').count();
  56  |       expect(mainCount, `${pagePath} should have exactly 1 main element`).toBe(1);
  57  | 
  58  |       // Verify no nested main elements
  59  |       const nestedMainCount = await page.locator('main main').count();
  60  |       expect(nestedMainCount, `${pagePath} should have no nested main elements`).toBe(0);
  61  | 
  62  |       // Run Axe audit for landmark rules
  63  |       const axeResults = await new AxeBuilder({ page })
  64  |         .withTags(['wcag2a', 'wcag21a'])
  65  |         .options({
  66  |           rules: {
  67  |             'landmark-no-duplicate-main': { enabled: true },
  68  |             'landmark-main-is-top-level': { enabled: true },
  69  |             'landmark-unique': { enabled: true },
  70  |           }
  71  |         })
  72  |         .analyze();
  73  | 
  74  |       // Filter for landmark violations only
  75  |       const landmarkViolations = axeResults.violations.filter(v => 
  76  |         v.id === 'landmark-no-duplicate-main' ||
  77  |         v.id === 'landmark-main-is-top-level' ||
  78  |         v.id === 'landmark-unique'
  79  |       );
  80  | 
  81  |       expect(landmarkViolations, 
  82  |         `${pagePath} should have no landmark violations: ${JSON.stringify(landmarkViolations, null, 2)}`
  83  |       ).toHaveLength(0);
  84  |     });
  85  |   }
  86  | 
  87  |   test('Public pages should also have exactly one main landmark', async ({ page }) => {
  88  |     const publicPages = ['/', '/about', '/menu', '/contact', '/franchise'];
  89  |     
  90  |     for (const pagePath of publicPages) {
  91  |       await page.goto(`http://localhost:3000${pagePath}`);
  92  |       await page.waitForLoadState('domcontentloaded');
  93  | 
  94  |       const mainCount = await page.locator('main').count();
  95  |       expect(mainCount, `${pagePath} should have exactly 1 main element`).toBe(1);
  96  | 
  97  |       const nestedMainCount = await page.locator('main main').count();
  98  |       expect(nestedMainCount, `${pagePath} should have no nested main elements`).toBe(0);
  99  |     }
  100 |   });
  101 | });
  102 | 
```