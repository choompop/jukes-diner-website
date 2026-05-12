export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileSearch,
  GitPullRequest,
  Kanban,
  Layers3,
  AlertCircle,
  CheckCheck,
  Clock,
  Wrench
} from 'lucide-react';

import { getKanbanBoard } from '@/lib/hermes-kanban.mjs';
import { cn } from '@/lib/utils';

const laneTone = {
  triage: 'border-purple-200 bg-purple-50',
  ready: 'border-diner-teal/20 bg-diner-teal/5',
  running: 'border-amber-300/40 bg-amber-50',
  blocked: 'border-diner-red/20 bg-diner-red/5',
  in_review: 'border-blue-200 bg-blue-50',
  done: 'border-emerald-200 bg-emerald-50',
};

const laneIcon = {
  triage: FileSearch,
  ready: CircleDot,
  running: Clock3,
  blocked: AlertTriangle,
  in_review: GitPullRequest,
  done: CheckCircle2,
};

const taskTypeTone = {
  task: 'bg-blue-100 text-blue-700 border-blue-200',
  review: 'bg-purple-100 text-purple-700 border-purple-200',
  finding: 'bg-amber-100 text-amber-700 border-amber-200',
  triage: 'bg-gray-100 text-gray-700 border-gray-200',
};

const taskTypeIcon = {
  task: Kanban,
  review: FileSearch,
  finding: Wrench,
  triage: GitPullRequest,
};

const reviewStatusTone = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved_with_fixes: 'bg-teal-50 text-teal-700 border-teal-200',
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  pending_fixes: 'bg-orange-50 text-orange-700 border-orange-200',
  blocked_review: 'bg-red-50 text-red-700 border-red-200',
  no_review: 'bg-gray-50 text-gray-500 border-gray-200',
};

const reviewStatusLabel = {
  approved: 'Approved',
  approved_with_fixes: 'Approved + Fixes',
  pending_review: 'Pending Review',
  pending_fixes: 'Needs Fixes',
  blocked_review: 'Review Blocked',
  no_review: 'No Review',
};

const reviewStatusIcon = {
  approved: CheckCheck,
  approved_with_fixes: CheckCircle2,
  pending_review: Clock,
  pending_fixes: AlertCircle,
  blocked_review: AlertTriangle,
  no_review: Clock3,
};

export default async function HermesKanbanPage() {
  const board = await getKanbanBoard();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-diner-black text-white shadow-xl">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-display uppercase tracking-[0.32em] text-diner-cream">
              <Kanban className="h-4 w-4 text-diner-red" /> Hermes Kanban
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl leading-tight text-white md:text-5xl">
              Agent build workflow with continuous improvement review loops.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-diner-cream/80">
              Track tasks across triage, ready, running, blocked, in review, and done stages. Completed work stays in review until all checks pass, then moves to done.
            </p>
            <p className="mt-5 text-[10px] font-display uppercase tracking-[0.28em] text-white/45">
              Updated {new Date(board.generated_at).toLocaleString()} · {board.total_tasks} total tasks
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Active', value: board.tasks_by_status.running + board.tasks_by_status.ready + board.tasks_by_status.triage },
              { label: 'Reviews', value: board.tasks_by_type.review },
              { label: 'Findings', value: board.tasks_by_type.finding },
              { label: 'Done', value: board.tasks_by_status.done },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-sm">
                <p className="text-3xl font-bold text-diner-cream">{stat.value}</p>
                <p className="mt-2 text-[10px] font-display uppercase tracking-[0.24em] text-white/55">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Status Summary */}
      <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl text-diner-black">Review Status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(board.review_status_summary).map(([status, count]) => {
            const Icon = reviewStatusIcon[status as keyof typeof reviewStatusIcon] || Clock;
            const statusKey = status as keyof typeof reviewStatusTone;
            return (
              <div
                key={status}
                className={cn(
                  'rounded-xl border p-4 flex items-center gap-3',
                  reviewStatusTone[statusKey] || 'bg-gray-50 border-gray-200'
                )}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">{count as number}</p>
                  <p className="text-xs uppercase tracking-wider">{reviewStatusLabel[statusKey]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kanban Lanes */}
      <section className="grid gap-4 xl:grid-cols-6">
        {board.lanes.map((lane) => {
          const Icon = laneIcon[lane.id] || Kanban;
          return (
            <article key={lane.id} className={cn('rounded-[1.5rem] border p-4 shadow-sm', laneTone[lane.id] || 'bg-white')}>
              <div className="mb-4 rounded-2xl bg-white/80 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl bg-diner-black p-2 text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h2 className="text-lg capitalize text-diner-black">{lane.id}</h2>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    {lane.task_count}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {lane.tasks.map((task) => {
                  const TypeIcon = taskTypeIcon[task.task_type] || Kanban;
                  return (
                    <div key={task.id} className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
                      <div className="mb-2 flex flex-wrap items-start gap-2">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]',
                            taskTypeTone[task.task_type] || 'bg-gray-100 border-gray-200 text-gray-700'
                          )}
                        >
                          <TypeIcon className="h-3 w-3" />
                          {task.task_type}
                        </span>
                        {task.review_status && (
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]',
                              reviewStatusTone[task.review_status] || 'bg-gray-50'
                            )}
                          >
                            {(() => {
                              const StatusIcon = reviewStatusIcon[task.review_status] || Clock;
                              return <StatusIcon className="h-3 w-3" />;
                            })()}
                            {reviewStatusLabel[task.review_status]}
                          </span>
                        )}
                      </div>
                      <h3 className="mb-2 text-sm font-bold leading-5 text-diner-black">{task.title}</h3>
                      {task.assignee && (
                        <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-500">
                          Assignee: <span className="font-mono">{task.assignee}</span>
                        </p>
                      )}
                      {(task.parent_ids.length > 0 || task.child_ids.length > 0) && (
                        <div className="mt-3 space-y-1.5">
                          {task.parent_ids.length > 0 && (
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-gray-400">↑ Parents:</span>
                              <div className="flex flex-wrap gap-1">
                                {task.parent_ids.slice(0, 3).map((parentId, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded bg-gray-100 px-2 py-0.5 font-mono text-gray-600"
                                  >
                                    {parentId}
                                  </span>
                                ))}
                                {task.parent_ids.length > 3 && (
                                  <span className="text-gray-500">+{task.parent_ids.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}
                          {task.child_ids.length > 0 && (
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-gray-400">↓ Children:</span>
                              <div className="flex flex-wrap gap-1">
                                {task.child_ids.slice(0, 3).map((childId, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded bg-gray-100 px-2 py-0.5 font-mono text-gray-600"
                                  >
                                    {childId}
                                  </span>
                                ))}
                                {task.child_ids.length > 3 && (
                                  <span className="text-gray-500">+{task.child_ids.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {task.last_run && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-2 text-[10px] text-gray-600">
                          <p className="mb-1 font-mono">
                            Last run: {task.last_run.outcome || 'running'} by {task.last_run.profile}
                          </p>
                          {task.last_run.summary && (
                            <p className="line-clamp-2 text-gray-700">{task.last_run.summary}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
