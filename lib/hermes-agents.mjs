/**
 * Hermes Agent Operating System Data Access
 * 
 * Reads agent profiles, GOALS.md, SOUL.md, skills, and current Kanban task assignments
 * from the Hermes agent platform.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import Database from 'better-sqlite3';

const HERMES_BASE_PATH = '/Users/lexi/.hermes';
const PROFILES_PATH = join(HERMES_BASE_PATH, 'profiles');
const KANBAN_DB_PATH = join(HERMES_BASE_PATH, 'kanban.db');

/**
 * Get list of all Juke's agent profiles
 */
export async function getAgentProfiles() {
  const profileDirs = [
    'jukes-coding-agent',
    'jukes-editor',
    'jukes-email-agent',
    'jukes-finance-agent',
    'jukes-librarian',
    'jukes-ops-agent',
    'jukes-qa-agent',
    'jukes-research-agent',
    'jukes-social-agent',
  ];

  const profiles = await Promise.all(
    profileDirs.map(async (profileName) => {
      const profilePath = join(PROFILES_PATH, profileName);
      
      // Read GOALS.md
      let goals = null;
      const goalsPath = join(profilePath, 'GOALS.md');
      if (existsSync(goalsPath)) {
        const content = await readFile(goalsPath, 'utf-8');
        goals = parseGoalsOrSoul(content);
      }

      // Read SOUL.md
      let soul = null;
      const soulPath = join(profilePath, 'SOUL.md');
      if (existsSync(soulPath)) {
        const content = await readFile(soulPath, 'utf-8');
        soul = parseGoalsOrSoul(content);
      }

      // Get skill categories
      const skillsPath = join(profilePath, 'skills');
      let skillCategories = [];
      if (existsSync(skillsPath)) {
        const { readdirSync } = await import('node:fs');
        skillCategories = readdirSync(skillsPath).filter(
          (name) => !name.startsWith('.')
        );
      }

      return {
        name: profileName,
        displayName: formatProfileName(profileName),
        goals,
        soul,
        skillCategories,
        profilePath,
      };
    })
  );

  return profiles;
}

/**
 * Get current Kanban task assignments for all agents
 */
export function getAgentTaskAssignments() {
  if (!existsSync(KANBAN_DB_PATH)) {
    return {};
  }

  const db = new Database(KANBAN_DB_PATH, { readonly: true });
  
  try {
    const tasks = db
      .prepare(
        `SELECT id, title, assignee, status, priority, started_at, created_at
         FROM tasks 
         WHERE status IN ('ready', 'running', 'blocked', 'todo')
         ORDER BY assignee, status, priority DESC`
      )
      .all();

    // Group by assignee
    const byAssignee = {};
    for (const task of tasks) {
      if (!task.assignee) continue;
      if (!byAssignee[task.assignee]) {
        byAssignee[task.assignee] = [];
      }
      byAssignee[task.assignee].push({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        startedAt: task.started_at,
        createdAt: task.created_at,
      });
    }

    return byAssignee;
  } finally {
    db.close();
  }
}

/**
 * Get complete agent roster with profiles, tasks, and status
 */
export async function getAgentRoster() {
  const profiles = await getAgentProfiles();
  const taskAssignments = getAgentTaskAssignments();

  return profiles.map((profile) => {
    const tasks = taskAssignments[profile.name] || [];
    const currentTask = tasks.find((t) => t.status === 'running');
    const readyTasks = tasks.filter((t) => t.status === 'ready');
    const blockedTasks = tasks.filter((t) => t.status === 'blocked');

    return {
      ...profile,
      currentTask,
      readyTasks,
      blockedTasks,
      totalTasks: tasks.length,
      status: currentTask ? 'active' : readyTasks.length > 0 ? 'ready' : 'idle',
    };
  });
}

/**
 * Parse GOALS.md or SOUL.md markdown into structured data
 */
function parseGoalsOrSoul(markdown) {
  const lines = markdown.split('\n');
  let title = '';
  let mission = '';
  let sections = [];
  let currentSection = null;

  for (const line of lines) {
    // Extract H1 title
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
      continue;
    }

    // Extract H2 sections
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line.replace('## ', '').trim(),
        content: [],
      };
      continue;
    }

    // Accumulate content
    if (currentSection && line.trim()) {
      currentSection.content.push(line.trim());
    }

    // Special case: capture first paragraph as mission if no section yet
    if (!currentSection && !mission && line.trim() && !line.startsWith('#')) {
      mission = line.trim();
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // Extract mission from "Mission" section if available
  const missionSection = sections.find(
    (s) => s.heading.toLowerCase() === 'mission'
  );
  if (missionSection && missionSection.content.length > 0) {
    mission = missionSection.content.join(' ');
  }

  return {
    title,
    mission,
    sections,
    raw: markdown,
  };
}

/**
 * Format profile name for display
 */
function formatProfileName(profileName) {
  return profileName
    .replace('jukes-', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get Obsidian notes link for an agent (if configured)
 */
export function getObsidianLink(profileName) {
  // This would need to be configured based on actual Obsidian vault structure
  // For now, return a placeholder
  const agentName = formatProfileName(profileName);
  return `obsidian://open?vault=Hermes&file=Agents/${agentName}`;
}
