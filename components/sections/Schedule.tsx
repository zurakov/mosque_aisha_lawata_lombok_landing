import { getTranslations, getLocale } from 'next-intl/server';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getScheduleEntries } from '@/lib/content';
import { cn } from '@/lib/utils';

const DAY_NAMES: Record<'en' | 'id', string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  id: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'],
};

const AUDIENCE_STYLES: Record<string, string> = {
  ikhwan: 'bg-primary/10 text-primary',
  akhwat: 'bg-accent/15 text-accent-dark',
  umum: 'bg-emerald-100 text-emerald-800',
};

// Reads from Supabase (admin-managed) with placeholder fallback; render fresh.
export const dynamic = 'force-dynamic';

export async function Schedule() {
  const t = await getTranslations('schedule');
  const locale = (await getLocale()) as 'en' | 'id';
  const entries = await getScheduleEntries();

  return (
    <Section id="schedule">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-primary/10 shadow-card md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-5 py-3 font-medium">{t('headers.day')}</th>
              <th className="px-5 py-3 font-medium">{t('headers.time')}</th>
              <th className="px-5 py-3 font-medium">{t('headers.topic')}</th>
              <th className="px-5 py-3 font-medium">{t('headers.ustadz')}</th>
              <th className="px-5 py-3 font-medium">{t('headers.audience')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10 bg-white">
            {entries.map((e) => (
              <tr key={e.id} className="hover:bg-surface">
                <td className="px-5 py-3 font-medium text-primary">{DAY_NAMES[locale][e.weekdayIndex]}</td>
                <td className="px-5 py-3 text-ink/80">{e.time}</td>
                <td className="px-5 py-3 text-ink/80">{e.topic}</td>
                <td className="px-5 py-3 text-ink/70">{e.ustadz}</td>
                <td className="px-5 py-3">
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', AUDIENCE_STYLES[e.audience])}>
                    {t(`audience.${e.audience}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {entries.map((e) => (
          <div key={e.id} className="rounded-2xl border border-primary/10 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">{DAY_NAMES[locale][e.weekdayIndex]}</span>
              <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', AUDIENCE_STYLES[e.audience])}>
                {t(`audience.${e.audience}`)}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-ink">{e.topic}</p>
            <p className="mt-1 text-xs text-muted">{e.time} · {e.ustadz}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
