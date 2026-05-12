import path from 'node:path';
import { readFile } from 'node:fs/promises';

const KANBAN_BOARD_FILE = path.join(process.cwd(), 'data', 'kanban-board.json');

/**
 * Compute virtual status for tasks based on review requirements
 * @param {Object} task - The task to compute status for
 * @param {Array} allTasks - All tasks in the board (for finding children)
 * @returns {string} - The virtual status ('in_review' or the task's actual status)
 */
function computeVirtualStatus(task, allTasks) {
  // Only compute virtual status for tasks with status='done'
  if (task.status !== 'done') {
    return task.status;
  }

  // If review is explicitly not required, task is truly done
  if (task.review_required === false) {
    return 'done';
  }

  // If task has no children, it's truly done (no review needed)
  if (!task.child_ids || task.child_ids.length === 0) {
    return 'done';
  }

  // Check if any review, finding, or fix children are still open
  const hasOpenReviewChildren = task.child_ids.some(childId => {
    const child = allTasks.find(c => c.id === childId);
    if (!child) return false;
    
    // Check for open review, finding, or fix tasks
    const isReviewType = ['review', 'finding', 'fix'].includes(child.task_type);
    const isNotDone = child.status !== 'done';
    
    return isReviewType && isNotDone;
  });

  return hasOpenReviewChildren ? 'in_review' : 'done';
}

export async function getKanbanBoard() {
  try {
    const raw = await readFile(KANBAN_BOARD_FILE, 'utf8');
    const board = JSON.parse(raw);
    
    // Enhance tasks with virtual_status
    const enhancedTasks = board.tasks.map(task => ({
      ...task,
      virtual_status: computeVirtualStatus(task, board.tasks)
    }));

    // Reorganize lanes to include in_review
    const laneOrder = ['triage', 'ready', 'running', 'blocked', 'in_review', 'done'];
    const laneMap = new Map();

    // Initialize all lanes
    laneOrder.forEach(laneId => {
      laneMap.set(laneId, { id: laneId, task_count: 0, tasks: [] });
    });

    // Distribute tasks to lanes based on virtual_status
    enhancedTasks.forEach(task => {
      const laneId = task.virtual_status;
      if (laneMap.has(laneId)) {
        laneMap.get(laneId).tasks.push(task);
      }
    });

    // Update task counts
    laneMap.forEach(lane => {
      lane.task_count = lane.tasks.length;
    });

    // Convert map to array in correct order
    const lanes = laneOrder.map(id => laneMap.get(id));

    return {
      ...board,
      tasks: enhancedTasks,
      lanes
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Return empty board if file doesn't exist yet
      return {
        generated_at: new Date().toISOString(),
        total_tasks: 0,
        tasks_by_status: {
          triage: 0,
          ready: 0,
          running: 0,
          blocked: 0,
          in_review: 0,
          done: 0
        },
        tasks_by_type: {
          task: 0,
          review: 0,
          finding: 0,
          triage: 0
        },
        review_status_summary: {
          approved: 0,
          approved_with_fixes: 0,
          pending_review: 0,
          pending_fixes: 0,
          blocked_review: 0,
          no_review: 0
        },
        lanes: [
          { id: 'triage', task_count: 0, tasks: [] },
          { id: 'ready', task_count: 0, tasks: [] },
          { id: 'running', task_count: 0, tasks: [] },
          { id: 'blocked', task_count: 0, tasks: [] },
          { id: 'in_review', task_count: 0, tasks: [] },
          { id: 'done', task_count: 0, tasks: [] }
        ],
        tasks: []
      };
    }
    throw error;
  }
}
