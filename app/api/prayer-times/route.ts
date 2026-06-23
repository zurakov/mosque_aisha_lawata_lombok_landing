/**
 * GET /api/prayer-times
 *
 * Server proxy + cache around Aladhan. The browser hits this endpoint (same
 * origin → no CORS) and gets the already-parsed, timezone-correct result.
 * Cached per day at the Aladhan fetch layer; we also revalidate hourly so the
 * "current/next prayer" stays reasonably fresh on the server.
 */

import { NextResponse } from 'next/server';
import { getPrayerTimes, PrayerTimesError } from '@/lib/prayer-times';

// Revalidate the route's cached render hourly; the countdown is recomputed
// client-side from `computedAt`, so minute-level drift is handled in the UI.
export const revalidate = 3600;

export async function GET() {
  try {
    const data = await getPrayerTimes();
    return NextResponse.json(data, {
      headers: {
        // Allow CDN/browser to cache for an hour, serve stale while revalidating.
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    const message =
      err instanceof PrayerTimesError ? err.message : 'Failed to load prayer times';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
