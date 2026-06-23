// Shared row/DTO types mirroring the Supabase schema (supabase/schema.sql).

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type Audience = 'ikhwan' | 'akhwat' | 'umum';

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const AUDIENCES: Audience[] = ['ikhwan', 'akhwat', 'umum'];

export interface ImageRow {
  id: string;
  storage_path: string | null;
  public_url: string;
  alt: string | null;
  sort_order: number;
  active: boolean;
}

export interface ScheduleRow {
  id: string;
  day: Day;
  time: string;
  topic: string;
  ustadz: string;
  audience: Audience;
  sort_order: number;
}

export interface ContactRow {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address_en: string | null;
  address_id: string | null;
}

export interface SocialRow {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
  active: boolean;
}

export const DAY_TO_WEEKDAY_INDEX: Record<Day, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

export function isValidDay(v: unknown): v is Day {
  return typeof v === 'string' && (DAYS as string[]).includes(v);
}
export function isValidAudience(v: unknown): v is Audience {
  return typeof v === 'string' && (AUDIENCES as string[]).includes(v);
}
