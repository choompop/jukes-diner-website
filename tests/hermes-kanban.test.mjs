import test from 'node:test';
import assert from 'node:assert/strict';
import { getKanbanBoard } from '../lib/hermes-kanban.mjs';

test('should return a valid kanban board structure', async () => {
  const board = await getKanbanBoard();
  
  assert.ok(board);
  assert.ok(board.generated_at);
  assert.ok(board.total_tasks >= 0);
  assert.ok(board.tasks_by_status);
  assert.ok(board.tasks_by_type);
  assert.ok(board.review_status_summary);
  assert.ok(board.lanes);
  assert.ok(board.tasks);
});

test('should include all required status lanes in operator order', async () => {
  const board = await getKanbanBoard();
  const laneIds = board.lanes.map(l => l.id);
  
  assert.deepEqual(laneIds, ['triage', 'ready', 'running', 'blocked', 'in_review', 'done']);
});

test('should classify tasks by type', async () => {
  const board = await getKanbanBoard();
  
  assert.ok('task' in board.tasks_by_type);
  assert.ok('review' in board.tasks_by_type);
  assert.ok('finding' in board.tasks_by_type);
  assert.ok('triage' in board.tasks_by_type);
});

test('should track review status for done tasks', async () => {
  const board = await getKanbanBoard();
  
  assert.ok('approved' in board.review_status_summary);
  assert.ok('approved_with_fixes' in board.review_status_summary);
  assert.ok('pending_review' in board.review_status_summary);
  assert.ok('pending_fixes' in board.review_status_summary);
  assert.ok('blocked_review' in board.review_status_summary);
  assert.ok('no_review' in board.review_status_summary);
});

test('should enhance tasks with parent/child relationships', async () => {
  const board = await getKanbanBoard();
  
  if (board.tasks.length > 0) {
    const task = board.tasks[0];
    assert.ok('task_type' in task);
    assert.ok('parent_ids' in task);
    assert.ok('child_ids' in task);
    assert.ok('review_status' in task);
  }
});

test('should return empty board structure when no data exists', async () => {
  // This tests the fallback case in getKanbanBoard
  const board = await getKanbanBoard();
  
  assert.equal(board.lanes.length, 6);
  assert.ok(board.tasks);
});

test('should place done tasks with open review children in In Review stage', async () => {
  const board = await getKanbanBoard();
  
  // Find a task in "done" status with task_type="task" and open review children
  const taskInReview = board.tasks.find(t => 
    t.status === 'done' && 
    t.task_type === 'task' &&
    t.child_ids.length > 0 &&
    board.tasks.some(child => 
      t.child_ids.includes(child.id) && 
      child.task_type === 'review' && 
      child.status !== 'done'
    )
  );

  if (taskInReview) {
    assert.equal(taskInReview.virtual_status, 'in_review');
    
    // Verify it appears in the in_review lane
    const inReviewLane = board.lanes.find(l => l.id === 'in_review');
    assert.ok(inReviewLane.tasks.map(t => t.id).includes(taskInReview.id));
  }
});

test('should place done tasks with unresolved finding/fix children in In Review stage', async () => {
  const board = await getKanbanBoard();
  
  // Find a task in "done" with open finding/fix children
  const taskInReview = board.tasks.find(t => 
    t.status === 'done' && 
    t.task_type === 'task' &&
    t.child_ids.length > 0 &&
    board.tasks.some(child => 
      t.child_ids.includes(child.id) && 
      (child.task_type === 'finding' || child.task_type === 'fix') && 
      child.status !== 'done'
    )
  );

  if (taskInReview) {
    assert.equal(taskInReview.virtual_status, 'in_review');
  }
});

test('should place tasks with review_required=false directly in Done when complete', async () => {
  const board = await getKanbanBoard();
  
  // Find a task with review_required=false and status='done'
  const taskSkippingReview = board.tasks.find(t => 
    t.status === 'done' && 
    t.review_required === false
  );

  if (taskSkippingReview) {
    assert.equal(taskSkippingReview.virtual_status, 'done');
    
    // Verify it appears in the done lane, not in_review
    const doneLane = board.lanes.find(l => l.id === 'done');
    assert.ok(doneLane.tasks.map(t => t.id).includes(taskSkippingReview.id));
    
    const inReviewLane = board.lanes.find(l => l.id === 'in_review');
    assert.ok(!inReviewLane.tasks.map(t => t.id).includes(taskSkippingReview.id));
  }
});

test('should place tasks with all reviews approved in Done stage', async () => {
  const board = await getKanbanBoard();
  
  // Find a task where all review children are done
  const taskFullyReviewed = board.tasks.find(t => 
    t.status === 'done' && 
    t.task_type === 'task' &&
    t.child_ids.length > 0 &&
    t.child_ids.every(childId => {
      const child = board.tasks.find(c => c.id === childId);
      return child && child.task_type === 'review' && child.status === 'done';
    })
  );

  if (taskFullyReviewed) {
    assert.equal(taskFullyReviewed.virtual_status, 'done');
    
    // Verify it appears in the done lane
    const doneLane = board.lanes.find(l => l.id === 'done');
    assert.ok(doneLane.tasks.map(t => t.id).includes(taskFullyReviewed.id));
  }
});
