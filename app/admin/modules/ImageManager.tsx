'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2, Upload } from 'lucide-react';
import type { ImageRow } from '@/lib/supabase/types';
import { useToast } from '../Toast';

/**
 * Reusable image manager for the hero_images and gallery_images tables.
 * `endpoint` is the admin API base (e.g. '/api/admin/hero'); `folder` is the
 * storage subfolder uploads go into.
 */
export function ImageManager({
  initial,
  endpoint,
  folder,
}: {
  initial: ImageRow[];
  endpoint: string;
  folder: string;
}) {
  const { notify } = useToast();
  const [images, setImages] = useState<ImageRow[]>(
    [...initial].sort((a, b) => a.sort_order - b.sort_order),
  );
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (res.ok) {
      const json = (await res.json()) as { images: ImageRow[] };
      setImages([...json.images].sort((a, b) => a.sort_order - b.sort_order));
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const up = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!up.ok) {
        const j = (await up.json().catch(() => ({}))) as { error?: string };
        notify(j.error || 'Upload failed', 'error');
        return;
      }
      const { path, publicUrl } = (await up.json()) as { path: string; publicUrl: string };
      const create = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_url: publicUrl,
          storage_path: path,
          alt: '',
          sort_order: images.length,
          active: true,
        }),
      });
      if (!create.ok) {
        notify('Saved file but failed to add row', 'error');
        return;
      }
      await refresh();
      notify('Image uploaded');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const patch = async (id: string, body: Partial<ImageRow>) => {
    setBusy(true);
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      });
      if (res.ok) await refresh();
    } finally {
      setBusy(false);
    }
  };

  const move = async (img: ImageRow, dir: -1 | 1) => {
    const idx = images.findIndex((i) => i.id === img.id);
    const swapWith = images[idx + dir];
    if (!swapWith) return;
    setBusy(true);
    try {
      await Promise.all([
        fetch(endpoint, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: img.id, sort_order: swapWith.sort_order }) }),
        fetch(endpoint, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: swapWith.id, sort_order: img.sort_order }) }),
      ]);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    setBusy(true);
    try {
      const res = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        await refresh();
        notify('Image deleted');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{images.length} images</p>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          <Upload className="h-4 w-4" />
          {busy ? 'Working…' : 'Upload image'}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={busy} />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary/20 bg-white p-10 text-center text-sm text-muted">
          No images yet. Upload one — until then the site shows bundled placeholder photos.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, idx) => (
            <div key={img.id} className="overflow-hidden rounded-xl border border-primary/10 bg-white">
              <div className="relative aspect-[4/3] bg-surface">
                {/* Unoptimized: arbitrary external Supabase URLs */}
                <Image src={img.public_url} alt={img.alt || ''} fill unoptimized className="object-cover" sizes="(max-width:640px) 100vw, 33vw" />
                {!img.active && (
                  <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] uppercase text-white">Hidden</span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <input
                  defaultValue={img.alt || ''}
                  onBlur={(e) => {
                    if (e.target.value !== (img.alt || '')) patch(img.id, { alt: e.target.value });
                  }}
                  placeholder="Alt text (description)"
                  className="w-full rounded-lg border border-primary/20 px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button onClick={() => move(img, -1)} disabled={busy || idx === 0} title="Move up" className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => move(img, 1)} disabled={busy || idx === images.length - 1} title="Move down" className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => patch(img.id, { active: !img.active })} disabled={busy} title={img.active ? 'Hide' : 'Show'} className="rounded p-1.5 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40">
                      {img.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => remove(img.id)} disabled={busy} title="Delete" className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-40">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
