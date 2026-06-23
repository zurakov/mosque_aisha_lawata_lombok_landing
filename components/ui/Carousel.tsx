'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CarouselProps {
  slides: ReactNode[];
  /** Auto-advance interval in ms; 0 disables autoplay. */
  autoplay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Accessible, swipeable Embla carousel with dots, arrows and autoplay. */
export function Carousel({
  slides,
  autoplay = 5000,
  showArrows = true,
  showDots = true,
  className,
  ariaLabel,
}: CarouselProps) {
  const plugins =
    autoplay > 0
      ? [Autoplay({ delay: autoplay, stopOnInteraction: false, stopOnMouseEnter: true })]
      : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, plugins);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={cn('relative', className)} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-primary shadow-soft backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-primary shadow-soft backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {showDots && snaps.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === selected}
              className={cn(
                'h-2 rounded-full transition-all',
                i === selected ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/80',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
