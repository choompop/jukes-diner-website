'use client';

import { useState } from 'react';
import { Button, IconButton, Spinner } from '../../../components/Button';
import { Skeleton, SkeletonCard, SkeletonList, SkeletonText } from '../../../components/Skeleton';
import { DashboardCard, DashboardCardListItem, DashboardNestedCard } from '../../../components/dashboard-card';
import { CheckCircle, Settings, Trash2, AlertCircle } from 'lucide-react';

/**
 * Interactive States Test Page
 * 
 * Comprehensive test of all interactive states:
 * - Hover states
 * - Focus indicators
 * - Loading states
 * - Disabled states
 * - Active/pressed states
 */
export default function InteractiveStatesTest() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingTest = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 bg-diner-cream min-h-screen">
      <div>
        <h1 className="text-4xl font-display mb-2">Interactive States Test</h1>
        <p className="text-gray-600">
          WCAG 2.1 AA compliant focus indicators, hover, loading, and disabled states.
          <br />
          <strong>Test with keyboard:</strong> Press Tab to navigate, Enter/Space to activate.
        </p>
      </div>

      {/* ====== FOCUS INDICATORS ====== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display text-diner-red">
          1. Focus Indicators (WCAG 2.1 AA - HIGH Priority)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Press <kbd className="px-2 py-1 bg-gray-200 rounded">Tab</kbd> to navigate.
          All interactive elements should show a visible red outline.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard title="Focus Test - Buttons">
            <div className="space-y-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </DashboardCard>

          <DashboardCard title="Focus Test - Links & Inputs">
            <div className="space-y-3">
              <a
                href="#test"
                className="text-diner-red hover:underline block"
              >
                Test Link (should have red outline on focus)
              </a>
              <input
                type="text"
                placeholder="Test input field"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline focus:outline-2 focus:outline-diner-red"
              />
              <select 
                aria-label="Test select dropdown"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline focus:outline-2 focus:outline-diner-red"
              >
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          </DashboardCard>
        </div>
      </section>

      {/* ====== HOVER STATES ====== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display text-diner-red">
          2. Hover States (UX Best Practice - MEDIUM Priority)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Hover over elements to see visual feedback (lift, shadow, background change).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-display text-lg mb-2">Hoverable Card</h3>
            <p className="text-sm text-gray-600">Should lift and show shadow on hover</p>
          </div>

          <div className="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-display text-lg mb-2">Hoverable Card</h3>
            <p className="text-sm text-gray-600">Should lift and show shadow on hover</p>
          </div>

          <div className="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-display text-lg mb-2">Hoverable Card</h3>
            <p className="text-sm text-gray-600">Should lift and show shadow on hover</p>
          </div>
        </div>

        <DashboardCard title="Interactive List Items">
          <div className="space-y-0 divide-y divide-gray-50">
            <DashboardCardListItem onClick={() => alert('Clicked item 1')}>
              <div className="flex items-center justify-between">
                <span>Clickable List Item 1</span>
                <span className="text-xs text-gray-500">Hover & click me</span>
              </div>
            </DashboardCardListItem>
            <DashboardCardListItem onClick={() => alert('Clicked item 2')}>
              <div className="flex items-center justify-between">
                <span>Clickable List Item 2</span>
                <span className="text-xs text-gray-500">Hover & click me</span>
              </div>
            </DashboardCardListItem>
            <DashboardCardListItem onClick={() => alert('Clicked item 3')}>
              <div className="flex items-center justify-between">
                <span>Clickable List Item 3</span>
                <span className="text-xs text-gray-500">Hover & click me</span>
              </div>
            </DashboardCardListItem>
          </div>
        </DashboardCard>
      </section>

      {/* ====== BUTTON STATES ====== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display text-diner-red">
          3. Button States (Hover, Active, Disabled)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Hover, click (active state), and disabled variants.
        </p>

        <DashboardCard title="Button Variants">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500">PRIMARY</p>
              <Button variant="primary" size="md">
                Hover Me
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500">SECONDARY</p>
              <Button variant="secondary" size="md">
                Hover Me
              </Button>
              <Button variant="secondary" size="md" disabled>
                Disabled
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500">DANGER</p>
              <Button variant="danger" size="md">
                Hover Me
              </Button>
              <Button variant="danger" size="md" disabled>
                Disabled
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500">GHOST</p>
              <Button variant="ghost" size="md">
                Hover Me
              </Button>
              <Button variant="ghost" size="md" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Icon Buttons">
          <div className="flex gap-3">
            <IconButton icon={<Settings size={20} />} label="Settings" />
            <IconButton icon={<CheckCircle size={20} />} label="Approve" />
            <IconButton icon={<Trash2 size={20} />} label="Delete" />
            <IconButton icon={<AlertCircle size={20} />} label="Alert" disabled />
          </div>
        </DashboardCard>
      </section>

      {/* ====== LOADING STATES ====== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display text-diner-red">
          4. Loading States (MEDIUM Priority)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Skeleton loaders for initial page load, spinners for async actions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard title="Loading Button">
            <div className="space-y-3">
              <Button
                variant="primary"
                isLoading={isLoading}
                onClick={handleLoadingTest}
              >
                {isLoading ? 'Loading...' : 'Click to Test Loading'}
              </Button>
              <Button variant="secondary" isLoading>
                Always Loading
              </Button>
              <div className="flex items-center gap-2">
                <Spinner size={20} />
                <span className="text-sm">Standalone Spinner</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Skeleton Loaders">
            <SkeletonText lines={3} />
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        <DashboardCard title="Skeleton List">
          <SkeletonList count={3} />
        </DashboardCard>
      </section>

      {/* ====== NESTED CARDS ====== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display text-diner-red">
          5. Nested Interactive Cards
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Cards within cards with subtle hover effects.
        </p>

        <DashboardCard title="Media Approvals">
          <div className="space-y-3">
            <DashboardNestedCard>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm">Instagram Post #1</span>
                <span className="text-xs text-gray-500">Pending review</span>
              </div>
            </DashboardNestedCard>
            <DashboardNestedCard>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm">Instagram Post #2</span>
                <span className="text-xs text-gray-500">Pending review</span>
              </div>
            </DashboardNestedCard>
            <DashboardNestedCard>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm">Instagram Post #3</span>
                <span className="text-xs text-gray-500">Pending review</span>
              </div>
            </DashboardNestedCard>
          </div>
        </DashboardCard>
      </section>

      {/* ====== ACCESSIBILITY TEST ====== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display text-diner-red">
          6. Keyboard Navigation Test
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Navigate using Tab, Shift+Tab, Enter, and Space keys.
        </p>

        <DashboardCard title="Keyboard Test Checklist">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-diner-teal mt-0.5" />
              <span>
                <strong>Tab navigation:</strong> Focus moves logically through all interactive elements
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-diner-teal mt-0.5" />
              <span>
                <strong>Focus visibility:</strong> Red outline appears on every focused element
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-diner-teal mt-0.5" />
              <span>
                <strong>Enter/Space activation:</strong> Buttons and links activate with keyboard
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-diner-teal mt-0.5" />
              <span>
                <strong>Skip to content:</strong> No focus traps, can navigate backward with Shift+Tab
              </span>
            </li>
          </ul>
        </DashboardCard>
      </section>

      {/* ====== MOBILE TOUCH TEST ====== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display text-diner-red">
          7. Mobile Touch Targets
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          All interactive elements meet 44x44px minimum touch target size.
        </p>

        <DashboardCard title="Touch Target Test">
          <div className="flex flex-wrap gap-2">
            <button className="touch-target bg-diner-red text-white rounded-lg px-4 font-display">
              44x44px
            </button>
            <button className="touch-target bg-diner-teal text-white rounded-lg px-4 font-display">
              44x44px
            </button>
            <button className="touch-target bg-gray-200 text-gray-800 rounded-lg px-4 font-display">
              44x44px
            </button>
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}
