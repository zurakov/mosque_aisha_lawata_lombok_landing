'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { MosqueIcon } from '@/components/ui/MosqueIcon';
import { LanguageSwitcher } from './LanguageSwitcher';

const NAV_ITEMS = [
  { key: 'about', href: '#about' },
  { key: 'prayerTimes', href: '#prayer-times' },
  { key: 'activities', href: '#activities' },
  { key: 'schedule', href: '#schedule' },
  { key: 'donation', href: '#donation' },
  { key: 'location', href: '#location' },
  { key: 'contact', href: '#contact' },
] as const;

export function Navbar({ locale }: { locale: 'en' | 'id' }) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const name = siteConfig.name.short[locale];
  // When not scrolled, content sits over the hero → use light text. The scrim
  // below guarantees contrast. When scrolled, switch to the solid light bar.
  const onHero = !scrolled && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Permanent legibility scrim at the very top, behind the bar. Fades out
          once the solid background takes over on scroll. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent transition-opacity duration-300',
          onHero ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        className={cn(
          'relative transition-colors duration-300',
          scrolled || open
            ? 'border-b border-primary/10 bg-background/90 backdrop-blur-md'
            : 'bg-transparent',
        )}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#hero" className="flex items-center gap-2.5">
            <span
              className={cn(
                'grid h-9 w-9 place-items-center rounded-full transition-colors',
                onHero ? 'bg-white/15 text-accent' : 'bg-primary text-accent',
              )}
            >
              <MosqueIcon className="h-5 w-5" />
            </span>
            <span
              className={cn(
                'font-display text-lg font-semibold transition-colors',
                onHero ? 'text-white' : 'text-primary',
              )}
            >
              {name}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  onHero
                    ? 'text-white/90 hover:bg-white/10 hover:text-white'
                    : 'text-ink/80 hover:bg-primary/5 hover:text-primary',
                )}
              >
                {t(item.key)}
              </a>
            ))}
            <LanguageSwitcher className="ml-2" onHero={onHero} />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher onHero={onHero} />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? t('closeMenu') : t('openMenu')}
              aria-expanded={open}
              className={cn(
                'grid h-10 w-10 place-items-center rounded-full transition-colors',
                onHero ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-primary/5',
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {open && (
          <div className="border-t border-primary/10 bg-background/95 backdrop-blur-md lg:hidden">
            <div className="flex flex-col px-5 py-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-ink/80 transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {t(item.key)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
