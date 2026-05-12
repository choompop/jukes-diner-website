'use client';

import { useMemo, useState, useTransition } from 'react';
import { CheckCircle2, CircleDot, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const STATUS_OPTIONS = ['new', 'triaged', 'in_progress', 'waiting', 'done', 'archived'];
const PRIORITY_OPTIONS = ['low', 'normal', 'high', 'urgent'];
const TYPE_OPTIONS = [
  'ops_note',
  'content_idea',
  'catering_lead',
  'booking_lead',
  'customer_feedback',
  'sop_update',
  'vendor_issue',
  'team_loop',
];
const LAYER_OPTIONS = [
  ['internal-ops', 'Internal Ops'],
  ['content-pipeline', 'Content Pipeline'],
];

function titleize(value) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SignalTriagePanel({ initialSignals = [] }) {
  const [signals, setSignals] = useState(initialSignals);
  const [selectedId, setSelectedId] = useState(initialSignals[0]?.id || '');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({ query: '', status: 'open', layerId: '', priority: '' });

  const visibleSignals = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return signals.filter((signal) => {
      if (filters.status === 'open' && ['done', 'archived'].includes(signal.status)) return false;
      if (filters.status && filters.status !== 'open' && signal.status !== filters.status) return false;
      if (filters.layerId && signal.layerId !== filters.layerId) return false;
      if (filters.priority && signal.priority !== filters.priority) return false;
      if (!query) return true;
      return [signal.title, signal.summary, signal.rawText, signal.owner, signal.type, ...(signal.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [signals, filters]);

  const selected = useMemo(
    () => visibleSignals.find((signal) => signal.id === selectedId) || visibleSignals[0] || signals[0],
    [signals, visibleSignals, selectedId],
  );

  function updateSelected(patch) {
    if (!selected) return;
    setSignals((current) => current.map((signal) => (
      signal.id === selected.id ? { ...signal, ...patch } : signal
    )));
  }

  function saveSignal(overrides = {}) {
    if (!selected) return;
    const payload = { ...selected, ...overrides };
    setMessage('');
    startTransition(async () => {
      const res = await fetch('/api/franchise-brain', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, updates: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Could not save triage update.');
        return;
      }
      setSignals(data.signals || signals);
      const nextId = data.signal?.id || data.item?.id || selected.id;
      setSelectedId(nextId);
      setMessage(data.converted ? 'Converted into an operating card.' : data.archived ? 'Archived with audit trail.' : 'Saved to the brain.');
    });
  }

  function quickStatus(status) {
    updateSelected({ status });
    saveSignal({ status });
  }

  function runAction(action, extra = {}) {
    if (!selected) return;
    setMessage('');
    startTransition(async () => {
      const res = await fetch('/api/franchise-brain', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Action failed.');
        return;
      }
      setSignals(data.signals || signals);
      setSelectedId(data.signal?.id || data.item?.id || selected.id);
      setMessage(data.converted ? 'Converted into an operating card.' : data.archived ? 'Archived with audit trail.' : 'Saved.');
    });
  }

  if (!signals.length) {
    return (
      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl text-diner-black">Triage Console</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          No signals yet. When Flo captures Slack DMs, mentions, catering notes, or ops issues, they will appear here for owner/status routing.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-display uppercase tracking-[0.28em] text-diner-red">Actionable Intake</p>
          <h2 className="mt-2 text-xl text-diner-black">Triage Console</h2>
        </div>
        {isPending ? <Loader2 className="h-5 w-5 animate-spin text-diner-red" /> : <CircleDot className="h-5 w-5 text-diner-teal" />}
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl bg-diner-cream/70 p-4">
        <input
          value={filters.query}
          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red"
          placeholder="Search signals, owners, tags..."
        />
        <div className="grid gap-2 sm:grid-cols-3">
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-diner-black">
            <option value="open">Open</option>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{titleize(status)}</option>)}
          </select>
          <select value={filters.layerId} onChange={(event) => setFilters((current) => ({ ...current, layerId: event.target.value }))} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-diner-black">
            <option value="">All layers</option>
            {LAYER_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-diner-black">
            <option value="">Priority</option>
            {PRIORITY_OPTIONS.map((priority) => <option key={priority} value={priority}>{titleize(priority)}</option>)}
          </select>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Showing {visibleSignals.length} of {signals.length} signals</p>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400" htmlFor="signal-select">
          Signal
        </label>
        <select
          id="signal-select"
          value={selected?.id || ''}
          onChange={(event) => setSelectedId(event.target.value)}
          className="rounded-2xl border border-gray-200 bg-diner-cream px-4 py-3 text-sm font-bold text-diner-black outline-none focus:border-diner-red"
        >
          {visibleSignals.map((signal) => (
            <option key={signal.id} value={signal.id}>{signal.title}</option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{selected.source?.platform || 'manual'}</span>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{selected.source?.channel || 'unassigned'}</span>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-diner-red">{selected.priority}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-700">{selected.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Status">
              <select value={selected.status} onChange={(event) => updateSelected({ status: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red">
                {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{titleize(status)}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select value={selected.priority} onChange={(event) => updateSelected({ priority: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red">
                {PRIORITY_OPTIONS.map((priority) => <option key={priority} value={priority}>{titleize(priority)}</option>)}
              </select>
            </Field>
            <Field label="Type">
              <select value={selected.type} onChange={(event) => updateSelected({ type: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red">
                {TYPE_OPTIONS.map((type) => <option key={type} value={type}>{titleize(type)}</option>)}
              </select>
            </Field>
            <Field label="Layer">
              <select value={selected.layerId} onChange={(event) => updateSelected({ layerId: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red">
                {LAYER_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Owner">
            <input value={selected.owner} onChange={(event) => updateSelected({ owner: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red" placeholder="Who owns next step?" />
          </Field>
          <Field label="Next Action">
            <textarea value={selected.nextAction || ''} onChange={(event) => updateSelected({ nextAction: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red min-h-24" placeholder="What should happen next?" />
          </Field>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => quickStatus('triaged')} className="rounded-full bg-diner-teal px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Mark Triaged
            </button>
            <button type="button" onClick={() => quickStatus('done')} className="rounded-full bg-diner-black px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Mark Done
            </button>
            <button type="button" onClick={() => saveSignal()} className="rounded-full bg-diner-red px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Save Update
            </button>
            <button type="button" onClick={() => runAction('convert', { options: selected })} className="rounded-full border border-diner-teal px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-diner-teal">
              Convert to Card
            </button>
            <button type="button" onClick={() => runAction('archive', { reason: selected.nextAction || 'No further action.' })} className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Archive
            </button>
          </div>

          {message && (
            <p className={cn('flex items-center gap-2 text-sm', message.includes('Could') ? 'text-diner-red' : 'text-emerald-700')}>
              {!message.includes('Could') && <CheckCircle2 className="h-4 w-4" />}
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">{label}</span>
      {children}
    </label>
  );
}
