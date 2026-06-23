import { useTranslations } from 'next-intl';
import { Building2, Layers, Sparkles } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';

export function About() {
  const t = useTranslations('about');

  const stats = [
    { icon: Building2, label: t('stats.established'), value: t('stats.establishedValue') },
    { icon: Layers, label: t('stats.floors'), value: t('stats.floorsValue') },
    { icon: Sparkles, label: t('stats.foundation'), value: t('stats.foundationValue') },
  ];

  return (
    <Section id="about">
      <SectionHeading title={t('title')} />

      <div className="mx-auto max-w-3xl space-y-5 text-center text-base leading-relaxed text-ink/80">
        <p>{t('history')}</p>
        <p>{t('design')}</p>
      </div>

      {/* Stat chips */}
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-card"
          >
            <s.icon className="h-5 w-5 shrink-0 text-accent-dark" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
              <p className="text-sm font-semibold text-primary">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vision & Mission */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-accent">
          <h3 className="font-display text-xl font-semibold text-primary">
            {t('visionTitle')}
          </h3>
          <p className="mt-3 leading-relaxed text-ink/80">{t('vision')}</p>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <h3 className="font-display text-xl font-semibold text-primary">
            {t('missionTitle')}
          </h3>
          <p className="mt-3 leading-relaxed text-ink/80">{t('mission')}</p>
        </Card>
      </div>
    </Section>
  );
}
