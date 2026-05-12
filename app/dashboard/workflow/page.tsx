export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  Kanban,
  Layers3,
} from 'lucide-react';

import {
  getWorkflowBoard,
  getWorkflowLanes,
  getWorkflowStats,
  getWorkflowTasksByArea,
} from '@/lib/workflow-kanban.mjs';
import { getBlockedTasks } from '@/lib/hermes-blocked-tasks.mjs';
import { cn } from '@/lib/utils';

const laneTone = {
  backlog: 'border-gray-200 bg-gray-50',
  ready: 'border-diner-teal/20 bg-diner-teal/5',
  in_progress: 'border-amber-300/40 bg-amber-50',
  blocked: 'border-diner-red/20 bg-diner-red/5',
  done: 'border-emerald-200 bg-emerald-50',
};

const laneIcon = {
  backlog: Layers3,
  ready: CircleDot,
  in_progress: Clock3,
  blocked: AlertTriangle,
  done: CheckCircle2,
};

const priorityTone = {
  urgent: 'bg-diner-red text-white',
  high: 'bg-diner-red/10 text-diner-red',
  medium: 'bg-diner-teal/10 text-diner-teal',
  normal: 'bg-gray-100 text-gray-600',
  low: 'bg-gray-50 text-gray-500',
};

const areaTone = {
  financial: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  media: 'bg-purple-50 text-purple-700 border-purple-100',
  'franchise-brain': 'bg-diner-cream text-diner-black border-diner-red/10',
};

export default async function WorkflowKanbanPage() {
  const board = await getWorkflowBoard();
  const lanes = getWorkflowLanes(board);
  const stats = getWorkflowStats(board);
  const groupedByArea = getWorkflowTasksByArea(board);
  const hermesBlockedTasks = await getBlockedTasks();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-diner-black text-white shadow-xl">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-display uppercase tracking-[0.32em] text-diner-cream">
              <Kanban className="h-4 w-4 text-diner-red" /> Build Workflow
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl leading-tight text-white md:text-5xl">
              Operator-visible Kanban for what is being built, blocked, and shipped.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-diner-cream/80">
              A server-safe local board for build tasks and operating loops. It keeps financial visibility, media execution, and franchise-brain work linked back to the dashboard areas operators already use.
            </p>
            <p className="mt-5 text-[10px] font-display uppercase tracking-[0.28em] text-white/45">
              Updated {board.updatedAt} · {board.title}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Lanes', value: stats.lanes },
              { label: 'Tasks', value: stats.tasks },
              { label: 'Active', value: stats.activeTasks },
              { label: 'Blocked', value: stats.blockedTasks },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-sm">
                <p className="text-3xl font-bold text-diner-cream">{stat.value}</p>
                <p className="mt-2 text-[10px] font-display uppercase tracking-[0.24em] text-white/55">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {Object.entries(groupedByArea as Record<string, any[]>).map(([areaId, tasks]) => {
          const firstTask = tasks[0];
          return (
            <Link
              key={areaId}
              href={firstTask?.areaHref ?? '/dashboard/franchise-brain'}
              className={cn(
                'group rounded-[1.5rem] border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                areaTone[areaId] ?? 'border-gray-100',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-display uppercase tracking-[0.28em] opacity-70">Linked Area</p>
                  <h2 className="mt-2 text-2xl text-diner-black">{firstTask?.areaLabel ?? areaId}</h2>
                  <p className="mt-2 text-sm leading-6 opacity-75">{firstTask?.areaTone ?? 'Dashboard workstream'}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] opacity-70">{tasks.length} tasks linked</p>
            </Link>
          );
        })}
      </section>

      {/* Hermes Blocked Tasks Digest - Tasks requiring John's input */}
      {hermesBlockedTasks.length > 0 && (
        <section className="overflow-hidden rounded-[1.5rem] border-2 border-diner-red/30 bg-diner-red/5 shadow-lg">
          <div className="border-b border-diner-red/20 bg-diner-red/10 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-diner-red p-2 text-white">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-diner-black">
                    Tasks Blocked — John's Input Needed
                  </h2>
                  <p className="text-xs text-gray-600">
                    {hermesBlockedTasks.length} {hermesBlockedTasks.length === 1 ? 'task' : 'tasks'} waiting on decisions or information
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/blocked-tasks"
                className="rounded-xl bg-diner-red px-4 py-2 text-sm font-medium text-white transition hover:bg-diner-black"
              >
                View All Blocked Tasks
              </Link>
            </div>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {hermesBlockedTasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-white bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold leading-tight text-diner-black">
                    {task.title}
                  </h3>
                  <span className="flex-shrink-0 rounded-full bg-diner-red/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-diner-red">
                    {task.priority >= 90 ? 'Urgent' : 'Blocked'}
                  </span>
                </div>
                <div className="mb-3 rounded-lg bg-diner-red/5 p-2">
                  <p className="text-[10px] font-display uppercase tracking-wider text-diner-red/70">
                    Needs
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-tight text-gray-700">
                    {task.missingInfo}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span className="font-mono">{task.id}</span>
                  <span>{task.assignee}</span>
                </div>
              </div>
            ))}
          </div>
          {hermesBlockedTasks.length > 6 && (
            <div className="border-t border-diner-red/20 bg-white px-6 py-3 text-center">
              <Link
                href="/dashboard/blocked-tasks"
                className="text-sm font-medium text-diner-red hover:text-diner-black"
              >
                + {hermesBlockedTasks.length - 6} more blocked {hermesBlockedTasks.length - 6 === 1 ? 'task' : 'tasks'}
              </Link>
            </div>
          )}
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-5">
        {lanes.map((lane) => {
          const Icon = laneIcon[lane.id] ?? Kanban;
          return (
            <article key={lane.id} className={cn('rounded-[1.5rem] border p-4 shadow-sm', laneTone[lane.id] ?? 'bg-white')}>
              <div className="mb-4 rounded-2xl bg-white/80 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl bg-diner-black p-2 text-white"><Icon className="h-4 w-4" /></span>
                    <h2 className="text-lg text-diner-black">{lane.title}</h2>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    {lane.tasks.length}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-gray-500">{lane.operatorPrompt}</p>
              </div>

              <div className="space-y-3">
                {lane.tasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold leading-5 text-diner-black">{task.title}</h3>
                      <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]', priorityTone[task.priority] ?? priorityTone.normal)}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-gray-600">{task.summary}</p>
                    {task.blocker ? (
                      <p className="mt-3 rounded-xl bg-diner-red/10 p-3 text-xs font-medium leading-5 text-diner-red">
                        Blocker: {task.blocker}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
                        Owner: {task.owner}
                      </span>
                      <Link
                        href={task.areaHref}
                        className="rounded-full bg-diner-cream px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-diner-red hover:bg-diner-red hover:text-white"
                      >
                        {task.areaLabel}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
