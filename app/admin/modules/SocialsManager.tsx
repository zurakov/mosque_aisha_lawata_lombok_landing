'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import type { SocialRow } from '@/lib/supabase/types';
import { useToast } from '../Toast';

const PLATFORMS = ['instagram', 'youtube', 'facebook', 'tiktok', 'twitter', 'telegram', 'whatsapp', 'website'];

export function SocialsManager({ initial }: { initial: SocialRow[] }) {
  const { notify } = useToast();
  const [socials, setSocials] = useState<SocialRow[]>(
    [...initial].sort((a, b) => a.sort_order - b.sort_order),
  );
  const [platform, setPlatform] = useState('instagram');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const res = await fetch('/api/admin/socials', { cache: 'no-store' });
    if (res.ok) {
      const json = (await res.json()) as { socials: SocialRow[] };
      setSocials([...json.socials].sort((a, b) => a.sort_order - b.sort_order));
    }
  };

  const add = async () => {
    if (!url.trim()) {
      notify('URL is required', 'error');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin/socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, url, sort_order: socials.length, active: true }),
      });
      if (res.ok) {
        setUrl('');
        await refresh();
        notify('Link added');
      } else {
        notify('Failed to add link', 'error');
      }
    } finally {
      setBusy(false);
    }
  };

  const patch = async (id: string, body: Partial<SocialRow>) => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/socials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      });
      if (res.ok) await refresh();
    } finally {
      setBusy(false);
    }
  };

  const move = async (s: SocialRow, dir: -1 | 1) => {
    const idx = socials.findIndex((x) => x.id === s.id);
    const swapWith = socials[idx + dir];
    if (!swapWith) return;
    setBusy(true);
    try {
      await Promise.all([
        patchRaw(s.id, swapWith.sort_order),
        patchRaw(swapWith.id, s.sort_order),
      ]);
      await refresh();
    } finally {
      setBusy(false);
    }
  };
  const patchRaw = (id: string, sort_order: number) =>
    fetch('/api/admin/socials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, sort_order }) });

  const remove = async (id: string) => {
    if (!confirm('Delete this link?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/socials?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        await refresh();
        notify('Link deleted');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Add form */}
      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-primary/10 bg-white p-4 sm:flex-row sm:items-end">
        <label className="text-sm sm:w-40">
          <span className="text-muted">Platform</span>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="flex-1 text-sm">
          <span className="text-muted">URL</span>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary" />
        </label>
        <button onClick={add} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-primary/5 rounded-xl border border-primary/10 bg-white">
        {socials.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-3 p-3">
            <span className="w-24 shrink-0 text-sm font-medium capitalize text-primary">{s.platform}</span>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-sm text-ink/70 hover:text-primary">{s.url}</a>
            <div className="flex gap-1">
              <button onClick={() => move(s, -1)} disabled={busy || idx === 0} title="Move up" className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => move(s, 1)} disabled={busy || idx === socials.length - 1} title="Move down" className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => patch(s.id, { active: !s.active })} disabled={busy} title={s.active ? 'Hide' : 'Show'} className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40">
                {s.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => remove(s.id)} disabled={busy} title="Delete" className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {socials.length === 0 && <div className="p-8 text-center text-sm text-muted">No social links yet.</div>}
      </div>
    </div>
  );
}
