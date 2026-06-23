'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Info } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { galleryImages } from '@/config/gallery';

export function Gallery() {
  const t = useTranslations('gallery');
  const locale = useLocale() as 'en' | 'id';

  return (
    <Section id="gallery">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted">
        <Info className="h-3.5 w-3.5" />
        <span>{t('placeholderNotice')}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card"
          >
            <Image
              src={img.src}
              alt={img.alt[locale]}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
