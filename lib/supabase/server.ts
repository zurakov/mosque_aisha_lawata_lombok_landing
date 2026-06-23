import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/**
 * Server Supabase client bound to the request cookies. Used in server
 * components, route handlers and middleware to read the auth session and run
 * RLS-scoped queries as the logged-in user (or anon).
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // `setAll` is called from a Server Component — safe to ignore when the
          // middleware is responsible for refreshing the session cookie.
        }
      },
    },
  });
}
