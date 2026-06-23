'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  AlertCircle,
  Clock,
  Moon,
  RotateCw,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';
import type { PrayerKey, PrayerTimesResult } from '@/lib/prayer-times';

type Status = 'loading' | 'ready' | 'error';

const ICONS: Record<PrayerKey, typeof Sun> = {
  Imsak: Moon,
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function PrayerTimes() {
  const locale = useLocale() as 'en' | 'id';
  const t = useTranslations('prayer');

  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<PrayerTimesResult | null>(null);
  const [remaining, setRemaining] = useState(0);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/prayer-times', { cache: 'no-store' });
      if (!res.ok) throw new Error('bad response');
      const json = (await res.json()) as PrayerTimesResult;
      setData(json);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Live countdown: derive remaining seconds from the server's computedAt so it
  // stays accurate even if the tab was backgrounded.
  useEffect(() => {
    if (!data) return;
    const tick = () => {
      const elapsed = (Date.now() - data.computedAt) / 1000;
      const left = data.secondsToNext - elapsed;
      setRemaining(left);
      // When the countdown elapses, refetch to roll to the next window.
      if (left <= 0) load();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [data, load]);

  return (
    <Section id="prayer-times" muted>
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      {status === 'loading' && <PrayerSkeleton />}

      {status === 'error' && (
        <div className="mx-auto max-w-md rounded-2xl border border-primary/10 bg-white p-8 text-center shadow-card">
          <AlertCircle className="mx-auto h-8 w-8 text-accent-dark" />
          <p className="mt-3 text-ink">{t('error')}</p>
          <button
            onClick={load}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <RotateCw className="h-4 w-4" />
            {t('retry')}
          </button>
        </div>
      )}

      {status === 'ready' && data && (
        <PrayerContent data={data} remaining={remaining} locale={locale} t={t} />
      )}
    </Section>
  );
}

function PrayerContent({
  data,
  remaining,
  locale,
  t,
}: {
  data: PrayerTimesResult;
  remaining: number;
  locale: 'en' | 'id';
  t: ReturnType<typeof useTranslations>;
}) {
  const hijri = locale === 'id' ? data.hijriDateId : data.hijriDate;

  const labelFor = (key: PrayerKey): string => {
    // On Friday, the Dhuhr slot becomes Jumu'ah.
    if (key === 'Dhuhr' && data.isFriday) return t('names.Jumuah');
    return t(`names.${key}`);
  };

  return (
    <div className="space-y-8">
      {/* Date + next-prayer banner */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl bg-primary p-6 text-center text-white shadow-soft sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-xl font-semibold">{data.date}</p>
          <p className="text-sm text-white/70">
            {t('hijri')}: {hijri}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3">
          <Clock className="h-6 w-6 text-accent" />
          <div>
            <p className="text-xs uppercase tracking-wide text-white/70">
              {t('nextPrayer')}
            </p>
            <p className="font-semibold">
              {data.next ? labelFor(data.next) : '—'}{' '}
              <span className="text-white/70">{t('in')}</span>{' '}
              <span className="tabular-nums text-accent">{formatCountdown(remaining)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Times grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {data.times.map((pt) => {
          const Icon = ICONS[pt.key];
          const isCurrent = data.current === pt.key && pt.isPrayer;
          const isNext = data.next === pt.key && !data.nextIsTomorrow;
          return (
            <div
              key={pt.key}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-center transition-colors',
                isCurrent
                  ? 'border-accent bg-accent/10 ring-1 ring-accent'
                  : isNext
                    ? 'border-primary/30 bg-white'
                    : 'border-primary/10 bg-white',
              )}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <Icon
                className={cn('h-5 w-5', isCurrent ? 'text-accent-dark' : 'text-primary/60')}
              />
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {labelFor(pt.key)}
              </span>
              <span
                className={cn(
                  'font-display text-xl font-semibold tabular-nums',
                  isCurrent ? 'text-accent-dark' : 'text-primary',
                )}
              >
                {pt.time}
              </span>
              {isCurrent && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-dark">
                  {t('now')}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {data.isFriday && (
        <p className="text-center text-sm font-medium text-accent-dark">{t('jumuahNote')}</p>
      )}
    </div>
  );
}

function PrayerSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="mx-auto h-24 max-w-3xl animate-pulse rounded-2xl bg-primary/10" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-primary/10" />
        ))}
      </div>
    </div>
  );
}
