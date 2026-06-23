'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
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

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all',
        scrolled
          ? 'border-b border-primary/10 bg-background/85 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#hero" className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-accent"
            aria-hidden="true"
          >
            <span className="font-arabic text-lg leading-none">ع</span>
          </span>
          <span className="font-display text-lg font-semibold text-primary">{name}</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {t(item.key)}
            </a>
          ))}
          <LanguageSwitcher className="ml-2" />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-primary hover:bg-primary/5"
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
    </header>
  );
}
