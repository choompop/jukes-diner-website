import test from 'node:test';
import assert from 'node:assert/strict';

import {
  METRICOOL_VISIBILITY_LAYERS,
  SOCIAL_CHANNELS,
  getChannelById,
  getAudienceSegments,
  getDashboardStats,
  getHighPriorityNextActions,
  getMetricoolConnectionChecklist,
  getSlackAgentPlan,
  getWeeklyContentPlan,
} from '../lib/social-dashboard.mjs';

test('social dashboard defines the six external growth channels John outlined', () => {
  assert.deepEqual(
    SOCIAL_CHANNELS.map((channel) => channel.id),
    ['tiktok', 'instagram', 'facebook', 'website', 'phone', 'linkedin'],
  );
});

test('TikTok is positioned for raw behind-the-scenes entrepreneur content', () => {
  const tiktok = getChannelById('tiktok');

  assert.equal(tiktok.name, 'TikTok');
  assert.match(tiktok.audience, /entrepreneurs/i);
  assert.match(tiktok.positioning, /behind-the-scenes/i);
  assert.match(tiktok.contentSystem[0], /raw/i);
});

test('dashboard stats summarize channel health and priorities', () => {
  const stats = getDashboardStats();

  assert.equal(stats.totalChannels, 6);
  assert.equal(stats.liveChannels, 3);
  assert.equal(stats.needsSetup, 3);
  assert.equal(stats.highPriorityActions, 12);
});

test('audience segments separate customer, founder, community, and franchisee plays', () => {
  assert.deepEqual(getAudienceSegments(), [
    'Entrepreneur/operators',
    'Food truck customers',
    'Corporate catering clients',
    'Local community',
    'Potential franchisees',
  ]);
});

test('weekly content plan gives each weekday a clear owner, channel, and deliverable', () => {
  const plan = getWeeklyContentPlan();

  assert.equal(plan.length, 5);
  assert.deepEqual(
    plan.map((item) => item.day),
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  );
  assert.ok(plan.every((item) => item.channelId && item.owner && item.deliverable));
  assert.match(plan[0].deliverable, /catering/i);
});

test('high priority next actions are flattened into an owner-ready punch list', () => {
  const actions = getHighPriorityNextActions();

  assert.equal(actions.length, 12);
  assert.deepEqual(
    [...new Set(actions.map((action) => action.channelId))],
    ['tiktok', 'instagram', 'website', 'phone'],
  );
  assert.ok(actions.every((action) => action.priority === 'high'));
  assert.match(actions.at(-1).action, /phone CTA/i);
});

test('Metricool visibility layers define the operating dashboard John wants', () => {
  assert.deepEqual(
    METRICOOL_VISIBILITY_LAYERS.map((layer) => layer.id),
    ['publishing', 'analytics', 'inbox', 'competitors', 'website'],
  );
  assert.ok(METRICOOL_VISIBILITY_LAYERS.every((layer) => layer.owner && layer.slackSignal));
  assert.match(METRICOOL_VISIBILITY_LAYERS.at(-1).metricoolSource, /web analytics/i);
});

test('Metricool checklist separates keys, profiles, dashboards, and Slack wiring', () => {
  const checklist = getMetricoolConnectionChecklist();

  assert.equal(checklist.length, 4);
  assert.deepEqual(checklist.map((item) => item.status), [
    'needs-key',
    'needs-profile-map',
    'needs-api-route',
    'needs-slack-webhook',
  ]);
  assert.match(checklist[0].envVar, /METRICOOL/i);
});

test('Slack agent plan targets a team channel with daily digest and alerts', () => {
  const plan = getSlackAgentPlan();

  assert.equal(plan.channel, '#jukes-growth');
  assert.deepEqual(plan.cadence, ['daily morning digest', 'real-time lead alerts', 'weekly executive recap']);
  assert.ok(plan.signals.some((signal) => /catering lead/i.test(signal)));
  assert.ok(plan.agentJobs.every((job) => job.name && job.trigger && job.output));
});
