#!/usr/bin/env node

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const KANBAN_DB = '/Users/lexi/.hermes/kanban.db';
const OUTPUT_FILE = join(dirname(__dirname), 'data', 'kanban-board.json');

// Query active tasks using sqlite3 CLI
function queryDB(query) {
  try {
    if (!existsSync(KANBAN_DB)) {
      console.error('Kanban database not found');
      return [];
    }
    
    const result = execSync(`sqlite3 -json "${KANBAN_DB}" "${query}"`, { encoding: 'utf-8' });
    
    if (!result.trim()) return [];
    return JSON.parse(result);
  } catch (err) {
    console.error('Failed to query kanban database:', err.message);
    return [];
  }
}

// Get all tasks with their relationships
function getTasks() {
  const query = `
    SELECT 
      t.id, 
      t.title, 
      t.body,
      t.assignee, 
      t.status, 
      t.priority, 
      t.created_at,
      t.started_at,
      t.completed_at,
      t.current_run_id
    FROM tasks t 
    ORDER BY t.priority DESC, t.created_at ASC;
  `;
  return queryDB(query);
}

// Get task links (parent-child relationships)
function getTaskLinks() {
  const query = `SELECT parent_id, child_id FROM task_links;`;
  return queryDB(query);
}

// Get task runs with metadata
function getTaskRuns() {
  const query = `
    SELECT 
      id,
      task_id,
      profile,
      status,
      outcome,
      summary,
      metadata,
      started_at,
      ended_at
    FROM task_runs
    WHERE ended_at IS NOT NULL
    ORDER BY ended_at DESC;
  `;
  return queryDB(query);
}

// Classify task type based on title, body, and assignee
function classifyTask(task) {
  const title = task.title.toLowerCase();
  const body = (task.body || '').toLowerCase();
  const assignee = task.assignee || '';
  
  // Review task patterns
  if (
    title.includes('review') ||
    title.includes('qa') ||
    title.includes('dogfood') ||
    assignee === 'jukes-qa-agent' ||
    body.includes('review') && body.includes('acceptance')
  ) {
    return 'review';
  }
  
  // Finding/fix task patterns
  if (
    title.includes('fix') ||
    title.includes('bug') ||
    title.includes('issue') ||
    title.includes('finding') ||
    body.includes('blocker:') ||
    body.includes('security:') ||
    body.includes('remediate')
  ) {
    return 'finding';
  }
  
  // Specification/triage tasks
  if (
    task.status === 'triage' ||
    assignee === 'jukes-librarian' ||
    title.includes('specify') ||
    title.includes('triage')
  ) {
    return 'triage';
  }
  
  return 'task';
}

// Build the enhanced task board
const tasks = getTasks();
const links = getTaskLinks();
const runs = getTaskRuns();

// Build relationship maps
const childrenByParent = {};
const parentsByChild = {};

links.forEach(link => {
  if (!childrenByParent[link.parent_id]) {
    childrenByParent[link.parent_id] = [];
  }
  childrenByParent[link.parent_id].push(link.child_id);
  
  if (!parentsByChild[link.child_id]) {
    parentsByChild[link.child_id] = [];
  }
  parentsByChild[link.child_id].push(link.parent_id);
});

// Build runs map
const runsByTask = {};
runs.forEach(run => {
  if (!runsByTask[run.task_id]) {
    runsByTask[run.task_id] = [];
  }
  runsByTask[run.task_id].push(run);
});

// Enhance tasks with classification and relationships
const enhancedTasks = tasks.map(task => {
  const taskType = classifyTask(task);
  const children = childrenByParent[task.id] || [];
  const parents = parentsByChild[task.id] || [];
  const taskRuns = runsByTask[task.id] || [];
  
  // Determine review status
  let reviewStatus = null;
  
  if (task.status === 'done' && taskType === 'task') {
    // Check if this task has a review child
    const reviewChildren = children
      .map(childId => tasks.find(t => t.id === childId))
      .filter(child => child && classifyTask(child).includes('review'));
    
    if (reviewChildren.length > 0) {
      const reviewChild = reviewChildren[0];
      if (reviewChild.status === 'done') {
        // Check if review created any finding/fix children
        const findingGrandchildren = (childrenByParent[reviewChild.id] || [])
          .map(grandchildId => tasks.find(t => t.id === grandchildId))
          .filter(grandchild => grandchild && classifyTask(grandchild) === 'finding');
        
        if (findingGrandchildren.length > 0) {
          const allFindingsResolved = findingGrandchildren.every(f => f.status === 'done');
          reviewStatus = allFindingsResolved ? 'approved_with_fixes' : 'pending_fixes';
        } else {
          reviewStatus = 'approved';
        }
      } else if (reviewChild.status === 'blocked') {
        reviewStatus = 'blocked_review';
      } else {
        reviewStatus = 'pending_review';
      }
    } else {
      reviewStatus = 'no_review';
    }
  }
  
  return {
    ...task,
    task_type: taskType,
    parent_ids: parents,
    child_ids: children,
    review_status: reviewStatus,
    run_count: taskRuns.length,
    last_run: taskRuns.length > 0 ? taskRuns[0] : null
  };
});

// Group by status
const tasksByStatus = {
  triage: [],
  todo: [],
  ready: [],
  running: [],
  blocked: [],
  done: []
};

enhancedTasks.forEach(task => {
  if (tasksByStatus[task.status]) {
    tasksByStatus[task.status].push(task);
  }
});

// Build output
const output = {
  generated_at: new Date().toISOString(),
  total_tasks: enhancedTasks.length,
  tasks_by_status: {
    triage: tasksByStatus.triage.length,
    todo: tasksByStatus.todo.length,
    ready: tasksByStatus.ready.length,
    running: tasksByStatus.running.length,
    blocked: tasksByStatus.blocked.length,
    done: tasksByStatus.done.length
  },
  tasks_by_type: {
    task: enhancedTasks.filter(t => t.task_type === 'task').length,
    review: enhancedTasks.filter(t => t.task_type === 'review').length,
    finding: enhancedTasks.filter(t => t.task_type === 'finding').length,
    triage: enhancedTasks.filter(t => t.task_type === 'triage').length
  },
  review_status_summary: {
    approved: enhancedTasks.filter(t => t.review_status === 'approved').length,
    approved_with_fixes: enhancedTasks.filter(t => t.review_status === 'approved_with_fixes').length,
    pending_review: enhancedTasks.filter(t => t.review_status === 'pending_review').length,
    pending_fixes: enhancedTasks.filter(t => t.review_status === 'pending_fixes').length,
    blocked_review: enhancedTasks.filter(t => t.review_status === 'blocked_review').length,
    no_review: enhancedTasks.filter(t => t.review_status === 'no_review').length
  },
  lanes: Object.entries(tasksByStatus).map(([status, statusTasks]) => ({
    id: status,
    task_count: statusTasks.length,
    tasks: statusTasks
  })),
  tasks: enhancedTasks
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`Generated kanban view with ${enhancedTasks.length} tasks`);
console.log(`  Review tasks: ${output.tasks_by_type.review}`);
console.log(`  Finding/fix tasks: ${output.tasks_by_type.finding}`);
console.log(`  Tasks pending review: ${output.review_status_summary.pending_review}`);
console.log(`  Tasks approved: ${output.review_status_summary.approved}`);
console.log(`Output: ${OUTPUT_FILE}`);
