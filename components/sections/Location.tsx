import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Navigation } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';

export function Location() {
  const t = useTranslations('location');
  const locale = useLocale() as 'en' | 'id';

  const { lat, lng } = siteConfig.coordinates;
  const query = encodeURIComponent(siteConfig.mapsQuery);

  // Keyless Google Maps embed centered on the mosque coordinates.
  const embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  // Directions deep link using the place query.
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <Section id="location">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-card">
          <iframe
            src={embedSrc}
            title={t('mapTitle')}
            className="h-[360px] w-full lg:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
            <MapPin className="h-5 w-5 text-accent-dark" />
            {t('addressTitle')}
          </h3>
          <p className="mt-3 max-w-md leading-relaxed text-ink/80">
            {siteConfig.address[locale]}
          </p>
          <div className="mt-6">
            <ButtonLink href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" />
              {t('directions')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
