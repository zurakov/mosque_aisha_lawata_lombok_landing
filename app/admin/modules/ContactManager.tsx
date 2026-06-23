'use client';

import { useState } from 'react';
import type { ContactRow } from '@/lib/supabase/types';
import { useToast } from '../Toast';

export function ContactManager({ initial }: { initial: ContactRow | null }) {
  const { notify } = useToast();
  const [form, setForm] = useState({
    phone: initial?.phone ?? '',
    whatsapp: initial?.whatsapp ?? '',
    email: initial?.email ?? '',
    address_en: initial?.address_en ?? '',
    address_id: initial?.address_id ?? '',
  });
  const [busy, setBusy] = useState(false);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      notify(res.ok ? 'Contact info saved' : 'Failed to save', res.ok ? 'success' : 'error');
    } finally {
      setBusy(false);
    }
  };

  const field = (label: string, key: keyof typeof form, placeholder = '', textarea = false) => (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      {textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => update(key, e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary"
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => update(key, e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 outline-none focus:border-primary"
        />
      )}
    </label>
  );

  return (
    <div className="max-w-2xl">
      <div className="space-y-4 rounded-xl border border-primary/10 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {field('Phone (display)', 'phone', '+62 812-3456-789')}
          {field('WhatsApp (digits only)', 'whatsapp', '628123456789')}
        </div>
        {field('Email', 'email', 'info@example.id')}
        {field('Address (English)', 'address_en', '', true)}
        {field('Address (Indonesian)', 'address_id', '', true)}
        <div className="flex justify-end">
          <button onClick={save} disabled={busy} className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60">
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
