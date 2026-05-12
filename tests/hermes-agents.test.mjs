import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getAgentProfiles,
  getAgentTaskAssignments,
  getAgentRoster,
} from '../lib/hermes-agents.mjs';

test('Hermes Agent Data Access', async (t) => {
  await t.test('should load agent profiles', async () => {
    const profiles = await getAgentProfiles();
    
    assert.ok(Array.isArray(profiles), 'profiles should be an array');
    assert.ok(profiles.length > 0, 'should have at least one profile');
    
    // Check structure of first profile
    const profile = profiles[0];
    assert.ok(profile.name, 'profile should have name');
    assert.ok(profile.displayName, 'profile should have displayName');
    assert.ok(Array.isArray(profile.skillCategories), 'profile should have skillCategories array');
    assert.match(profile.name, /^jukes-/, 'profile name should start with jukes-');
  });

  await t.test('should format profile names correctly', async () => {
    const profiles = await getAgentProfiles();
    
    const codingAgent = profiles.find((p) => p.name === 'jukes-coding-agent');
    assert.equal(codingAgent?.displayName, 'Coding Agent');
    
    const socialAgent = profiles.find((p) => p.name === 'jukes-social-agent');
    assert.equal(socialAgent?.displayName, 'Social Agent');
  });

  await t.test('should parse GOALS.md when present', async () => {
    const profiles = await getAgentProfiles();
    
    const codingAgent = profiles.find((p) => p.name === 'jukes-coding-agent');
    assert.ok(codingAgent?.goals, 'coding agent should have goals');
    assert.ok(codingAgent?.goals?.title, 'goals should have title');
    assert.ok(codingAgent?.goals?.mission, 'goals should have mission');
    assert.ok(Array.isArray(codingAgent?.goals?.sections), 'goals should have sections array');
  });

  await t.test('should get task assignments from Kanban DB', () => {
    const assignments = getAgentTaskAssignments();
    
    assert.ok(typeof assignments === 'object', 'assignments should be an object');
    // May be empty if no tasks are assigned, that's OK
  });

  await t.test('should build complete agent roster', async () => {
    const roster = await getAgentRoster();
    
    assert.ok(Array.isArray(roster), 'roster should be an array');
    assert.ok(roster.length > 0, 'roster should have at least one agent');
    
    // Check structure
    const agent = roster[0];
    assert.ok(agent.name, 'agent should have name');
    assert.ok(agent.displayName, 'agent should have displayName');
    assert.ok(agent.status, 'agent should have status');
    assert.ok(typeof agent.totalTasks === 'number', 'agent should have totalTasks number');
    assert.ok(['active', 'ready', 'idle'].includes(agent.status), 'status should be valid');
  });
});
