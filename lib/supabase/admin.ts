import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from './config';

/**
 * Service-role Supabase client — SERVER ONLY. Bypasses RLS, so it is used in
 * admin route handlers ONLY after the caller's auth session has been verified.
 * Never import this into client code (the `server-only` guard enforces it).
 */
export function createAdminClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
