import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { getHeroImages } from '@/lib/content';
import { HeroCarousel } from './HeroCarousel';

export async function Hero({ locale }: { locale: 'en' | 'id' }) {
  const t = await getTranslations('hero');
  const name = siteConfig.name.full[locale];
  const images = await getHeroImages();

  return (
    <section id="hero" className="relative">
      <HeroCarousel images={images} locale={locale} />

      {/* Overlaid hero content */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl animate-fade-up text-white">
            <p className="font-arabic text-2xl text-accent sm:text-3xl">
              {siteConfig.name.arabic}
            </p>
            <span className="mt-3 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-medium backdrop-blur">
              {t('since')}
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              {name}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:mt-5 sm:text-lg">
              {t('tagline')}
            </p>
            <div className="pointer-events-auto mt-6 flex flex-wrap gap-3 sm:mt-8">
              <ButtonLink href="#prayer-times" variant="accent">
                {t('ctaPrayer')}
              </ButtonLink>
              <ButtonLink href="#donation" variant="heroOutline">
                {t('ctaDonate')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
