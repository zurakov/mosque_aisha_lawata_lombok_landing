import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './config';

/**
 * Refreshes the Supabase auth session on each request and returns both the
 * (cookie-updated) response and the current user. The middleware uses the user
 * to gate /admin routes.
 */
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: { id: string; email?: string } | null;
}> {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) {
    return { response, user: null };
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user: user ? { id: user.id, email: user.email } : null };
}
