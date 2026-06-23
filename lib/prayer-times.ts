/**
 * lib/prayer-times.ts
 *
 * Fetches prayer times from the Aladhan API (KEMENAG / Indonesia method),
 * normalizes them into a typed, display-ordered result, and computes the
 * current + next prayer with a countdown — all anchored to Mataram (WITA).
 *
 * This module runs on the server (called from the API route). The client gets
 * the already-parsed JSON and only re-runs the countdown math.
 */

import { siteConfig } from '@/config/site';
import { dateInTimezone, formatAladhanDate, secondsSinceMidnight } from '@/lib/utils';

const ALADHAN_BASE = 'https://api.aladhan.com/v1/timings';
const METHOD_KEMENAG = 20; // Indonesian Ministry of Religious Affairs.
const SCHOOL_SHAFII = 0;

/** Canonical keys, in display order. "Jumuah" is derived, not from the API. */
export type PrayerKey =
  | 'Imsak'
  | 'Fajr'
  | 'Sunrise'
  | 'Dhuhr'
  | 'Asr'
  | 'Maghrib'
  | 'Isha';

/** Keys that count as actual prayer windows for current/next computation. */
const TIMELINE_KEYS: PrayerKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/** Full ordered set shown in the grid (includes informational Imsak/Sunrise). */
const DISPLAY_KEYS: PrayerKey[] = [
  'Imsak',
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
];

export interface PrayerTime {
  key: PrayerKey;
  /** "HH:MM" 24-hour, seconds dropped, any "(WITA)" suffix stripped. */
  time: string;
  /** Seconds since midnight for ordering/comparison. */
  seconds: number;
  /** Informational rows (Imsak, Sunrise) are not prayer windows. */
  isPrayer: boolean;
}

export interface PrayerTimesResult {
  /** Gregorian readable date, e.g. "23 Jun 2026". */
  date: string;
  /** Hijri date, e.g. "8 Dhū al-Ḥijjah 1447". */
  hijriDate: string;
  hijriDateId: string;
  times: PrayerTime[];
  /** Whether today is Friday in Mataram (drives Jumu'ah label). */
  isFriday: boolean;
  /** Key of the current prayer window, or null before Fajr. */
  current: PrayerKey | null;
  /** Key of the next upcoming prayer. */
  next: PrayerKey | null;
  /** Whether `next` belongs to tomorrow (Fajr after Isha rollover). */
  nextIsTomorrow: boolean;
  /** Seconds until the next prayer, at the moment of computation. */
  secondsToNext: number;
  /** Epoch ms (UTC) when the result was computed — client recomputes from this. */
  computedAt: number;
}

export class PrayerTimesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrayerTimesError';
  }
}

interface AladhanTimings {
  [key: string]: string;
}

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: AladhanTimings;
    date: {
      readable: string;
      hijri: {
        day: string;
        year: string;
        month: { en: string; ar: string; number: number };
      };
    };
  };
}

/** Strip seconds and any "(WITA)"/timezone suffix Aladhan may append. */
function cleanTime(raw: string): string {
  return raw.trim().split(' ')[0].slice(0, 5);
}

function toSeconds(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 3600 + m * 60;
}

async function fetchAladhan(dateStr: string): Promise<AladhanResponse> {
  const { lat, lng } = siteConfig.coordinates;
  const url =
    `${ALADHAN_BASE}/${dateStr}` +
    `?latitude=${lat}&longitude=${lng}` +
    `&method=${METHOD_KEMENAG}&school=${SCHOOL_SHAFII}` +
    `&timezonestring=${encodeURIComponent(siteConfig.timezone)}`;

  // Cache per-day at the data layer; the route also sets cache headers.
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new PrayerTimesError(`Aladhan responded ${res.status}`);
  }
  const json = (await res.json()) as AladhanResponse;
  if (json.code !== 200 || !json.data?.timings) {
    throw new PrayerTimesError('Unexpected Aladhan response shape');
  }
  return json;
}

/** Hijri month names in Indonesian (Aladhan only returns EN/AR). */
const HIJRI_MONTHS_ID: Record<number, string> = {
  1: 'Muharram', 2: 'Safar', 3: "Rabiul Awal", 4: 'Rabiul Akhir',
  5: 'Jumadil Awal', 6: 'Jumadil Akhir', 7: 'Rajab', 8: "Sya'ban",
  9: 'Ramadhan', 10: 'Syawal', 11: "Dzulqa'dah", 12: 'Dzulhijjah',
};

/**
 * Fetches today's times for Mataram and computes the current/next prayer.
 * If today's Isha has passed, the next prayer is tomorrow's Fajr (a second
 * fetch is made for the accurate value).
 */
export async function getPrayerTimes(now: Date = new Date()): Promise<PrayerTimesResult> {
  const tz = siteConfig.timezone;
  const todayStr = formatAladhanDate(tz, now);
  const today = await fetchAladhan(todayStr);

  const timings = today.data.timings;

  const times: PrayerTime[] = DISPLAY_KEYS.map((key) => {
    const time = cleanTime(timings[key] ?? '00:00');
    return {
      key,
      time,
      seconds: toSeconds(time),
      isPrayer: TIMELINE_KEYS.includes(key),
    };
  });

  const nowSeconds = secondsSinceMidnight(tz, now);
  const { weekday } = dateInTimezone(tz, now);
  const isFriday = weekday === 5;

  // Timeline of actual prayers, ascending.
  const timeline = times
    .filter((t) => t.isPrayer)
    .sort((a, b) => a.seconds - b.seconds);

  let current: PrayerKey | null = null;
  let next: PrayerKey | null = null;
  let secondsToNext = 0;
  let nextIsTomorrow = false;

  for (let i = 0; i < timeline.length; i++) {
    if (nowSeconds < timeline[i].seconds) {
      next = timeline[i].key;
      current = i > 0 ? timeline[i - 1].key : null; // null before Fajr
      secondsToNext = timeline[i].seconds - nowSeconds;
      break;
    }
  }

  // After Isha → roll over to tomorrow's Fajr.
  if (!next) {
    current = timeline[timeline.length - 1]?.key ?? null; // Isha
    nextIsTomorrow = true;
    next = 'Fajr';

    const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
    const tomorrowStr = formatAladhanDate(tz, tomorrow);
    try {
      const tdata = await fetchAladhan(tomorrowStr);
      const fajrTomorrow = toSeconds(cleanTime(tdata.data.timings.Fajr));
      // Seconds left today + seconds into tomorrow until Fajr.
      secondsToNext = 24 * 3600 - nowSeconds + fajrTomorrow;
    } catch {
      // Fallback: reuse today's Fajr offset.
      const fajrToday = timeline.find((t) => t.key === 'Fajr')?.seconds ?? 0;
      secondsToNext = 24 * 3600 - nowSeconds + fajrToday;
    }
  }

  const hijri = today.data.date.hijri;
  const hijriDate = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;
  const hijriDateId = `${hijri.day} ${HIJRI_MONTHS_ID[hijri.month.number] ?? hijri.month.en} ${hijri.year} H`;

  return {
    date: today.data.date.readable,
    hijriDate,
    hijriDateId,
    times,
    isFriday,
    current,
    next,
    nextIsTomorrow,
    secondsToNext,
    computedAt: Date.now(),
  };
}

export { DISPLAY_KEYS, TIMELINE_KEYS };
