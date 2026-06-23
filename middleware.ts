import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { SESSION_COOKIE, verifySessionToken } from './lib/auth';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin area: gate /admin and /api/admin/* behind a valid session ──
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');
  // The login endpoint and the login page itself must stay public.
  const isLoginApi = pathname === '/api/admin/login';
  const isLoginPage = pathname === '/admin/login';

  if (isAdminApi && !isLoginApi) {
    const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (!ok) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (isAdminPage && !isLoginPage) {
    const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Login page/endpoint and other admin-api are handled above; let them pass.
  if (isAdminPage || isAdminApi) return NextResponse.next();

  // Non-admin API routes (e.g. /api/prayer-times) bypass locale routing.
  if (pathname.startsWith('/api/')) return NextResponse.next();

  // ── Everything else: locale routing via next-intl ──
  return intlMiddleware(req);
}

export const config = {
  // Run on app routes + admin, but skip Next internals and static files.
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
