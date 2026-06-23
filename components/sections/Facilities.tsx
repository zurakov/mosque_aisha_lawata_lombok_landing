import { useTranslations } from 'next-intl';
import {
  AirVent,
  BookMarked,
  Car,
  Droplets,
  GraduationCap,
  Layers,
  Shirt,
  Speaker,
  Users,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

// Each entry maps to a documented facility — neutral icons, no numbers.
const ITEMS = [
  { key: 'ac', icon: AirVent },
  { key: 'sound', icon: Speaker },
  { key: 'floors', icon: Users },
  { key: 'quran', icon: BookMarked },
  { key: 'mukenah', icon: Shirt },
  { key: 'wudhu', icon: Droplets },
  { key: 'classrooms', icon: GraduationCap },
  { key: 'parking', icon: Car },
  { key: 'carpet', icon: Layers },
] as const;

export function Facilities() {
  const t = useTranslations('facilities');

  return (
    <Section id="facilities" muted>
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {ITEMS.map((item) => (
          <div
            key={item.key}
            className="flex flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-white p-6 text-center shadow-card"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/5 text-primary">
              <item.icon className="h-6 w-6" />
            </span>
            <p className="text-sm font-medium leading-snug text-ink/80">
              {t(`items.${item.key}`)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
