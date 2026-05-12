import { describe, it, test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Interactive States Test Suite
 * 
 * Tests for WCAG 2.1 AA compliance and interactive state implementation:
 * - Focus indicators (HIGH priority - accessibility requirement)
 * - Hover states (MEDIUM priority - UX expectation)
 * - Loading states (MEDIUM priority - prevents confusion)
 * - Disabled states (LOW priority - visual clarity)
 */

describe('Interactive States - CSS Implementation', () => {
  const cssPath = join(projectRoot, 'app/interactive-states.css');
  let cssContent;

  try {
    cssContent = readFileSync(cssPath, 'utf-8');
  } catch (err) {
    console.error(`Failed to read ${cssPath}:`, err);
  }

  test('interactive-states.css file exists', () => {
    assert.ok(cssContent, 'interactive-states.css should exist');
  });

  describe('Focus Indicators (WCAG 2.1 AA)', () => {
    test('removes default focus outline globally', () => {
      assert.ok(
        cssContent.includes('*:focus') && cssContent.includes('outline: none'),
        'Should remove default browser focus outline'
      );
    });

    test('implements custom focus-visible indicators', () => {
      assert.ok(
        cssContent.includes(':focus-visible'),
        'Should use :focus-visible pseudo-class for keyboard-only focus'
      );
    });

    test('focus indicators use 2px outline (WCAG minimum)', () => {
      assert.ok(
        cssContent.includes('outline: 2px solid'),
        'Focus outline should be 2px solid (meets WCAG minimum)'
      );
    });

    test('focus indicators use brand red color', () => {
      assert.ok(
        cssContent.includes('var(--color-diner-red)') || 
        cssContent.includes('#d62828'),
        'Focus indicators should use Juke\'s brand red'
      );
    });

    test('focus indicators have offset for breathing room', () => {
      assert.ok(
        cssContent.includes('outline-offset: 2px'),
        'Focus indicators should have 2px offset for visibility'
      );
    });

    test('covers all interactive elements', () => {
      const requiredSelectors = [
        'a:focus-visible',
        'button:focus-visible',
        'input:focus-visible',
        'select:focus-visible',
      ];

      requiredSelectors.forEach(selector => {
        assert.ok(
          cssContent.includes(selector),
          `Should include focus-visible for ${selector}`
        );
      });
    });
  });

  describe('Hover States', () => {
    test('implements card hover effect', () => {
      assert.ok(
        cssContent.includes('.card-hover'),
        'Should define .card-hover class'
      );
    });

    test('card hover includes transform and shadow', () => {
      const cardHoverSection = cssContent.substring(
        cssContent.indexOf('.card-hover'),
        cssContent.indexOf('.card-hover') + 500
      );

      assert.ok(
        cardHoverSection.includes('transform') && 
        cardHoverSection.includes('box-shadow'),
        'Card hover should include transform and box-shadow'
      );
    });

    test('hover states use smooth transitions', () => {
      assert.ok(
        cssContent.includes('transition:'),
        'Hover effects should use transitions'
      );
    });

    test('implements subtle hover for nested cards', () => {
      assert.ok(
        cssContent.includes('.card-hover-subtle'),
        'Should define .card-hover-subtle for nested cards'
      );
    });
  });

  describe('Button States', () => {
    test('implements primary button states', () => {
      assert.ok(
        cssContent.includes('.btn-primary'),
        'Should define .btn-primary class'
      );
    });

    test('implements secondary button states', () => {
      assert.ok(
        cssContent.includes('.btn-secondary'),
        'Should define .btn-secondary class'
      );
    });

    test('implements danger button states', () => {
      assert.ok(
        cssContent.includes('.btn-danger'),
        'Should define .btn-danger class'
      );
    });

    test('button hover states use :not(:disabled)', () => {
      assert.ok(
        cssContent.includes(':hover:not(:disabled)'),
        'Button hover states should not apply to disabled buttons'
      );
    });

    test('button active states use :not(:disabled)', () => {
      assert.ok(
        cssContent.includes(':active:not(:disabled)'),
        'Button active states should not apply to disabled buttons'
      );
    });
  });

  describe('Loading States', () => {
    test('implements skeleton loader animation', () => {
      assert.ok(
        cssContent.includes('.skeleton') && 
        cssContent.includes('animation:'),
        'Should define .skeleton class with animation'
      );
    });

    test('implements spinner animation', () => {
      assert.ok(
        cssContent.includes('.spinner') && 
        cssContent.includes('@keyframes'),
        'Should define .spinner class with keyframes animation'
      );
    });

    test('skeleton animation keyframes exist', () => {
      assert.ok(
        cssContent.includes('@keyframes skeleton-loading'),
        'Should define skeleton-loading keyframes'
      );
    });

    test('spinner rotation keyframes exist', () => {
      assert.ok(
        cssContent.includes('@keyframes spinner-rotate') ||
        cssContent.includes('transform: rotate'),
        'Should define spinner rotation animation'
      );
    });
  });

  describe('Disabled States', () => {
    test('implements generic disabled styles', () => {
      assert.ok(
        cssContent.includes('[disabled]') || 
        cssContent.includes(':disabled'),
        'Should style disabled elements'
      );
    });

    test('disabled elements have reduced opacity', () => {
      const disabledSection = cssContent.substring(
        cssContent.indexOf(':disabled'),
        cssContent.indexOf(':disabled') + 300
      );

      assert.ok(
        disabledSection.includes('opacity: 0.5') || 
        disabledSection.includes('opacity: 0.6'),
        'Disabled elements should have reduced opacity'
      );
    });

    test('disabled elements have not-allowed cursor', () => {
      assert.ok(
        cssContent.includes('cursor: not-allowed'),
        'Disabled elements should show not-allowed cursor'
      );
    });
  });

  describe('Mobile/Touch Support', () => {
    test('implements touch target minimum size', () => {
      assert.ok(
        cssContent.includes('.touch-target') || 
        cssContent.includes('min-width: 44px'),
        'Should define minimum touch target size (44x44px)'
      );
    });

    test('implements touch-specific media queries', () => {
      assert.ok(
        cssContent.includes('@media (hover: none)') || 
        cssContent.includes('pointer: coarse'),
        'Should include touch device media queries'
      );
    });
  });

  describe('Accessibility Features', () => {
    test('uses ARIA-friendly attributes', () => {
      assert.ok(
        cssContent.includes('[aria-disabled]') || 
        cssContent.includes('[role='),
        'Should style ARIA attributes for screen reader support'
      );
    });

    test('includes alternative focus styles for dark backgrounds', () => {
      assert.ok(
        cssContent.includes('.focus-light') || 
        cssContent.includes('outline: 2px solid white'),
        'Should provide alternative focus styles for dark backgrounds'
      );
    });
  });
});

describe('Interactive States - Component Implementation', () => {
  const buttonComponentPath = join(projectRoot, 'components/Button.tsx');
  const skeletonComponentPath = join(projectRoot, 'components/Skeleton.tsx');
  let buttonComponent, skeletonComponent;

  try {
    buttonComponent = readFileSync(buttonComponentPath, 'utf-8');
    skeletonComponent = readFileSync(skeletonComponentPath, 'utf-8');
  } catch (err) {
    console.error('Failed to read component files:', err);
  }

  describe('Button Component', () => {
    test('Button component file exists', () => {
      assert.ok(buttonComponent, 'Button.tsx should exist');
    });

    test('exports Button component', () => {
      assert.ok(
        buttonComponent.includes('export function Button'),
        'Should export Button function component'
      );
    });

    test('supports isLoading prop', () => {
      assert.ok(
        buttonComponent.includes('isLoading'),
        'Button should support isLoading prop'
      );
    });

    test('includes Spinner component', () => {
      assert.ok(
        buttonComponent.includes('Spinner'),
        'Button should include Spinner component for loading states'
      );
    });

    test('supports variant prop', () => {
      assert.ok(
        buttonComponent.includes('variant') && 
        (buttonComponent.includes('primary') || buttonComponent.includes('secondary')),
        'Button should support variant prop (primary, secondary, etc.)'
      );
    });

    test('supports disabled state', () => {
      assert.ok(
        buttonComponent.includes('disabled'),
        'Button should support disabled prop'
      );
    });

    test('exports IconButton component', () => {
      assert.ok(
        buttonComponent.includes('export function IconButton'),
        'Should export IconButton component'
      );
    });

    test('IconButton has accessible label', () => {
      assert.ok(
        buttonComponent.includes('aria-label') || 
        buttonComponent.includes('label'),
        'IconButton should have accessible label'
      );
    });
  });

  describe('Skeleton Component', () => {
    test('Skeleton component file exists', () => {
      assert.ok(skeletonComponent, 'Skeleton.tsx should exist');
    });

    test('exports Skeleton component', () => {
      assert.ok(
        skeletonComponent.includes('export function Skeleton'),
        'Should export Skeleton function component'
      );
    });

    test('exports SkeletonCard component', () => {
      assert.ok(
        skeletonComponent.includes('export function SkeletonCard'),
        'Should export SkeletonCard component'
      );
    });

    test('exports SkeletonList component', () => {
      assert.ok(
        skeletonComponent.includes('export function SkeletonList'),
        'Should export SkeletonList component'
      );
    });

    test('Skeleton uses accessible attributes', () => {
      assert.ok(
        skeletonComponent.includes('aria-label') || 
        skeletonComponent.includes('role="status"'),
        'Skeleton should include ARIA attributes'
      );
    });
  });
});

describe('Interactive States - Dashboard Integration', () => {
  const dashboardCardPath = join(projectRoot, 'components/dashboard-card.tsx');
  let dashboardCard;

  try {
    dashboardCard = readFileSync(dashboardCardPath, 'utf-8');
  } catch (err) {
    console.error('Failed to read dashboard-card.tsx:', err);
  }

  test('DashboardCardListItem has focus-visible styles', () => {
    assert.ok(
      dashboardCard.includes('focus-visible:outline'),
      'DashboardCardListItem should have focus-visible outline'
    );
  });

  test('DashboardCardListItem supports keyboard navigation', () => {
    assert.ok(
      dashboardCard.includes('tabIndex') && 
      dashboardCard.includes('onKeyDown'),
      'DashboardCardListItem should support keyboard navigation'
    );
  });

  test('DashboardCardListItem activates on Enter/Space', () => {
    assert.ok(
      (dashboardCard.includes('Enter') || dashboardCard.includes("e.key === 'Enter'")) && 
      (dashboardCard.includes('Space') || dashboardCard.includes("e.key === ' '")),
      'DashboardCardListItem should activate on Enter and Space keys'
    );
  });

  test('DashboardNestedCard has interactive states', () => {
    assert.ok(
      dashboardCard.includes('card-hover-subtle') || 
      dashboardCard.includes('hover:'),
      'DashboardNestedCard should have hover states'
    );
  });

  test('Interactive elements have proper role attributes', () => {
    assert.ok(
      dashboardCard.includes('role='),
      'Interactive elements should have proper ARIA role attributes'
    );
  });
});

describe('Interactive States - Global CSS Import', () => {
  const globalsCssPath = join(projectRoot, 'app/globals.css');
  let globalsContent;

  try {
    globalsContent = readFileSync(globalsCssPath, 'utf-8');
  } catch (err) {
    console.error('Failed to read globals.css:', err);
  }

  test('globals.css imports interactive-states.css', () => {
    assert.ok(
      globalsContent.includes('interactive-states.css'),
      'globals.css should import interactive-states.css'
    );
  });
});

describe('Interactive States - Test Page', () => {
  const testPagePath = join(projectRoot, 'app/dashboard/interactive-test/page.tsx');
  let testPageContent;

  try {
    testPageContent = readFileSync(testPagePath, 'utf-8');
  } catch (err) {
    console.error('Failed to read interactive test page:', err);
  }

  test('interactive test page exists', () => {
    assert.ok(testPageContent, 'Interactive test page should exist');
  });

  test('test page includes focus indicator tests', () => {
    assert.ok(
      testPageContent.includes('Focus') || 
      testPageContent.includes('WCAG'),
      'Test page should include focus indicator tests'
    );
  });

  test('test page includes hover state tests', () => {
    assert.ok(
      testPageContent.includes('Hover') || 
      testPageContent.includes('hover'),
      'Test page should include hover state tests'
    );
  });

  test('test page includes loading state tests', () => {
    assert.ok(
      testPageContent.includes('Loading') || 
      testPageContent.includes('Skeleton'),
      'Test page should include loading state tests'
    );
  });

  test('test page includes keyboard navigation instructions', () => {
    assert.ok(
      testPageContent.includes('Tab') || 
      testPageContent.includes('keyboard'),
      'Test page should include keyboard navigation instructions'
    );
  });
});
