import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROSTER_FILE = join(process.cwd(), 'data', 'agent-roster.json');

describe('Agent Roster Model', () => {
  let roster;

  before(() => {
    assert.ok(existsSync(ROSTER_FILE), 'agent-roster.json should exist');
    const content = readFileSync(ROSTER_FILE, 'utf-8');
    roster = JSON.parse(content);
  });

  it('should have required top-level fields', () => {
    assert.ok(roster.generated_at, 'should have generated_at timestamp');
    assert.ok(typeof roster.profile_count === 'number', 'should have profile_count');
    assert.ok(typeof roster.total_active_tasks === 'number', 'should have total_active_tasks');
    assert.ok(Array.isArray(roster.agents), 'should have agents array');
  });

  it('should have at least one agent profile', () => {
    assert.ok(roster.agents.length > 0, 'should have at least one agent');
  });

  it('each agent should have required fields', () => {
    roster.agents.forEach(agent => {
      assert.ok(agent.profile, 'agent should have profile name');
      assert.ok(agent.mission, 'agent should have mission');
      assert.ok(Array.isArray(agent.working_rules), 'agent should have working_rules array');
      assert.ok(Array.isArray(agent.guardrails), 'agent should have guardrails array');
      assert.ok(Array.isArray(agent.active_tasks), 'agent should have active_tasks array');
      assert.ok(typeof agent.task_count === 'number', 'agent should have task_count');
    });
  });

  it('each active task should have required fields', () => {
    roster.agents.forEach(agent => {
      agent.active_tasks.forEach(task => {
        assert.ok(task.id, 'task should have id');
        assert.ok(task.title, 'task should have title');
        assert.ok(task.status, 'task should have status');
        assert.ok(['ready', 'running', 'blocked'].includes(task.status), 'task status should be valid');
      });
    });
  });

  it('task_count should match active_tasks length', () => {
    roster.agents.forEach(agent => {
      assert.equal(agent.task_count, agent.active_tasks.length, 
        `${agent.profile} task_count should match active_tasks length`);
    });
  });

  it('profile_count should match agents array length', () => {
    assert.equal(roster.profile_count, roster.agents.length,
      'profile_count should match agents array length');
  });

  it('total_active_tasks should match sum of all task_counts plus unassigned', () => {
    const assignedSum = roster.agents.reduce((acc, agent) => acc + agent.task_count, 0);
    const unassignedCount = roster.unassigned_tasks ? roster.unassigned_tasks.length : 0;
    assert.equal(roster.total_active_tasks, assignedSum + unassignedCount,
      'total_active_tasks should match sum of all task_counts plus unassigned tasks');
  });
});
