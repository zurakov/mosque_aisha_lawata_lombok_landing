/** Tiny className combiner (avoids pulling in clsx for one use). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Returns the current date parts in a given IANA timezone, regardless of the
 * server's own locale/timezone. Used so prayer-time requests always use the
 * correct calendar day in Mataram (WITA).
 */
export function dateInTimezone(timezone: string, date: Date = new Date()): {
  year: number;
  month: number;
  day: number;
  weekday: number; // 0 = Sunday … 6 = Saturday
} {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    weekday: weekdayMap[get('weekday')] ?? new Date().getDay(),
  };
}

/** Formats a DD-MM-YYYY string (the format Aladhan expects in its path). */
export function formatAladhanDate(timezone: string, date: Date = new Date()): string {
  const { year, month, day } = dateInTimezone(timezone, date);
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  return `${dd}-${mm}-${year}`;
}

/** Current time-of-day in seconds since midnight, in a given timezone. */
export function secondsSinceMidnight(timezone: string, date: Date = new Date()): number {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0');
  return get('hour') * 3600 + get('minute') * 60 + get('second');
}
