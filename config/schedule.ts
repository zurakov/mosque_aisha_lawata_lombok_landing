/**
 * config/schedule.ts — DEPRECATED as the live data source.
 *
 * The weekly kajian schedule (and hero/gallery/contact/socials) now live in
 * Supabase and are edited through the admin dashboard at /admin. The seed rows
 * are defined in supabase/schema.sql. A bundled fallback copy used when Supabase
 * is unconfigured lives in lib/content.ts.
 *
 * The types below are kept only for reference; the live shape is in
 * lib/supabase/types.ts.
 */

export type Audience = 'ikhwan' | 'akhwat' | 'umum';

export interface ScheduleEntry {
  /** 0 = Sunday … 6 = Saturday */
  day: number;
  time: string;
  topic: string;
  ustadz: string;
  audience: Audience;
}
