import { MosqueIcon } from '@/components/ui/MosqueIcon';

/** Shown at /admin when Supabase env vars aren't set yet. */
export function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-primary/10 bg-white p-8 shadow-card">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-accent">
            <MosqueIcon className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-semibold text-primary">Admin setup required</h1>
        </div>
        <p className="mt-4 text-sm text-ink/80">
          The admin dashboard is backed by Supabase, which isn’t configured yet.
          To enable it:
        </p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink/80">
          <li>Create a free Supabase project.</li>
          <li>
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{' '}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code>.
          </li>
          <li>
            Run <code>supabase/schema.sql</code> in the Supabase SQL editor.
          </li>
          <li>Create one admin user under Authentication → Users.</li>
        </ol>
        <p className="mt-4 text-xs text-muted">
          Full steps are in <code>supabase/README.md</code>. Until then, the public
          site runs on bundled placeholder content.
        </p>
        <a
          href="/id"
          className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          ← Back to site
        </a>
      </div>
    </div>
  );
}
