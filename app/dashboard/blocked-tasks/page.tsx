export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Clock,
  MessageSquare,
  User,
} from 'lucide-react';

import { getBlockedTasks, formatTimestamp } from '@/lib/hermes-blocked-tasks.mjs';
import { cn } from '@/lib/utils';

const priorityTone = {
  0: { bg: 'bg-gray-50', text: 'text-gray-500', label: 'Normal' },
  10: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Low' },
  50: { bg: 'bg-diner-teal/10', text: 'text-diner-teal', label: 'Medium' },
  90: { bg: 'bg-diner-red/10', text: 'text-diner-red', label: 'High' },
  100: { bg: 'bg-diner-red', text: 'text-white', label: 'Urgent' },
};

function getPriorityStyle(priority) {
  if (priority >= 100) return priorityTone[100];
  if (priority >= 90) return priorityTone[90];
  if (priority >= 50) return priorityTone[50];
  if (priority >= 10) return priorityTone[10];
  return priorityTone[0];
}

export default async function BlockedTasksPage() {
  const blockedTasks = await getBlockedTasks();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="overflow-hidden rounded-[2rem] bg-diner-black text-white shadow-xl">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-display uppercase tracking-[0.32em] text-diner-cream">
              <AlertTriangle className="h-4 w-4 text-diner-red" /> Blocked Tasks
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl leading-tight text-white md:text-5xl">
              Tasks waiting on John's input or decision
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-diner-cream/80">
              These tasks cannot proceed until you provide missing information, make a decision, or
              approve an action. Each card shows what's needed to unblock it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold text-diner-cream">{blockedTasks.length}</p>
              <p className="mt-2 text-[10px] font-display uppercase tracking-[0.24em] text-white/55">
                Blocked
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold text-diner-cream">
                {blockedTasks.filter((t) => t.priority >= 90).length}
              </p>
              <p className="mt-2 text-[10px] font-display uppercase tracking-[0.24em] text-white/55">
                Urgent
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blocked Tasks List */}
      {blockedTasks.length === 0 ? (
        <section className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <AlertTriangle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl text-diner-black">No blocked tasks</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              All tasks are either ready to work, in progress, or completed. Check back later if work gets blocked.
            </p>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          {blockedTasks.map((task) => {
            const priorityStyle = getPriorityStyle(task.priority);
            const blockedTime = formatTimestamp(task.blockedAt || task.createdAt);
            const notifiedTime = task.lastNotifiedAt ? formatTimestamp(task.lastNotifiedAt) : null;

            return (
              <article
                key={task.id}
                className="overflow-hidden rounded-[1.5rem] border border-diner-red/20 bg-white shadow-md transition hover:shadow-lg"
              >
                <div className="bg-diner-red/5 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]',
                            priorityStyle.bg,
                            priorityStyle.text
                          )}
                        >
                          {priorityStyle.label}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-gray-500">
                          {task.id}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold leading-tight text-diner-black">
                        {task.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{task.assignee}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  {/* Missing Information */}
                  <div className="rounded-xl border border-diner-red/30 bg-diner-red/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-diner-red" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-display uppercase tracking-[0.24em] text-diner-red/70">
                          Missing Information
                        </p>
                        <p className="mt-2 text-sm leading-6 text-diner-black">
                          {task.missingInfo}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Answer Format */}
                  {task.suggestedFormat && (
                    <div className="rounded-xl border border-diner-teal/30 bg-diner-teal/5 p-4">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-diner-teal" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-display uppercase tracking-[0.24em] text-diner-teal/70">
                            Suggested Answer Format
                          </p>
                          <p className="mt-2 text-sm leading-6 text-gray-700">
                            {task.suggestedFormat}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Context */}
                  {task.context && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-[10px] font-display uppercase tracking-[0.24em] text-gray-500">
                        Context
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {task.context}
                      </p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Blocked {blockedTime}</span>
                    </div>
                    {notifiedTime && (
                      <div className="flex items-center gap-1.5">
                        <Bell className="h-3.5 w-3.5" />
                        <span>Last notified {notifiedTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                  <Link
                    href={`/dashboard/workflow?task=${task.id}`}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-diner-red hover:text-diner-black"
                  >
                    View in Workflow Board
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Help Section */}
      <section className="rounded-[1.5rem] border border-diner-cream bg-white p-8 shadow-sm">
        <h2 className="text-xl text-diner-black">How to unblock a task</h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
          <p>
            <strong>1. Review the missing information</strong> — Each card shows exactly what decision
            or information is needed.
          </p>
          <p>
            <strong>2. Provide your answer</strong> — Reply via Slack, add a Kanban comment, or update
            the relevant system directly.
          </p>
          <p>
            <strong>3. Unblock the task</strong> — The agent will be notified and resume work
            automatically.
          </p>
        </div>
        <div className="mt-6 rounded-xl border border-diner-teal/30 bg-diner-teal/5 p-4">
          <p className="text-xs leading-5 text-gray-600">
            <strong className="text-diner-teal">Note:</strong> No secret values (API keys, passwords,
            tokens) are displayed on this page. If a task requires credentials, the blocker message
            will indicate where to provide them securely.
          </p>
        </div>
      </section>
    </div>
  );
}
