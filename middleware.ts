import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { isSupabaseConfigured } from './lib/supabase/config';

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');
  const isLoginPage = pathname === '/admin/login';

  // ── Admin area: refresh Supabase session and gate on a logged-in user ──
  if (isAdminPage || isAdminApi) {
    // Always refresh the session cookies first.
    const { response, user } = await updateSession(req);

    // When Supabase isn't configured yet, let the pages render their own
    // "setup required" notice instead of redirect-looping.
    if (!isSupabaseConfigured) return response;

    if (!user) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
      }
      if (!isLoginPage) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    }
    return response;
  }

  // Non-admin API routes (e.g. /api/prayer-times) bypass locale routing.
  if (pathname.startsWith('/api/')) return NextResponse.next();

  // ── Everything else: locale routing via next-intl ──
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
