'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Carousel } from '@/components/ui/Carousel';
import { ButtonLink } from '@/components/ui/Button';
import { heroImages } from '@/config/gallery';
import { siteConfig } from '@/config/site';

export function Hero({ locale }: { locale: 'en' | 'id' }) {
  const t = useTranslations('hero');
  const name = siteConfig.name.full[locale];

  const slides = heroImages.map((img, i) => (
    <div key={i} className="relative h-[88vh] min-h-[560px] w-full">
      <Image
        src={img.src}
        alt={img.alt[locale]}
        fill
        priority={i === 0}
        sizes="100vw"
        className="object-cover"
      />
      {/* Gradient scrim for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary-dark/40 to-primary-dark/80" />
    </div>
  ));

  return (
    <section id="hero" className="relative">
      <Carousel
        slides={slides}
        autoplay={6000}
        showArrows={false}
        ariaLabel="Mosque photo gallery"
        className="[&_.overflow-hidden]:rounded-none"
      />

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
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              {name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              {t('tagline')}
            </p>
            <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#prayer-times" variant="accent">
                {t('ctaPrayer')}
              </ButtonLink>
              <ButtonLink
                href="#donation"
                variant="outline"
                className="border-white/50 text-white hover:bg-white hover:text-primary"
              >
                {t('ctaDonate')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
