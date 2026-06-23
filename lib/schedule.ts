import { prisma } from '@/lib/prisma';

// Mirrors the Prisma enums (SQLite stores them as TEXT).
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type Audience = 'ikhwan' | 'akhwat' | 'umum';

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const AUDIENCES: Audience[] = ['ikhwan', 'akhwat', 'umum'];

export interface ScheduleEntryDTO {
  id: string;
  day: Day;
  time: string;
  topic: string;
  ustadz: string;
  audience: Audience;
  order: number;
}

/** Sort order Monday → Sunday, then by the manual `order` field. */
const DAY_RANK: Record<Day, number> = {
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
};

export async function getScheduleEntries(): Promise<ScheduleEntryDTO[]> {
  const rows = await prisma.scheduleEntry.findMany();
  return rows
    .map((r) => ({
      id: r.id,
      day: r.day as Day,
      time: r.time,
      topic: r.topic,
      ustadz: r.ustadz,
      audience: r.audience as Audience,
      order: r.order,
    }))
    .sort((a, b) => DAY_RANK[a.day] - DAY_RANK[b.day] || a.order - b.order);
}

export function isValidDay(v: unknown): v is Day {
  return typeof v === 'string' && (DAYS as string[]).includes(v);
}

export function isValidAudience(v: unknown): v is Audience {
  return typeof v === 'string' && (AUDIENCES as string[]).includes(v);
}

/** Maps the Prisma Day enum to the 0=Sunday..6=Saturday index used for i18n. */
export const DAY_TO_WEEKDAY_INDEX: Record<Day, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};
