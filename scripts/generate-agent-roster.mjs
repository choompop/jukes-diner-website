#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROFILES_DIR = '/Users/lexi/.hermes/profiles';
const KANBAN_DB = '/Users/lexi/.hermes/kanban.db';
const OUTPUT_FILE = join(dirname(__dirname), 'data', 'agent-roster.json');
const PUBLIC_OUTPUT_FILE = join(dirname(__dirname), 'public', 'data', 'agent-roster.json');

// Read all profiles when the local Hermes profile directory exists.
// Vercel/production builds do not have /Users/lexi/.hermes, so fall back
// to an empty generated roster instead of failing the website build.
const profiles = existsSync(PROFILES_DIR)
  ? readdirSync(PROFILES_DIR).filter(name => {
      try {
        return statSync(join(PROFILES_DIR, name)).isDirectory();
      } catch {
        return false;
      }
    })
  : [];

// Parse GOALS.md
function parseGoals(profileName) {
  const goalsPath = join(PROFILES_DIR, profileName, 'GOALS.md');
  try {
    const content = readFileSync(goalsPath, 'utf-8');
    const lines = content.split('\n');
    
    let mission = '';
    let currentSection = '';
    const sections = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('## Mission')) {
        currentSection = 'mission';
      } else if (trimmed.startsWith('##')) {
        currentSection = trimmed.replace(/^##\s*/, '').toLowerCase().replace(/\s+/g, '_');
        sections[currentSection] = [];
      } else if (currentSection === 'mission' && trimmed && !trimmed.startsWith('#')) {
        mission = trimmed;
        currentSection = '';
      } else if (currentSection && trimmed && !trimmed.startsWith('#')) {
        if (!sections[currentSection]) sections[currentSection] = [];
        sections[currentSection].push(trimmed);
      }
    }
    
    return { mission, sections };
  } catch (err) {
    return { mission: 'No mission defined', sections: {} };
  }
}

// Query active kanban tasks using sqlite3 CLI
function getActiveTasks() {
  try {
    if (!existsSync(KANBAN_DB)) {
      console.error('Kanban database not found');
      return [];
    }
    
    const query = `SELECT id, title, assignee, status, priority, created_at FROM tasks WHERE status IN ('ready', 'running', 'blocked') ORDER BY priority DESC, created_at ASC;`;
    const result = execSync(`sqlite3 -json "${KANBAN_DB}" "${query}"`, { encoding: 'utf-8' });
    
    if (!result.trim()) return [];
    return JSON.parse(result);
  } catch (err) {
    console.error('Failed to read kanban database:', err.message);
    return [];
  }
}

// Build roster
const activeTasks = getActiveTasks();
const tasksByAssignee = {};
const unassignedTasks = [];

activeTasks.forEach(task => {
  if (!task.assignee) {
    unassignedTasks.push({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority
    });
  } else {
    if (!tasksByAssignee[task.assignee]) {
      tasksByAssignee[task.assignee] = [];
    }
    tasksByAssignee[task.assignee].push({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority
    });
  }
});

const roster = profiles.map(profileName => {
  const { mission, sections } = parseGoals(profileName);
  const tasks = tasksByAssignee[profileName] || [];
  
  return {
    profile: profileName,
    mission,
    working_rules: sections.working_rules || sections.core_jobs || [],
    guardrails: sections.guardrails || [],
    active_tasks: tasks,
    task_count: tasks.length
  };
});

// Sort by task count (busiest first) then alphabetically
roster.sort((a, b) => {
  if (b.task_count !== a.task_count) return b.task_count - a.task_count;
  return a.profile.localeCompare(b.profile);
});

// Write output
const output = {
  generated_at: new Date().toISOString(),
  profile_count: roster.length,
  total_active_tasks: activeTasks.length,
  unassigned_tasks: unassignedTasks,
  agents: roster
};

const serializedOutput = JSON.stringify(output, null, 2);
mkdirSync(join(dirname(__dirname), 'data'), { recursive: true });
mkdirSync(join(dirname(__dirname), 'public', 'data'), { recursive: true });
writeFileSync(OUTPUT_FILE, serializedOutput);
writeFileSync(PUBLIC_OUTPUT_FILE, serializedOutput);
console.log(`Generated roster with ${roster.length} agents and ${activeTasks.length} active tasks`);
console.log(`Output: ${OUTPUT_FILE}`);
console.log(`Public output: ${PUBLIC_OUTPUT_FILE}`);
