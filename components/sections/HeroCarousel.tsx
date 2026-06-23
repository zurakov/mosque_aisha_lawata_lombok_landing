'use client';

import Image from 'next/image';
import { Carousel } from '@/components/ui/Carousel';
import type { PublicImage } from '@/lib/content';

/** Client carousel for the hero background images. */
export function HeroCarousel({
  images,
  locale,
}: {
  images: PublicImage[];
  locale: 'en' | 'id';
}) {
  const slides = images.map((img, i) => (
    <div key={i} className="relative h-[92svh] min-h-[520px] w-full">
      <Image
        src={img.src}
        alt={img.alt[locale]}
        fill
        priority={i === 0}
        sizes="100vw"
        // Supabase public URLs are arbitrary hosts; skip the optimizer for them.
        unoptimized={!img.src.includes('images.unsplash.com')}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary-dark/40 to-primary-dark/80" />
    </div>
  ));

  return (
    <Carousel
      slides={slides}
      autoplay={6000}
      showArrows={false}
      ariaLabel="Mosque photo gallery"
      className="[&_.overflow-hidden]:rounded-none"
    />
  );
}
