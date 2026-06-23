import { getTranslations, getLocale } from 'next-intl/server';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getGalleryImages } from '@/lib/content';
import { GalleryView } from './GalleryView';

export const dynamic = 'force-dynamic';

export async function Gallery() {
  const t = await getTranslations('gallery');
  const locale = (await getLocale()) as 'en' | 'id';
  const images = await getGalleryImages();

  return (
    <Section id="gallery">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />
      <GalleryView images={images} locale={locale} />
    </Section>
  );
}
