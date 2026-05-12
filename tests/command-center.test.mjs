import test from 'node:test';
import assert from 'node:assert/strict';

import {
  COMMAND_CENTER_SECTIONS,
  getTodaysPriorities,
  getBookingsAndLeads,
  getOpenOpsIssues,
  getMediaApprovals,
  getFinancialPulse,
  getSOPShortcuts,
  getBlockersNeedingJohn,
  getOperatorDashboardStats,
} from '../lib/command-center.mjs';

test('command center defines seven operator sections', () => {
  assert.deepEqual(
    COMMAND_CENTER_SECTIONS.map((section) => section.id),
    [
      'todays-priorities',
      'bookings-leads',
      'ops-issues',
      'media-approvals',
      'financial-pulse',
      'sop-shortcuts',
      'blockers',
    ],
  );
});

test('each command center section has label, icon, and description for operator clarity', () => {
  assert.ok(
    COMMAND_CENTER_SECTIONS.every(
      (section) => section.label && section.icon && section.description
    )
  );
  assert.match(COMMAND_CENTER_SECTIONS[0].description, /what to do/i);
});

test("today's priorities surface urgent tasks sorted by deadline", () => {
  const priorities = getTodaysPriorities();

  assert.ok(Array.isArray(priorities));
  assert.ok(priorities.length >= 3);
  assert.ok(
    priorities.every(
      (item) =>
        item.id && item.title && item.priority && item.dueBy && item.owner
    )
  );
  assert.equal(priorities[0].priority, 'urgent');
});

test('bookings and leads show event pipeline with status and next action', () => {
  const bookings = getBookingsAndLeads();

  assert.ok(Array.isArray(bookings));
  assert.ok(bookings.length >= 2);
  assert.ok(
    bookings.every(
      (item) =>
        item.id &&
        item.type &&
        item.name &&
        item.status &&
        item.nextAction &&
        item.value
    )
  );
  assert.ok(bookings.some((item) => item.type === 'booking'));
  assert.ok(bookings.some((item) => item.type === 'lead'));
});

test('open ops issues identify blockers with severity and owner assignment', () => {
  const issues = getOpenOpsIssues();

  assert.ok(Array.isArray(issues));
  assert.ok(
    issues.every(
      (item) =>
        item.id && item.title && item.severity && item.assignedTo && item.status
    )
  );
  assert.deepEqual(
    [...new Set(issues.map((item) => item.severity))].sort(),
    ['high', 'low', 'medium'],
  );
});

test('media approvals list pending content with type and submitter', () => {
  const approvals = getMediaApprovals();

  assert.ok(Array.isArray(approvals));
  assert.ok(
    approvals.every(
      (item) =>
        item.id &&
        item.title &&
        item.type &&
        item.submittedBy &&
        item.submittedAt &&
        item.previewUrl
    )
  );
  assert.ok(approvals.some((item) => item.type === 'video'));
  assert.ok(approvals.some((item) => item.type === 'image'));
});

test('financial pulse shows safe read-only metrics without live money movement', () => {
  const pulse = getFinancialPulse();

  assert.ok(pulse.todaySales);
  assert.ok(pulse.weekToDate);
  assert.ok(pulse.monthToDate);
  assert.ok(pulse.pendingPayouts);
  assert.ok(pulse.lowInventoryAlert);
  
  // Verify this is read-only data, not live transactions
  assert.equal(typeof pulse.todaySales, 'string');
  assert.match(pulse.todaySales, /^\$/);
});

test('SOP shortcuts point to common operator procedures', () => {
  const shortcuts = getSOPShortcuts();

  assert.ok(Array.isArray(shortcuts));
  assert.ok(shortcuts.length >= 4);
  assert.ok(
    shortcuts.every(
      (item) => item.id && item.title && item.category && item.path
    )
  );
  assert.ok(shortcuts.some((item) => item.category === 'daily-ops'));
  assert.ok(shortcuts.some((item) => item.category === 'emergency'));
});

test('blockers needing John highlight escalation items with context', () => {
  const blockers = getBlockersNeedingJohn();

  assert.ok(Array.isArray(blockers));
  assert.ok(
    blockers.every(
      (item) =>
        item.id &&
        item.title &&
        item.blockedSince &&
        item.requestedBy &&
        item.context
    )
  );
  assert.ok(blockers[0].blockedSince);
});

test('operator dashboard stats summarize health at a glance', () => {
  const stats = getOperatorDashboardStats();

  assert.ok(stats.urgentTasks);
  assert.ok(stats.todayBookings);
  assert.ok(stats.openIssues);
  assert.ok(stats.pendingApprovals);
  assert.ok(stats.blockersNeedingJohn);
  
  assert.equal(typeof stats.urgentTasks, 'number');
  assert.equal(typeof stats.todayBookings, 'number');
  assert.equal(typeof stats.openIssues, 'number');
});

test('weather icon helper returns valid icon and color for all conditions', async () => {
  const { getWeatherIconConfig } = await import('../lib/weather-icons.mjs');
  
  const conditions = ['Clear', 'Sunny', 'Partly Cloudy', 'Rainy', 'Snowy', 'Foggy'];
  const validIcons = ['Sun', 'Cloud', 'CloudRain', 'CloudSnow', 'CloudFog'];
  const validColors = ['red', 'teal', 'orange', 'purple', 'blue'];
  
  conditions.forEach(condition => {
    const config = getWeatherIconConfig(condition);
    assert.ok(validIcons.includes(config.icon), `Invalid icon for ${condition}: ${config.icon}`);
    assert.ok(validColors.includes(config.color), `Invalid color for ${condition}: ${config.color}`);
  });
  
  // Test unknown condition gracefully falls back to valid values
  const unknownConfig = getWeatherIconConfig('Unknown Weather Type');
  assert.ok(validIcons.includes(unknownConfig.icon));
  assert.ok(validColors.includes(unknownConfig.color));
});
