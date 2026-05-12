import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';

import {
  createDefaultFinancialManagement,
  getFinancialManagementStats,
  getFinancialScorecard,
  getFinancialVisibilitySections,
  getFinancialObligationSummary,
  getFinancialDocumentReadiness,
  getFinancialActionQueue,
  getFinancialUnits,
  getWeeklyUnitCashflow,
  getConsolidatedWeeklyCashflow,
  getStripeAccountReadiness,
  readFinancialManagement,
  writeFinancialManagement,
} from '../lib/franchise-financials.mjs';

test('default financial management model covers franchise control layers', () => {
  const model = createDefaultFinancialManagement();

  assert.deepEqual(model.layers.map((layer) => layer.id), [
    'sales-and-cash',
    'prime-costs',
    'unit-economics',
    'compliance-and-royalties',
  ]);
  assert.ok(model.layers.every((layer) => layer.metrics.length >= 3));
  assert.ok(model.referenceFiles.some((file) => file.id === 'weekly-finance-rhythm'));
});

test('financial stats calculate prime cost margin and available cash visibility', () => {
  const stats = getFinancialManagementStats(createDefaultFinancialManagement());

  assert.equal(stats.weeklySales, 8420);
  assert.equal(stats.cashOnHand, 38400);
  assert.equal(stats.foodCostPercent, 28.4);
  assert.equal(stats.laborCostPercent, 18.2);
  assert.equal(stats.primeCostPercent, 46.6);
  assert.equal(stats.estimatedOperatingProfitPercent, 32);
});

test('financial scorecard flags what a franchise operator should review first', () => {
  const scorecard = getFinancialScorecard(createDefaultFinancialManagement());

  assert.equal(scorecard.status, 'healthy-watch');
  assert.ok(scorecard.alerts.some((alert) => /labor/i.test(alert.title)));
  assert.ok(scorecard.nextActions.some((action) => /weekly cash/i.test(action.toLowerCase())));
});

test('financial visibility sections separate owner CFO franchisor and operator views', () => {
  const sections = getFinancialVisibilitySections(createDefaultFinancialManagement());

  assert.deepEqual(sections.map((section) => section.id), [
    'operator-daily-view',
    'owner-cash-view',
    'franchisor-scoreboard',
    'exception-review',
  ]);
  assert.ok(sections.every((section) => section.questions.length >= 2));
});

test('financial management storage persists local JSON cleanly', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'franchise-financials-'));
  const filePath = path.join(tempDir, 'financials.json');

  await writeFinancialManagement(createDefaultFinancialManagement(), filePath);
  const reloaded = await readFinancialManagement(filePath);

  assert.equal(reloaded.title, "Juke's Diner Financial Management");
  assert.equal(getFinancialManagementStats(reloaded).primeCostPercent, 46.6);

  await rm(tempDir, { recursive: true, force: true });
});

test('financial obligations summarize bills royalties taxes and owner decisions', () => {
  const summary = getFinancialObligationSummary(createDefaultFinancialManagement());

  assert.equal(summary.totalDue, 4120);
  assert.equal(summary.dueSoon, 3);
  assert.ok(summary.items.some((item) => item.id === 'sales-tax-reserve' && item.priority === 'high'));
});

test('financial document readiness shows missing source docs before close', () => {
  const readiness = getFinancialDocumentReadiness(createDefaultFinancialManagement());

  assert.equal(readiness.required, 8);
  assert.equal(readiness.complete, 5);
  assert.equal(readiness.percentComplete, 62.5);
  assert.deepEqual(readiness.missing.map((doc) => doc.id), ['labor-report', 'vendor-invoices', 'royalty-calculation']);
});

test('financial action queue combines exceptions obligations and missing documents', () => {
  const queue = getFinancialActionQueue(createDefaultFinancialManagement());

  assert.ok(queue.length >= 5);
  assert.equal(queue[0].priority, 'urgent');
  assert.ok(queue.some((item) => item.source === 'missing-document'));
  assert.ok(queue.some((item) => item.source === 'obligation'));
});

test('financial model defines the four operating accounts John wants in weekly view', () => {
  const units = getFinancialUnits(createDefaultFinancialManagement());

  assert.deepEqual(units.map((unit) => unit.id), [
    'event-truck',
    'trailer-park',
    'east-nashville',
    'corporate-account',
  ]);
  assert.ok(units.every((unit) => unit.stripe.accountKey && unit.stripe.mode === 'connect'));
});

test('weekly unit cashflow separates revenue cogs labor fixed ops and shows positive or negative cashflow', () => {
  const model = createDefaultFinancialManagement();
  const eventTruck = getWeeklyUnitCashflow(model, 'event-truck');
  const trailerPark = getWeeklyUnitCashflow(model, 'trailer-park');

  assert.equal(eventTruck.sales, 18450);
  assert.equal(eventTruck.cogs, 5351);
  assert.equal(eventTruck.labor, 3911);
  assert.equal(eventTruck.fixedOperations, 800);
  assert.equal(eventTruck.netCashflow, 5275);
  assert.equal(eventTruck.cashflowStatus, 'positive');
  assert.equal(trailerPark.cashflowStatus, 'negative');
  assert.ok(trailerPark.actionRequired);
});

test('consolidated weekly cashflow aggregates all units and keeps unit-level coaching flags', () => {
  const consolidated = getConsolidatedWeeklyCashflow(createDefaultFinancialManagement());

  assert.equal(consolidated.units, 4);
  assert.equal(consolidated.sales, 50100);
  assert.equal(consolidated.netCashflow, 9060);
  assert.equal(consolidated.cashflowStatus, 'positive');
  assert.deepEqual(consolidated.negativeUnits.map((unit) => unit.id), ['trailer-park']);
});

test('stripe readiness reports missing env without exposing the secret key', () => {
  const readiness = getStripeAccountReadiness(createDefaultFinancialManagement(), {
    STRIPE_SECRET_KEY: '',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_present',
  });

  assert.equal(readiness.secretKeyPresent, false);
  assert.equal(readiness.publishableKeyPresent, true);
  assert.equal(readiness.readyForLiveSync, false);
  assert.ok(readiness.accounts.every((account) => account.accountIdEnv));
});
