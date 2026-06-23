import { useTranslations } from 'next-intl';
import { BookOpen, BookText, Megaphone, Moon, Users } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';

const ITEMS = [
  { key: 'kajianRutin', icon: BookOpen },
  { key: 'kajianKitab', icon: BookText },
  { key: 'quran', icon: BookText },
  { key: 'jumat', icon: Users },
  { key: 'tabligh', icon: Megaphone },
  { key: 'ramadhan', icon: Moon },
] as const;

export function Activities() {
  const t = useTranslations('activities');

  return (
    <Section id="activities" muted>
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <Card key={item.key} className="transition-shadow hover:shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/5 text-primary">
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-primary">
              {t(`items.${item.key}.title`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              {t(`items.${item.key}.desc`)}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
