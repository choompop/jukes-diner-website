export const dynamic = 'force-dynamic';

import {
  ChevronRight,
  Clock3,
  MessageSquare,
  Settings2,
} from 'lucide-react';

import {
  getFranchiseBrain,
  getFranchiseBrainItems,
  getFranchiseBrainStats,
  getFranchiseBrainCommandCenter,
  readFranchiseBrainSignals,
  getFranchiseBrainSignalStats,
} from '@/lib/franchise-brain.mjs';
import { cn } from '@/lib/utils';
import SignalTriagePanel from './SignalTriagePanel';
import CardManagementPanel from './CardManagementPanel';

const statusTone = {
  active: 'bg-emerald-100 text-emerald-700',
  planned: 'bg-amber-100 text-amber-700',
  blocked: 'bg-red-100 text-red-700',
  done: 'bg-blue-100 text-blue-700',
  archived: 'bg-gray-200 text-gray-500',
};

const priorityTone = {
  urgent: 'text-diner-red',
  high: 'text-diner-red',
  medium: 'text-diner-teal',
  normal: 'text-gray-500',
  low: 'text-gray-500',
};

export default async function FranchiseBrainPage() {
  const brain = await getFranchiseBrain();
  const signals = await readFranchiseBrainSignals();
  const stats = getFranchiseBrainStats(brain);
  const signalStats = getFranchiseBrainSignalStats(signals);
  const items = getFranchiseBrainItems(brain);
  const commandCenter = getFranchiseBrainCommandCenter(brain);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/50 bg-gradient-to-br from-diner-black via-diner-black to-diner-red p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-[10px] font-display uppercase tracking-[0.35em] text-diner-cream">
              Franchise Brain
            </p>
            <h1 className="text-3xl text-white md:text-5xl">THE OPERATING MEMORY FOR EVERY FUTURE JUKE&apos;S.</h1>
            <p className="mt-4 max-w-2xl font-sans text-lg text-diner-cream/85">
              One retro board for what the brand publishes and how the back-of-house system keeps operators aligned.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Layers', value: stats.layers },
              { label: 'Brain Items', value: stats.items },
              { label: 'Signals Saved', value: signalStats.signals },
              { label: 'High Priority', value: stats.highPriorityItems + signalStats.highPrioritySignals },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-5 text-center backdrop-blur-sm">
                <div className="text-3xl text-diner-cream">{stat.value}</div>
                <div className="mt-1 text-[10px] font-display uppercase tracking-[0.28em] text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {commandCenter.sections.map((section) => (
          <div key={section.id} className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-display uppercase tracking-[0.28em] text-diner-red">{section.owner}</p>
            <h2 className="mt-2 text-xl text-diner-black">{section.title}</h2>
            <p className="mt-3 min-h-16 text-sm leading-6 text-gray-600">{section.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <span key={item.id} className="rounded-full bg-diner-cream px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600">
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {brain.layers.map((layer) => (
            <article key={layer.id} className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-diner-black/5 bg-diner-cream px-8 py-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] font-display uppercase tracking-[0.35em] text-gray-400">
                      {layer.strapline}
                    </p>
                    <h2 className="mt-2 text-2xl text-diner-black">{layer.name}</h2>
                    <p className="mt-2 max-w-2xl font-sans text-gray-500">{layer.summary}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-diner-red/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-diner-red">
                    {layer.items.length} lanes live
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6 xl:grid-cols-2">
                {layer.items.map((item) => (
                  <div key={item.id} className="rounded-[1.5rem] border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg text-diner-black">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">{item.summary}</p>
                      </div>
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]',
                          statusTone[item.status] ?? 'bg-gray-100 text-gray-600',
                        )}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.22em] text-gray-400">
                      <span className="rounded-full bg-white px-3 py-1 font-bold text-gray-500">
                        Owner: {item.owner}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 font-bold text-gray-500">
                        Cadence: {item.cadence}
                      </span>
                      <span className={cn('rounded-full bg-white px-3 py-1 font-bold', priorityTone[item.priority] ?? 'text-gray-500')}>
                        Priority: {item.priority}
                      </span>
                      {item.kanbanTaskId && (
                        <a
                          href={item.kanbanTaskUrl || `/dashboard/workflow#${item.kanbanTaskId}`}
                          className="rounded-full bg-diner-teal px-3 py-1 font-bold text-white hover:bg-diner-teal/90"
                        >
                          Task: {item.kanbanTaskStatus || 'linked'}
                        </a>
                      )}
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-[10px] font-display uppercase tracking-[0.28em] text-gray-400">
                          Inputs
                        </p>
                        <div className="space-y-2">
                          {item.inputs.map((input) => (
                            <div key={input} className="rounded-xl bg-white px-3 py-2 text-sm text-gray-600">
                              {input}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-[10px] font-display uppercase tracking-[0.28em] text-gray-400">
                          Outputs
                        </p>
                        <div className="space-y-2">
                          {item.outputs.map((output) => (
                            <div key={output} className="rounded-xl bg-white px-3 py-2 text-sm text-gray-600">
                              {output}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <CardManagementPanel initialItems={items} />
          <SignalTriagePanel initialSignals={signals} />

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl text-diner-black">Live Intake</h2>
            <p className="mt-2 text-sm text-gray-500">Signals captured from Slack, DMs, or future forms land here before becoming tasks, content, or SOP updates.</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-diner-cream p-3">
                <p className="text-2xl text-diner-red">{signalStats.newSignals}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">New</p>
              </div>
              <div className="rounded-2xl bg-diner-cream p-3">
                <p className="text-2xl text-diner-red">{signalStats.contentSignals}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Content</p>
              </div>
              <div className="rounded-2xl bg-diner-cream p-3">
                <p className="text-2xl text-diner-red">{signalStats.opsSignals}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Ops</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {(signals.length ? signals.slice(0, 5) : [{ id: 'empty', title: 'No live signals yet', summary: 'When Flo or the API saves intake, it will appear here.', priority: 'normal', source: { platform: 'system' } }]).map((signal) => (
                <div key={signal.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-diner-black">{signal.title}</p>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase text-gray-500">{signal.priority}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{signal.summary}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">{signal.source?.platform} · {signal.source?.channel || 'unassigned'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-diner-red" />
              <h2 className="text-xl text-diner-black">Signal Board</h2>
            </div>
            <div className="mt-5 space-y-3">
              {items.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-100 bg-diner-cream/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-diner-black">{item.title}</p>
                    <ChevronRight className="h-4 w-4 text-diner-red" />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gray-400">{item.layerName}</p>
                  <p className="mt-3 text-sm text-gray-600">{item.owner}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Settings2 className="h-5 w-5 text-diner-teal" />
              <h2 className="text-xl text-diner-black">System Notes</h2>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-diner-black px-5 py-4 text-white">
                <p className="text-[10px] font-display uppercase tracking-[0.3em] text-white/50">Storage</p>
                <p className="mt-2 text-sm text-diner-cream">Local JSON in `data/franchise-brain.json` and `data/franchise-brain-signals.json` keeps the board portable while we learn the workflow; migrate live intake to SQLite/Supabase before heavy team usage.</p>
              </div>
              <div className="rounded-2xl bg-diner-teal/10 px-5 py-4">
                <div className="flex items-center gap-2 text-diner-teal">
                  <Clock3 className="h-4 w-4" />
                  <p className="text-[10px] font-display uppercase tracking-[0.28em]">Updated</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">{brain.updatedAt}</p>
              </div>
              <div className="rounded-2xl border border-dashed border-diner-red/30 px-5 py-4">
                <p className="text-[10px] font-display uppercase tracking-[0.28em] text-gray-400">API</p>
                <p className="mt-2 text-sm text-gray-600">Use `/api/franchise-brain` for structured intake, triage updates, and future admin actions. Protect this route before production exposure.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl text-diner-black">Reference Library</h2>
            <p className="mt-2 text-sm text-gray-500">These are the files Flo should retrieve before answering content, ops, catering, or franchise questions.</p>
            <div className="mt-5 space-y-3">
              {commandCenter.referenceFiles.map((file) => (
                <div key={file.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-diner-black">{file.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-diner-red">{file.layerName} · {file.type}</p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-gray-400">MD</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{file.summary}</p>
                  <p className="mt-3 rounded-xl bg-white px-3 py-2 font-mono text-[11px] text-gray-500">{file.path}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
