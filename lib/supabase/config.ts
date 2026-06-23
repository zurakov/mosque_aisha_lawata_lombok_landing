/**
 * Central place to read Supabase env + detect whether it's configured.
 * The whole app degrades gracefully when these are blank (public site falls
 * back to bundled placeholder data; /admin shows a setup notice).
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
export const SUPABASE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'mosque-images';

/** True only when the public client can be constructed. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** True only when server-side admin writes are possible. */
export const isSupabaseAdminConfigured = Boolean(
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY,
);
