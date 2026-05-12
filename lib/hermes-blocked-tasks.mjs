/**
 * Hermes Blocked Task Digest
 * 
 * Query and format blocked Kanban tasks requiring John's input.
 * Integrates with the existing librarian blocker workflow.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Database from 'better-sqlite3';

const HERMES_BASE_PATH = '/Users/lexi/.hermes';
const KANBAN_DB_PATH = join(HERMES_BASE_PATH, 'kanban.db');

/**
 * Get all blocked tasks from the Hermes Kanban database
 * Returns tasks with status='blocked' or latest run with outcome='blocked'
 */
export function getBlockedTasks() {
  if (!existsSync(KANBAN_DB_PATH)) {
    return [];
  }

  const db = new Database(KANBAN_DB_PATH, { readonly: true });
  
  try {
    // Query tasks with their latest blocking run
    const blockedTasks = db
      .prepare(
        `SELECT 
          t.id,
          t.title,
          t.assignee,
          t.status,
          t.priority,
          t.created_at,
          t.started_at,
          r.id as run_id,
          r.outcome,
          r.summary as blocker_reason,
          r.error,
          r.ended_at as blocked_at,
          (SELECT MAX(created_at) FROM task_events WHERE task_id = t.id AND kind = 'blocked') as last_notified_at
         FROM tasks t
         LEFT JOIN task_runs r ON t.current_run_id = r.id
         WHERE t.status = 'blocked' 
            OR (r.outcome = 'blocked' AND t.status != 'done')
         ORDER BY t.priority DESC, t.created_at ASC`
      )
      .all();

    // Get comments for each blocked task to extract blocker details
    const tasksWithComments = blockedTasks.map((task) => {
      const comments = db
        .prepare(
          `SELECT author, body, created_at
           FROM task_comments
           WHERE task_id = ?
           ORDER BY created_at DESC
           LIMIT 5`
        )
        .all(task.id);

      // Parse blocker information from summary or comments
      const blockerInfo = parseBlockerInfo(task, comments);

      return {
        id: task.id,
        title: task.title,
        assignee: task.assignee || 'unassigned',
        status: task.status,
        priority: task.priority || 0,
        createdAt: task.created_at,
        blockedAt: task.blocked_at,
        lastNotifiedAt: task.last_notified_at,
        ...blockerInfo,
      };
    });

    return tasksWithComments;
  } finally {
    db.close();
  }
}

/**
 * Parse blocker information from task summary and comments
 * Extracts: missing info, suggested answer format, context
 */
function parseBlockerInfo(task, comments) {
  // Start with the blocker reason from the task run summary
  let missingInfo = task.blocker_reason || 'No specific blocker information provided';
  let suggestedFormat = null;
  let context = null;

  // Look for structured blocker information in comments
  // Librarian workflow typically adds comments with context
  for (const comment of comments) {
    const body = comment.body;

    // Check for blocker format: "Blocker: ..."
    const blockerMatch = body.match(/(?:Blocker|Block|Blocked on):\s*(.+?)(?:\n|$)/i);
    if (blockerMatch) {
      missingInfo = blockerMatch[1].trim();
    }

    // Check for decision format: "Decision needed: ..."
    const decisionMatch = body.match(/Decision(?:\s+needed)?:\s*(.+?)(?:\n|$)/i);
    if (decisionMatch) {
      missingInfo = decisionMatch[1].trim();
    }

    // Check for suggested answer format
    const formatMatch = body.match(/(?:Format|Answer format|Provide):\s*(.+?)(?:\n|$)/i);
    if (formatMatch) {
      suggestedFormat = formatMatch[1].trim();
    }

    // Extract context (usually first non-blocker paragraph)
    if (!context && body.length > 50 && !body.startsWith('Blocker')) {
      const lines = body.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        context = lines[0].substring(0, 200);
        if (body.length > 200) context += '...';
      }
    }
  }

  // Sanitize to avoid exposing secrets
  const sanitized = {
    missingInfo: sanitizeForDisplay(missingInfo),
    suggestedFormat: suggestedFormat ? sanitizeForDisplay(suggestedFormat) : null,
    context: context ? sanitizeForDisplay(context) : null,
  };

  return sanitized;
}

/**
 * Sanitize text to avoid displaying secret values
 * Redacts common secret patterns (API keys, tokens, passwords, credentials)
 */
function sanitizeForDisplay(text) {
  if (!text) return text;

  // Redact patterns that look like secrets
  let sanitized = text;

  // API keys, tokens (sk_live_, pk_test_, etc.)
  sanitized = sanitized.replace(/\b(sk|pk|api|token|key)_[a-zA-Z0-9_-]{10,}\b/gi, '[REDACTED_KEY]');
  
  // Bearer tokens
  sanitized = sanitized.replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, 'Bearer [REDACTED]');
  
  // Password patterns in various formats
  sanitized = sanitized.replace(/\b(password|passwd|pwd)[\s:=]+\S+/gi, '$1=[REDACTED]');
  
  // Base64-looking strings (likely credentials)
  sanitized = sanitized.replace(/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, '[REDACTED_BASE64]');
  
  // SSH/RSA keys
  sanitized = sanitized.replace(/-----BEGIN (?:RSA |DSA )?PRIVATE KEY-----.+?-----END (?:RSA |DSA )?PRIVATE KEY-----/gs, '[REDACTED_PRIVATE_KEY]');

  return sanitized;
}

/**
 * Get blocked tasks count (for stats)
 */
export function getBlockedTasksCount() {
  return getBlockedTasks().length;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(unixTimestamp) {
  if (!unixTimestamp) return null;
  
  const date = new Date(unixTimestamp * 1000);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
