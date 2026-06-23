/**
 * config/schedule.ts — DEPRECATED as the live data source.
 *
 * The weekly kajian schedule is now stored in the database and edited through
 * the protected admin dashboard at /admin (model: ScheduleEntry). Editing this
 * file no longer changes the public site.
 *
 * The initial/seed rows live in `prisma/seed.ts`. The types below are kept only
 * for reference; the live shape is `ScheduleEntryDTO` in `lib/schedule.ts`.
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
