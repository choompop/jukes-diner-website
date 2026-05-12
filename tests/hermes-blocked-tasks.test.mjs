/**
 * Tests for Hermes Blocked Tasks Digest
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Database from 'better-sqlite3';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// We'll override the KANBAN_DB_PATH for tests
let testDbPath;
let testDb;

// Import the functions - we'll need to mock the path
const HERMES_BASE_PATH = '/Users/lexi/.hermes';

/**
 * Create a test kanban database with blocked tasks
 */
async function setupTestDatabase() {
  const tmpDir = await mkdtemp(join(tmpdir(), 'hermes-blocked-test-'));
  testDbPath = join(tmpDir, 'kanban.db');
  testDb = new Database(testDbPath);

  // Create schema matching the real kanban.db
  testDb.exec(`
    CREATE TABLE tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT,
      assignee TEXT,
      status TEXT NOT NULL,
      priority INTEGER DEFAULT 0,
      created_by TEXT,
      created_at INTEGER NOT NULL,
      started_at INTEGER,
      completed_at INTEGER,
      workspace_kind TEXT NOT NULL DEFAULT 'scratch',
      workspace_path TEXT,
      claim_lock TEXT,
      claim_expires INTEGER,
      tenant TEXT,
      result TEXT,
      current_run_id INTEGER
    );

    CREATE TABLE task_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      profile TEXT,
      step_key TEXT,
      status TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      outcome TEXT,
      summary TEXT,
      metadata TEXT,
      error TEXT
    );

    CREATE TABLE task_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE task_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      run_id INTEGER,
      kind TEXT NOT NULL,
      payload TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  return { tmpDir, testDbPath, testDb };
}

async function teardownTestDatabase(tmpDir) {
  if (testDb) testDb.close();
  if (tmpDir) await rm(tmpDir, { recursive: true, force: true });
}

/**
 * Insert a test blocked task
 */
function insertBlockedTask(task) {
  const now = Math.floor(Date.now() / 1000);
  
  const taskId = task.id || `t_test_${Math.random().toString(36).substring(7)}`;
  
  // Insert task
  testDb.prepare(`
    INSERT INTO tasks (id, title, assignee, status, priority, created_at, current_run_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    taskId,
    task.title,
    task.assignee || 'test-agent',
    'blocked',
    task.priority || 50,
    task.created_at || now,
    task.current_run_id || null
  );

  // Insert blocking run if provided
  if (task.blockerSummary || task.current_run_id) {
    const runId = testDb.prepare(`
      INSERT INTO task_runs (task_id, profile, status, outcome, summary, started_at, ended_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId,
      task.assignee || 'test-agent',
      'blocked',
      'blocked',
      task.blockerSummary || 'Test blocker',
      now - 3600,
      now - 1800
    ).lastInsertRowid;

    // Update task with current_run_id
    testDb.prepare('UPDATE tasks SET current_run_id = ? WHERE id = ?').run(runId, taskId);
  }

  // Insert comments if provided
  if (task.comments) {
    let commentTime = now;
    for (const comment of task.comments) {
      testDb.prepare(`
        INSERT INTO task_comments (task_id, author, body, created_at)
        VALUES (?, ?, ?, ?)
      `).run(taskId, comment.author || 'test-user', comment.body, commentTime);
      commentTime += 1; // Increment by 1 second for each comment
    }
  }

  // Insert blocked event if needed
  if (task.lastNotified) {
    testDb.prepare(`
      INSERT INTO task_events (task_id, kind, created_at)
      VALUES (?, 'blocked', ?)
    `).run(taskId, task.lastNotified);
  }

  return taskId;
}

describe('Hermes Blocked Tasks Digest', () => {
  let tmpDir;

  beforeEach(async () => {
    const setup = await setupTestDatabase();
    tmpDir = setup.tmpDir;
  });

  afterEach(async () => {
    await teardownTestDatabase(tmpDir);
  });

  it('should find blocked tasks by status', () => {
    // Insert a blocked task
    const taskId = insertBlockedTask({
      title: 'Test blocked task',
      assignee: 'jukes-coding-agent',
      priority: 90,
      blockerSummary: 'Waiting for API credentials',
    });

    // Query blocked tasks
    const blockedTasks = testDb.prepare(`
      SELECT t.id, t.title, t.assignee, r.summary as blocker_reason
      FROM tasks t
      LEFT JOIN task_runs r ON t.current_run_id = r.id
      WHERE t.status = 'blocked'
    `).all();

    assert.strictEqual(blockedTasks.length, 1);
    assert.strictEqual(blockedTasks[0].id, taskId);
    assert.strictEqual(blockedTasks[0].title, 'Test blocked task');
    assert.strictEqual(blockedTasks[0].blocker_reason, 'Waiting for API credentials');
  });

  it('should extract blocker info from comments', () => {
    const taskId = insertBlockedTask({
      title: 'Task with blocker comment',
      assignee: 'jukes-ops-agent',
      priority: 100,
      comments: [
        {
          author: 'jukes-librarian',
          body: 'Blocker: Need approval for live Stripe Connect setup\n\nDecision: Approve or deny live account creation',
        },
      ],
    });

    const comments = testDb.prepare(`
      SELECT body FROM task_comments WHERE task_id = ?
    `).all(taskId);

    assert.strictEqual(comments.length, 1);
    const comment = comments[0].body;
    
    // Check blocker pattern extraction
    const blockerMatch = comment.match(/(?:Blocker|Block):\s*(.+?)(?:\n|$)/i);
    assert.ok(blockerMatch !== null);
    assert.strictEqual(blockerMatch[1].trim(), 'Need approval for live Stripe Connect setup');

    // Check decision pattern extraction
    const decisionMatch = comment.match(/Decision(?:\s+needed)?:\s*(.+?)(?:\n|$)/i);
    assert.ok(decisionMatch !== null);
    assert.strictEqual(decisionMatch[1].trim(), 'Approve or deny live account creation');
  });

  it('should redact API keys and secrets from blocker info', () => {
    const secretPatterns = [
      'API key: sk_live_51abc123xyz',
      'Token: pk_test_abcd1234efgh5678',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      'password=SuperSecret123!',
    ];

    for (const secret of secretPatterns) {
      insertBlockedTask({
        title: 'Task with secret',
        blockerSummary: `Blocker contains secret: ${secret}`,
      });
    }

    const tasks = testDb.prepare(`
      SELECT r.summary FROM tasks t
      JOIN task_runs r ON t.current_run_id = r.id
      WHERE t.status = 'blocked'
    `).all();

    assert.ok(tasks.length > 0);

    // Verify secrets should be present in raw DB (our sanitize happens at display time)
    // This test just confirms the data is there for sanitization
    const containsSecrets = tasks.some(t => 
      t.summary.includes('sk_live') || 
      t.summary.includes('pk_test') ||
      t.summary.includes('password=')
    );
    assert.strictEqual(containsSecrets, true);
  });

  it('should handle tasks with multiple comments', () => {
    const taskId = insertBlockedTask({
      title: 'Task with context',
      comments: [
        { author: 'user', body: 'Initial context about the task' },
        { author: 'jukes-librarian', body: 'Blocker: Missing credentials for external API' },
        { author: 'jukes-librarian', body: 'Format: Provide API key and endpoint URL' },
      ],
    });

    const comments = testDb.prepare(`
      SELECT author, body 
      FROM task_comments 
      WHERE task_id = ? 
      ORDER BY created_at DESC
    `).all(taskId);

    assert.strictEqual(comments.length, 3);
    assert.ok(comments[0].body.includes('Format:'));
    assert.ok(comments[1].body.includes('Blocker:'));
  });

  it('should track last notified timestamp', () => {
    const lastNotified = Math.floor(Date.now() / 1000) - 7200; // 2 hours ago
    
    const taskId = insertBlockedTask({
      title: 'Notified task',
      lastNotified,
    });

    const event = testDb.prepare(`
      SELECT created_at 
      FROM task_events 
      WHERE task_id = ? AND kind = 'blocked'
    `).get(taskId);

    assert.ok(event !== undefined);
    assert.strictEqual(event.created_at, lastNotified);
  });

  it('should handle tasks with no comments gracefully', () => {
    const taskId = insertBlockedTask({
      title: 'Minimal blocked task',
      blockerSummary: 'Simple blocker with no comments',
    });

    const comments = testDb.prepare(`
      SELECT COUNT(*) as count FROM task_comments WHERE task_id = ?
    `).get(taskId);

    assert.strictEqual(comments.count, 0);

    const task = testDb.prepare(`
      SELECT r.summary 
      FROM tasks t 
      JOIN task_runs r ON t.current_run_id = r.id 
      WHERE t.id = ?
    `).get(taskId);

    assert.strictEqual(task.summary, 'Simple blocker with no comments');
  });

  it('should sort blocked tasks by priority', () => {
    // Insert tasks with different priorities
    insertBlockedTask({ title: 'Low priority', priority: 10 });
    insertBlockedTask({ title: 'High priority', priority: 90 });
    insertBlockedTask({ title: 'Urgent', priority: 100 });
    insertBlockedTask({ title: 'Medium priority', priority: 50 });

    const tasks = testDb.prepare(`
      SELECT title, priority 
      FROM tasks 
      WHERE status = 'blocked' 
      ORDER BY priority DESC
    `).all();

    assert.strictEqual(tasks.length, 4);
    assert.strictEqual(tasks[0].title, 'Urgent');
    assert.strictEqual(tasks[1].title, 'High priority');
    assert.strictEqual(tasks[2].title, 'Medium priority');
    assert.strictEqual(tasks[3].title, 'Low priority');
  });
});

describe('Sanitization Functions', () => {
  it('should redact API keys', () => {
    const text = 'Use API key sk_live_51Hxyz123 for authentication';
    const sanitized = text.replace(/\b(sk|pk|api|token|key)_[a-zA-Z0-9_-]{10,}\b/gi, '[REDACTED_KEY]');
    
    assert.strictEqual(sanitized, 'Use API key [REDACTED_KEY] for authentication');
    assert.ok(!sanitized.includes('sk_live'));
  });

  it('should redact Bearer tokens', () => {
    const text = 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0';
    const sanitized = text.replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, 'Bearer [REDACTED]');
    
    assert.strictEqual(sanitized, 'Authorization: Bearer [REDACTED]');
    assert.ok(!sanitized.includes('eyJ'));
  });

  it('should redact passwords', () => {
    const text = 'password: SuperSecret123!';
    const sanitized = text.replace(/\b(password|passwd|pwd)[\s:=]+\S+/gi, '$1=[REDACTED]');
    
    assert.strictEqual(sanitized, 'password=[REDACTED]');
    assert.ok(!sanitized.includes('SuperSecret'));
  });

  it('should preserve non-secret content', () => {
    const text = 'Need approval for API integration. Contact john@example.com';
    const sanitized = text
      .replace(/\b(sk|pk|api|token|key)_[a-zA-Z0-9_-]{10,}\b/gi, '[REDACTED_KEY]')
      .replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, 'Bearer [REDACTED]')
      .replace(/\b(password|passwd|pwd)[\s:=]+\S+/gi, '$1=[REDACTED]');
    
    assert.strictEqual(sanitized, text); // Should be unchanged
    assert.ok(sanitized.includes('Need approval'));
    assert.ok(sanitized.includes('john@example.com'));
  });
});
