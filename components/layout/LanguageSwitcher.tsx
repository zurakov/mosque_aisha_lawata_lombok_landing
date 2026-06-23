'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n';
import { cn } from '@/lib/utils';

/**
 * Locale toggle that keeps the user exactly where they are.
 *
 * Uses next-intl's locale-aware navigation: `usePathname()` returns the path
 * WITHOUT the locale prefix, and `router.replace(path + hash, { locale })`
 * swaps only the locale segment. `scroll: false` stops the default scroll-to-top.
 * After the locale change re-renders the (now translated) page, an effect
 * re-scrolls the element matching the hash back into view.
 */
export function LanguageSwitcher({
  className,
  onHero = false,
}: {
  className?: string;
  onHero?: boolean;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');

  // Remember the hash we need to restore after the locale swap re-renders.
  const pendingHash = useRef<string | null>(null);

  const switchTo = (next: string) => {
    if (next === locale) return;
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    pendingHash.current = hash || null;
    router.replace(pathname + hash, { locale: next as 'en' | 'id', scroll: false });
  };

  // After locale changes, re-anchor to the same section.
  useEffect(() => {
    if (!pendingHash.current) return;
    const id = pendingHash.current.slice(1);
    pendingHash.current = null;
    // Wait for the translated DOM to settle before scrolling.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
      });
    });
  }, [locale]);

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border p-0.5',
        onHero ? 'border-white/40' : 'border-primary/20',
        className,
      )}
      role="group"
      aria-label={t('label')}
    >
      {locales.map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            onClick={() => switchTo(l)}
            aria-pressed={active}
            aria-label={l === 'en' ? t('switchToEn') : t('switchToId')}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
              active
                ? 'bg-primary text-white'
                : onHero
                  ? 'text-white hover:bg-white/15'
                  : 'text-primary hover:bg-primary/5',
            )}
          >
            {t(l)}
          </button>
        );
      })}
    </div>
  );
}
