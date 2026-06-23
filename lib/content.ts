import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  DAY_TO_WEEKDAY_INDEX,
  type Audience,
  type ContactRow,
  type Day,
  type ImageRow,
  type ScheduleRow,
  type SocialRow,
} from '@/lib/supabase/types';
import { heroImages as fallbackHero, galleryImages as fallbackGallery } from '@/config/gallery';
import { siteConfig } from '@/config/site';

/**
 * Public, read-only content access for server components.
 *
 * Every getter degrades gracefully: if Supabase isn't configured or a table is
 * empty / errors, it returns bundled placeholder data so the public site always
 * renders. Hero & gallery fall back to the mosque placeholder photos; schedule,
 * contact and socials fall back to the values in config/site + a seed list.
 */

export interface PublicImage {
  src: string;
  alt: { en: string; id: string };
}

export interface PublicScheduleEntry {
  id: string;
  day: Day;
  weekdayIndex: number; // 0=Sun..6=Sat for i18n day names
  time: string;
  topic: string;
  ustadz: string;
  audience: Audience;
}

export interface PublicContact {
  phone: string;
  whatsapp: string;
  email: string;
  address: { en: string; id: string };
}

export interface PublicSocial {
  platform: string;
  url: string;
}

const DAY_RANK: Record<Day, number> = {
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
};

// ── Hero images ──────────────────────────────────────────────────────────────
export async function getHeroImages(): Promise<PublicImage[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('hero_images')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      const rows = (data ?? []) as ImageRow[];
      if (rows.length > 0) {
        return rows.map((r) => ({
          src: r.public_url,
          alt: { en: r.alt ?? '', id: r.alt ?? '' },
        }));
      }
    } catch {
      // fall through to placeholders
    }
  }
  return fallbackHero.map((i) => ({ src: i.src, alt: i.alt }));
}

// ── Gallery images ───────────────────────────────────────────────────────────
export async function getGalleryImages(): Promise<PublicImage[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      const rows = (data ?? []) as ImageRow[];
      if (rows.length > 0) {
        return rows.map((r) => ({
          src: r.public_url,
          alt: { en: r.alt ?? '', id: r.alt ?? '' },
        }));
      }
    } catch {
      // fall through
    }
  }
  return fallbackGallery.map((i) => ({ src: i.src, alt: i.alt }));
}

// ── Weekly schedule ──────────────────────────────────────────────────────────
const FALLBACK_SCHEDULE: Omit<PublicScheduleEntry, 'weekdayIndex'>[] = [
  { id: 's1', day: 'Mon', time: "Ba'da Maghrib", topic: "Kajian Rutin — Tafsir Al-Qur'an", ustadz: 'Ustadz (TBD)', audience: 'umum' },
  { id: 's2', day: 'Tue', time: "Ba'da Maghrib", topic: 'Kajian Kitab — Riyadhus Shalihin', ustadz: 'Ustadz (TBD)', audience: 'umum' },
  { id: 's3', day: 'Wed', time: "Ba'da Subuh", topic: "Tahsin & Tahfizh Al-Qur'an", ustadz: 'Ustadz (TBD)', audience: 'ikhwan' },
  { id: 's4', day: 'Thu', time: "Ba'da Maghrib", topic: 'Kajian Kitab — Aqidah', ustadz: 'Ustadz LIPIA / Madinah (TBD)', audience: 'umum' },
  { id: 's5', day: 'Fri', time: '12:00 WITA', topic: "Sholat Jum'at & Khutbah", ustadz: 'Khatib (TBD)', audience: 'ikhwan' },
  { id: 's6', day: 'Sat', time: "Ba'da Maghrib", topic: 'Kajian Muslimah', ustadz: 'Ustadz (TBD)', audience: 'akhwat' },
  { id: 's7', day: 'Sun', time: "Ba'da Subuh", topic: 'Tabligh Akbar (bulanan)', ustadz: 'Ustadz Tamu (TBD)', audience: 'umum' },
];

export async function getScheduleEntries(): Promise<PublicScheduleEntry[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('schedule_entries').select('*');
      const rows = (data ?? []) as ScheduleRow[];
      if (rows.length > 0) {
        return rows
          .map((r) => ({
            id: r.id,
            day: r.day,
            weekdayIndex: DAY_TO_WEEKDAY_INDEX[r.day],
            time: r.time,
            topic: r.topic,
            ustadz: r.ustadz,
            audience: r.audience,
          }))
          .sort((a, b) => DAY_RANK[a.day] - DAY_RANK[b.day]);
      }
    } catch {
      // fall through
    }
  }
  return FALLBACK_SCHEDULE.map((e) => ({
    ...e,
    weekdayIndex: DAY_TO_WEEKDAY_INDEX[e.day],
  }));
}

// ── Contact ──────────────────────────────────────────────────────────────────
export async function getContact(): Promise<PublicContact> {
  const fallback: PublicContact = {
    phone: siteConfig.contact.phoneDisplay,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    address: siteConfig.address,
  };
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('contact_info').select('*').limit(1).single();
      const row = data as ContactRow | null;
      if (row) {
        return {
          phone: row.phone || fallback.phone,
          whatsapp: row.whatsapp || fallback.whatsapp,
          email: row.email || fallback.email,
          address: {
            en: row.address_en || fallback.address.en,
            id: row.address_id || fallback.address.id,
          },
        };
      }
    } catch {
      // fall through
    }
  }
  return fallback;
}

// ── Socials ──────────────────────────────────────────────────────────────────
export async function getSocials(): Promise<PublicSocial[]> {
  const fallback: PublicSocial[] = [
    { platform: 'instagram', url: siteConfig.socials.instagram },
    { platform: 'youtube', url: siteConfig.socials.youtube },
  ].filter((s) => s.url);

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('social_links')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      const rows = (data ?? []) as SocialRow[];
      if (rows.length > 0) {
        return rows.map((r) => ({ platform: r.platform, url: r.url }));
      }
    } catch {
      // fall through
    }
  }
  return fallback;
}
