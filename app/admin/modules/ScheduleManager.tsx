'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from 'lucide-react';
import { AUDIENCES, DAYS, type Audience, type Day, type ScheduleRow } from '@/lib/supabase/types';
import { useToast } from '../Toast';

const DAY_LABEL: Record<Day, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};
const AUDIENCE_LABEL: Record<Audience, string> = {
  ikhwan: 'Men (ikhwan)', akhwat: 'Women (akhwat)', umum: 'General (umum)',
};
const DAY_RANK: Record<Day, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

type Draft = {
  id?: string;
  day: Day;
  time: string;
  topic: string;
  ustadz: string;
  audience: Audience;
  sort_order: number;
};

const emptyDraft: Draft = { day: 'Mon', time: '', topic: '', ustadz: '', audience: 'umum', sort_order: 0 };

export function ScheduleManager({ initial }: { initial: ScheduleRow[] }) {
  const { notify } = useToast();
  const [entries, setEntries] = useState<ScheduleRow[]>(sortRows(initial));
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function sortRows(rows: ScheduleRow[]) {
    return [...rows].sort((a, b) => DAY_RANK[a.day] - DAY_RANK[b.day] || a.sort_order - b.sort_order);
  }

  const refresh = async () => {
    const res = await fetch('/api/admin/schedule', { cache: 'no-store' });
    if (res.ok) {
      const json = (await res.json()) as { entries: ScheduleRow[] };
      setEntries(sortRows(json.entries));
    }
  };

  const save = async () => {
    if (!draft) return;
    setError('');
    if (!draft.time.trim() || !draft.topic.trim()) {
      setError('Time and topic are required.');
      return;
    }
    setBusy(true);
    try {
      const isEdit = Boolean(draft.id);
      const res = await fetch('/api/admin/schedule', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || 'Failed to save.');
        return;
      }
      setDraft(null);
      await refresh();
      notify(isEdit ? 'Entry updated' : 'Entry added');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this schedule entry?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/schedule?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        await refresh();
        notify('Entry deleted');
      }
    } finally {
      setBusy(false);
    }
  };

  const move = async (entry: ScheduleRow, dir: -1 | 1) => {
    const sameDay = entries.filter((e) => e.day === entry.day);
    const idx = sameDay.findIndex((e) => e.id === entry.id);
    const swapWith = sameDay[idx + dir];
    if (!swapWith) return;
    setBusy(true);
    try {
      await Promise.all([
        fetch('/api/admin/schedule', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...entry, sort_order: swapWith.sort_order }),
        }),
        fetch('/api/admin/schedule', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...swapWith, sort_order: entry.sort_order }),
        }),
      ]);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{entries.length} entries</p>
        <button
          onClick={() => {
            setError('');
            setDraft({ ...emptyDraft, sort_order: entries.length });
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add entry
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-primary/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Topic / Book</th>
              <th className="px-4 py-3 font-medium">Teacher</th>
              <th className="px-4 py-3 font-medium">Audience</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {entries.map((e) => (
              <tr key={e.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 font-medium text-primary">{DAY_LABEL[e.day]}</td>
                <td className="px-4 py-3">{e.time}</td>
                <td className="px-4 py-3">{e.topic}</td>
                <td className="px-4 py-3 text-ink/70">{e.ustadz}</td>
                <td className="px-4 py-3 text-ink/70">{AUDIENCE_LABEL[e.audience]}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => move(e, -1)} disabled={busy} title="Move up" className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => move(e, 1)} disabled={busy} title="Move down" className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button onClick={() => { setError(''); setDraft({ ...e }); }} title="Edit" className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(e.id)} disabled={busy} title="Delete" className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-40">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">No entries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">{draft.id ? 'Edit entry' : 'New entry'}</h2>
              <button onClick={() => setDraft(null)} className="rounded p-1 text-muted hover:bg-primary/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm">
                  <span className="text-muted">Day</span>
                  <select value={draft.day} onChange={(ev) => setDraft({ ...draft, day: ev.target.value as Day })} className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary">
                    {DAYS.map((d) => <option key={d} value={d}>{DAY_LABEL[d]}</option>)}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="text-muted">Audience</span>
                  <select value={draft.audience} onChange={(ev) => setDraft({ ...draft, audience: ev.target.value as Audience })} className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary">
                    {AUDIENCES.map((a) => <option key={a} value={a}>{AUDIENCE_LABEL[a]}</option>)}
                  </select>
                </label>
              </div>
              <label className="block text-sm">
                <span className="text-muted">Time</span>
                <input value={draft.time} onChange={(ev) => setDraft({ ...draft, time: ev.target.value })} placeholder="e.g. Ba'da Maghrib or 19:30 WITA" className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary" />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Topic / Book</span>
                <input value={draft.topic} onChange={(ev) => setDraft({ ...draft, topic: ev.target.value })} placeholder="e.g. Kajian Rutin — Tafsir" className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary" />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Teacher (ustadz)</span>
                <input value={draft.ustadz} onChange={(ev) => setDraft({ ...draft, ustadz: ev.target.value })} placeholder="e.g. Ustadz Fulan" className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary" />
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDraft(null)} className="rounded-full px-4 py-2 text-sm text-muted hover:bg-primary/5">Cancel</button>
              <button onClick={save} disabled={busy} className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60">
                {busy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
