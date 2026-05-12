import test from 'node:test';
import assert from 'node:assert/strict';

import { METRIC_CARD_CONFIG } from '../lib/metric-cards.mjs';

test('metric card config defines four operator metric cards', () => {
  assert.deepEqual(
    METRIC_CARD_CONFIG.map((card) => card.id),
    [
      'urgent-tasks',
      'today-bookings',
      'open-issues',
      'media-approvals',
    ],
  );
});

test('each metric card has label, color, and icon for visual hierarchy', () => {
  assert.ok(
    METRIC_CARD_CONFIG.every(
      (card) => card.id && card.label && card.color && card.icon
    )
  );
  
  // Verify color semantic mapping
  assert.equal(METRIC_CARD_CONFIG[0].color, 'red'); // urgent tasks
  assert.equal(METRIC_CARD_CONFIG[1].color, 'teal'); // bookings
  assert.equal(METRIC_CARD_CONFIG[2].color, 'orange'); // issues
  assert.equal(METRIC_CARD_CONFIG[3].color, 'purple'); // approvals
});

test('metric cards include trend data for context', () => {
  assert.ok(
    METRIC_CARD_CONFIG.every(
      (card) => 
        typeof card.showTrend === 'boolean' &&
        card.trendLabel !== undefined
    )
  );
});

test('metric card styling matches unified design system', () => {
  const UNIFIED_STYLES = {
    padding: '20px',
    borderRadius: '12px',
    shadow: 'sm',
  };
  
  assert.ok(
    METRIC_CARD_CONFIG.every(
      (card) => 
        card.styles &&
        card.styles.padding === UNIFIED_STYLES.padding &&
        card.styles.borderRadius === UNIFIED_STYLES.borderRadius &&
        card.styles.shadow === UNIFIED_STYLES.shadow
    )
  );
});

test('metric cards have consistent hover state configuration', () => {
  assert.ok(
    METRIC_CARD_CONFIG.every(
      (card) => card.hoverEffect === 'shadow-increase'
    )
  );
});

test('metric card data includes link to detailed view', () => {
  assert.ok(
    METRIC_CARD_CONFIG.every(
      (card) => card.linkTo && card.linkTo.startsWith('/dashboard/')
    )
  );
});
