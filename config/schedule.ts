/**
 * config/schedule.ts — Weekly kajian (study circle) schedule (owner-editable).
 *
 * ⚠️ These entries are realistic PLACEHOLDERS. Confirm the real schedule with
 * the mosque admin and edit below. `day` is 0=Sunday … 6=Saturday so the table
 * can sort and localize day names. Static labels (day names, table headers) are
 * translated automatically; topic/ustadz text you write here is shown as-is.
 *
 * audience: 'ikhwan' (men) | 'akhwat' (women) | 'umum' (general)
 * time: free text — e.g. "Ba'da Maghrib" or "19:30 WITA".
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

export const isPlaceholderSchedule = true;

export const weeklySchedule: ScheduleEntry[] = [
  { day: 1, time: "Ba'da Maghrib", topic: 'Kajian Rutin — Tafsir Al-Qur\'an', ustadz: 'Ustadz (TBD)', audience: 'umum' },
  { day: 2, time: "Ba'da Maghrib", topic: 'Kajian Kitab — Riyadhus Shalihin', ustadz: 'Ustadz (TBD)', audience: 'umum' },
  { day: 3, time: "Ba'da Subuh", topic: 'Tahsin & Tahfizh Al-Qur\'an', ustadz: 'Ustadz (TBD)', audience: 'ikhwan' },
  { day: 4, time: "Ba'da Maghrib", topic: 'Kajian Kitab — Aqidah', ustadz: 'Ustadz LIPIA / Madinah (TBD)', audience: 'umum' },
  { day: 5, time: '12:00 WITA', topic: "Sholat Jum'at & Khutbah", ustadz: 'Khatib (TBD)', audience: 'ikhwan' },
  { day: 6, time: "Ba'da Maghrib", topic: 'Kajian Muslimah', ustadz: 'Ustadz (TBD)', audience: 'akhwat' },
  { day: 0, time: "Ba'da Subuh", topic: 'Tabligh Akbar (bulanan)', ustadz: 'Ustadz Tamu (TBD)', audience: 'umum' },
];
