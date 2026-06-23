'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MosqueIcon } from '@/components/ui/MosqueIcon';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Incorrect email or password.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-primary/10 bg-white p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-accent">
            <MosqueIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-primary">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Masjid Aisyah Lawata</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
            Supabase is not configured yet. Add your keys to <code>.env.local</code> and
            run <code>supabase/schema.sql</code> — see <code>supabase/README.md</code>.
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!isSupabaseConfigured}
              className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-accent/40 disabled:bg-surface"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!isSupabaseConfigured}
              className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-accent/40 disabled:bg-surface"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          <a href="/id" className="hover:text-primary">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
