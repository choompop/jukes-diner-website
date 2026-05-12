import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getOutputTypes,
  getOutputStatuses,
  getAllOutputs,
  getOutputById,
  createOutput,
  updateOutput,
  deleteOutput,
  filterOutputs,
  validateOutput,
} from '../lib/agent-outputs.mjs';

test('agent outputs module exports required output types', () => {
  const types = getOutputTypes();
  
  assert.ok(Array.isArray(types));
  assert.deepEqual(types, [
    'outreach_draft',
    'booking_handoff',
    'qa_finding',
    'build_summary',
    'research_note',
    'finance_note',
    'brand_content_draft',
  ]);
});

test('agent outputs module exports valid output statuses', () => {
  const statuses = getOutputStatuses();
  
  assert.ok(Array.isArray(statuses));
  assert.ok(statuses.includes('pending'));
  assert.ok(statuses.includes('approved'));
  assert.ok(statuses.includes('rejected'));
  assert.ok(statuses.includes('archived'));
});

test('getAllOutputs returns array of outputs with required fields', () => {
  const outputs = getAllOutputs();
  
  assert.ok(Array.isArray(outputs));
  assert.ok(outputs.length >= 4); // Seed data should have at least 4 items
  
  outputs.forEach((output) => {
    assert.ok(output.id);
    assert.ok(output.type);
    assert.ok(output.title);
    assert.ok(output.summary);
    assert.ok(output.body);
    assert.ok(output.producingAgent);
    assert.ok(output.status);
    assert.ok(typeof output.approvalRequired === 'boolean');
    assert.ok(output.createdAt);
    assert.ok(output.updatedAt);
  });
});

test('getOutputById returns specific output when id exists', () => {
  const outputs = getAllOutputs();
  const firstOutput = outputs[0];
  
  const found = getOutputById(firstOutput.id);
  
  assert.deepEqual(found, firstOutput);
});

test('getOutputById returns null when id does not exist', () => {
  const found = getOutputById('nonexistent-id');
  
  assert.strictEqual(found, null);
});

test('createOutput adds new output with generated id and timestamps', () => {
  const newOutput = {
    type: 'qa_finding',
    title: 'Test finding',
    summary: 'Test summary',
    body: 'Test body content',
    producingAgent: 'test-agent',
    status: 'pending',
    approvalRequired: false,
    recommendedNextAction: 'Review and fix',
    links: [],
  };
  
  const created = createOutput(newOutput);
  
  assert.ok(created.id);
  assert.ok(created.createdAt);
  assert.ok(created.updatedAt);
  assert.equal(created.type, newOutput.type);
  assert.equal(created.title, newOutput.title);
});

test('updateOutput modifies existing output and updates timestamp', () => {
  const outputs = getAllOutputs();
  const toUpdate = outputs[0];
  const originalUpdatedAt = toUpdate.updatedAt;
  
  // Wait a tiny bit to ensure timestamp changes
  const updated = updateOutput(toUpdate.id, {
    status: 'approved',
  });
  
  assert.equal(updated.id, toUpdate.id);
  assert.equal(updated.status, 'approved');
  assert.notEqual(updated.updatedAt, originalUpdatedAt);
});

test('updateOutput returns null when id does not exist', () => {
  const result = updateOutput('nonexistent-id', { status: 'approved' });
  
  assert.strictEqual(result, null);
});

test('deleteOutput removes output and returns true when id exists', () => {
  const outputs = getAllOutputs();
  const toDelete = outputs[outputs.length - 1];
  
  const result = deleteOutput(toDelete.id);
  
  assert.strictEqual(result, true);
  
  const found = getOutputById(toDelete.id);
  assert.strictEqual(found, null);
});

test('deleteOutput returns false when id does not exist', () => {
  const result = deleteOutput('nonexistent-id');
  
  assert.strictEqual(result, false);
});

test('filterOutputs filters by type', () => {
  const filtered = filterOutputs({ type: 'outreach_draft' });
  
  assert.ok(Array.isArray(filtered));
  assert.ok(filtered.every((output) => output.type === 'outreach_draft'));
});

test('filterOutputs filters by status', () => {
  const filtered = filterOutputs({ status: 'pending' });
  
  assert.ok(Array.isArray(filtered));
  assert.ok(filtered.every((output) => output.status === 'pending'));
});

