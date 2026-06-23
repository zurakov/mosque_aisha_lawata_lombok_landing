'use client';

import Image from 'next/image';
import { Carousel } from '@/components/ui/Carousel';
import type { PublicImage } from '@/lib/content';

function GalleryImg({ img, locale }: { img: PublicImage; locale: 'en' | 'id' }) {
  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
      <Image
        src={img.src}
        alt={img.alt[locale]}
        fill
        sizes="(max-width: 640px) 100vw, 33vw"
        loading="lazy"
        unoptimized={!img.src.includes('images.unsplash.com')}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

/** Grid on >= sm; swipeable carousel on mobile. */
export function GalleryView({
  images,
  locale,
}: {
  images: PublicImage[];
  locale: 'en' | 'id';
}) {
  return (
    <>
      {/* Mobile: swipeable carousel */}
      <div className="sm:hidden">
        <Carousel
          slides={images.map((img, i) => (
            <div key={i} className="px-1">
              <GalleryImg img={img} locale={locale} />
            </div>
          ))}
          autoplay={0}
          showArrows
          ariaLabel="Mosque gallery"
        />
      </div>

      {/* >= sm: grid */}
      <div className="hidden grid-cols-3 gap-3 sm:grid">
        {images.map((img, i) => (
          <GalleryImg key={i} img={img} locale={locale} />
        ))}
      </div>
    </>
  );
}
