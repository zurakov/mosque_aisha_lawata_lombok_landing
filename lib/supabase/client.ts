'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/** Browser Supabase client (anon key) — used by admin client components for
 *  auth (login/logout) and authenticated reads. */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
