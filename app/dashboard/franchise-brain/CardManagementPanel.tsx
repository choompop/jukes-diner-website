'use client';

import { useMemo, useState, useTransition } from 'react';
import { Archive, CheckCircle2, Loader2, Save } from 'lucide-react';

import { cn } from '@/lib/utils';

const STATUS_OPTIONS = ['active', 'planned', 'blocked', 'done', 'archived'];
const PRIORITY_OPTIONS = ['low', 'normal', 'medium', 'high', 'urgent'];
const LAYER_OPTIONS = [
  ['content-pipeline', 'Content Pipeline'],
  ['internal-ops', 'Internal Ops'],
];

const blankNewCard = {
  layerId: 'internal-ops',
  title: '',
  summary: '',
  owner: 'Unassigned',
  status: 'planned',
  priority: 'normal',
  cadence: 'as needed',
  inputs: [],
  outputs: [],
};

function titleize(value) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function listToText(value = []) {
  return Array.isArray(value) ? value.join(', ') : '';
}

export default function CardManagementPanel({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(initialItems[0]?.id || '');
  const [newCard, setNewCard] = useState(blankNewCard);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) || items[0],
    [items, selectedId],
  );

  function updateSelected(patch) {
    if (!selected) return;
    setItems((current) => current.map((item) => (
      item.id === selected.id ? { ...item, ...patch } : item
    )));
  }

  function createItem() {
    if (!newCard.title.trim()) {
      setMessage('Add a card title before creating it.');
      return;
    }
    setMessage('');

    startTransition(async () => {
      const res = await fetch('/api/franchise-brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createItem', updates: newCard }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Could not create card.');
        return;
      }
      setItems(data.items || items);
      setSelectedId(data.item?.id || selectedId);
      setNewCard(blankNewCard);
      setMessage('New operating card created.');
    });
  }

  function saveItem(action = 'updateItem') {
    if (!selected) return;
    setMessage('');
    const payload = {
      layerId: selected.layerId,
      title: selected.title,
      summary: selected.summary,
      owner: selected.owner,
      status: selected.status,
      priority: selected.priority,
      cadence: selected.cadence,
      inputs: selected.inputs,
      outputs: selected.outputs,
    };

    startTransition(async () => {
      const res = await fetch('/api/franchise-brain', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: selected.id, action, updates: payload, reason: 'Archived from dashboard card controls.' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Could not save card update.');
        return;
      }
      setItems(data.items || items);
      setSelectedId(data.item?.id || selected.id);
      setMessage(data.itemArchived ? 'Archived card without deleting history.' : 'Operating card saved.');
    });
  }

  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-display uppercase tracking-[0.28em] text-diner-red">Canonical Controls</p>
          <h2 className="mt-2 text-xl text-diner-black">Brain Card Manager</h2>
        </div>
        {isPending ? <Loader2 className="h-5 w-5 animate-spin text-diner-red" /> : <Save className="h-5 w-5 text-diner-teal" />}
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-500">
        Edit the durable operating cards after a signal is converted. This keeps owners, priorities, and archives out of John&apos;s head.
      </p>

      <div className="mt-5 rounded-[1.5rem] border border-dashed border-diner-teal/30 bg-diner-teal/5 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-diner-teal">Create Card</p>
        <p className="mt-2 text-xs leading-5 text-gray-500">
          Add known operator work directly when it does not need to come from the signal inbox first.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            aria-label="New card title"
            placeholder="Card title"
            value={newCard.title}
            onChange={(event) => setNewCard((current) => ({ ...current, title: event.target.value }))}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red"
          />
          <input
            aria-label="New card owner"
            placeholder="Owner"
            value={newCard.owner}
            onChange={(event) => setNewCard((current) => ({ ...current, owner: event.target.value }))}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red"
          />
          <select
            aria-label="New card layer"
            value={newCard.layerId}
            onChange={(event) => setNewCard((current) => ({ ...current, layerId: event.target.value }))}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red"
          >
            {LAYER_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select
            aria-label="New card priority"
            value={newCard.priority}
            onChange={(event) => setNewCard((current) => ({ ...current, priority: event.target.value }))}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red"
          >
            {PRIORITY_OPTIONS.map((priority) => <option key={priority} value={priority}>{titleize(priority)}</option>)}
          </select>
        </div>
        <textarea
          aria-label="New card summary"
          placeholder="Summary / next action"
          value={newCard.summary}
          onChange={(event) => setNewCard((current) => ({ ...current, summary: event.target.value }))}
          className="mt-3 min-h-20 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red"
        />
        <button type="button" onClick={createItem} className="mt-3 rounded-full bg-diner-teal px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
          Create Card
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400" htmlFor="card-select">
          Card
        </label>
        <select
          id="card-select"
          value={selected?.id || ''}
          onChange={(event) => setSelectedId(event.target.value)}
          className="rounded-2xl border border-gray-200 bg-diner-cream px-4 py-3 text-sm font-bold text-diner-black outline-none focus:border-diner-red"
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>{item.layerName}: {item.title}</option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="mt-5 space-y-4">
          <Field label="Title">
            <input value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red" />
          </Field>
          <Field label="Summary">
            <textarea value={selected.summary} onChange={(event) => updateSelected({ summary: event.target.value })} className="min-h-24 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Owner">
              <input value={selected.owner} onChange={(event) => updateSelected({ owner: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red" />
            </Field>
            <Field label="Cadence">
              <input value={selected.cadence} onChange={(event) => updateSelected({ cadence: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red" />
            </Field>
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
            <Field label="Layer">
              <select value={selected.layerId} onChange={(event) => updateSelected({ layerId: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red">
                {LAYER_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Inputs (comma separated)">
            <textarea value={listToText(selected.inputs)} onChange={(event) => updateSelected({ inputs: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className="min-h-20 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red" />
          </Field>
          <Field label="Outputs (comma separated)">
            <textarea value={listToText(selected.outputs)} onChange={(event) => updateSelected({ outputs: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className="min-h-20 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-diner-black outline-none focus:border-diner-red" />
          </Field>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => saveItem('updateItem')} className="rounded-full bg-diner-red px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Save Card
            </button>
            <button type="button" onClick={() => saveItem('archiveItem')} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              <Archive className="h-3 w-3" /> Archive
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
