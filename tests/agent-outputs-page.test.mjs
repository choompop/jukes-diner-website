import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const OUTPUTS_PAGE_PATH = path.join(process.cwd(), 'app', 'dashboard', 'outputs', 'page.tsx');
const NAV_COMPONENT_PATH = path.join(process.cwd(), 'app', 'dashboard', 'components', 'DashboardLayout.tsx');

test('outputs page file exists and exports default component', () => {
  const pageContent = readFileSync(OUTPUTS_PAGE_PATH, 'utf8');
  
  assert.ok(pageContent.includes('export default function'));
  assert.ok(pageContent.includes('AgentOutputs') || pageContent.includes('Outputs'));
});

test('outputs page imports agent-outputs module', () => {
  const pageContent = readFileSync(OUTPUTS_PAGE_PATH, 'utf8');
  
  assert.ok(pageContent.includes('agent-outputs'));
});

test('outputs page has filters for type, status, and producing agent', () => {
  const pageContent = readFileSync(OUTPUTS_PAGE_PATH, 'utf8');
  
  assert.ok(pageContent.toLowerCase().includes('filter'));
  assert.ok(pageContent.toLowerCase().includes('type') || pageContent.toLowerCase().includes('status'));
});

test('outputs page displays approval required warnings', () => {
  const pageContent = readFileSync(OUTPUTS_PAGE_PATH, 'utf8');
  
  assert.ok(
    pageContent.includes('approval') || 
    pageContent.includes('Needs John') ||
    pageContent.includes('not sent')
  );
});

test('dashboard navigation includes Agent Outputs link in Hermes/Kanban section', () => {
  const navContent = readFileSync(NAV_COMPONENT_PATH, 'utf8');
  
  assert.ok(navContent.includes('Agent Outputs'));
  assert.ok(navContent.includes('/dashboard/outputs'));
});

test('Agent Outputs nav link is positioned near Workflow', () => {
  const navContent = readFileSync(NAV_COMPONENT_PATH, 'utf8');
  
  // Find the Hermes / Kanban section
  const hermesSection = navContent.match(/label:\s*['"]Hermes\s*\/\s*Kanban['"][^}]+items:\s*\[([^\]]+)\]/s);
  
  assert.ok(hermesSection, 'Should have Hermes / Kanban section');
  
  const sectionItems = hermesSection[1];
  assert.ok(sectionItems.includes('Workflow'));
  assert.ok(sectionItems.includes('Agent Outputs'));
});