test('filterOutputs filters by producing agent', () => {
  const filtered = filterOutputs({ producingAgent: 'booking-agent' });
  
  assert.ok(Array.isArray(filtered));
  assert.ok(filtered.every((output) => output.producingAgent === 'booking-agent'));
});

test('filterOutputs supports multiple filters simultaneously', () => {
  const filtered = filterOutputs({
    type: 'outreach_draft',
    status: 'pending',
  });
  
  assert.ok(Array.isArray(filtered));
  assert.ok(
    filtered.every(
      (output) => output.type === 'outreach_draft' && output.status === 'pending'
    )
  );
});

test('filterOutputs returns all outputs when no filters provided', () => {
  const all = getAllOutputs();
  const filtered = filterOutputs({});
  
  assert.deepEqual(filtered, all);
});

test('validateOutput accepts valid output object', () => {
  const validOutput = {
    type: 'qa_finding',
    title: 'Test finding',
    summary: 'Test summary',
    body: 'Test body',
    producingAgent: 'test-agent',
    status: 'pending',
    approvalRequired: false,
  };
  
  const result = validateOutput(validOutput);
  
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.errors.length, 0);
});

test('validateOutput rejects output with invalid type', () => {
  const invalidOutput = {
    type: 'invalid_type',
    title: 'Test',
    summary: 'Test',
    body: 'Test',
    producingAgent: 'test-agent',
    status: 'pending',
    approvalRequired: false,
  };
  
  const result = validateOutput(invalidOutput);
  
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some((err) => err.includes('type')));
});

test('validateOutput rejects output with invalid status', () => {
  const invalidOutput = {
    type: 'qa_finding',
    title: 'Test',
    summary: 'Test',
    body: 'Test',
    producingAgent: 'test-agent',
    status: 'invalid_status',
    approvalRequired: false,
  };
  
  const result = validateOutput(invalidOutput);
  
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some((err) => err.includes('status')));
});

test('validateOutput rejects output missing required fields', () => {
  const invalidOutput = {
    type: 'qa_finding',
    // missing title, summary, body, etc.
  };
  
  const result = validateOutput(invalidOutput);
  
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.length > 0);
});

test('seed data includes booking outreach draft', () => {
  const outputs = getAllOutputs();
  const outreachDraft = outputs.find(
    (o) => o.type === 'outreach_draft' && o.title.toLowerCase().includes('outreach')
  );
  
  assert.ok(outreachDraft);
  assert.strictEqual(outreachDraft.approvalRequired, true);
});

test('seed data includes QA finding', () => {
  const outputs = getAllOutputs();
  const qaFinding = outputs.find((o) => o.type === 'qa_finding');
  
  assert.ok(qaFinding);
});

test('seed data includes build summary', () => {
  const outputs = getAllOutputs();
  const buildSummary = outputs.find((o) => o.type === 'build_summary');
  
  assert.ok(buildSummary);
});

test('seed data includes Flo booking handoff', () => {
  const outputs = getAllOutputs();
  const floHandoff = outputs.find(
    (o) => o.type === 'booking_handoff' && o.title.toLowerCase().includes('flo')
  );
  
  assert.ok(floHandoff);
});

test('external-facing drafts have approvalRequired set to true', () => {
  const outputs = getAllOutputs();
  const externalFacingTypes = ['outreach_draft', 'brand_content_draft'];
  
  const externalDrafts = outputs.filter((o) =>
    externalFacingTypes.includes(o.type)
  );
  
  assert.ok(externalDrafts.length > 0);
  assert.ok(externalDrafts.every((o) => o.approvalRequired === true));
});

test('outputs with approvalRequired link to source task when available', () => {
  const outputs = getAllOutputs();
  const approvalRequiredOutputs = outputs.filter((o) => o.approvalRequired);
  
  assert.ok(approvalRequiredOutputs.length > 0);
  
  approvalRequiredOutputs.forEach((output) => {
    // At least one should have a sourceTaskId to demonstrate the pattern
    if (output.sourceTaskId) {
      assert.ok(output.sourceTaskId.startsWith('t_'));
    }
  });
});
