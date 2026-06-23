'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/i18n';
import { cn } from '@/lib/utils';

/**
 * Toggles between locales while keeping the user exactly where they are.
 * next-intl uses locale-prefixed routes (/en, /id); we swap only the prefix,
 * preserve the current #hash, navigate with scroll:false (no reset to top),
 * then re-scroll the same section into view after the locale change.
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

  const switchTo = (target: string) => {
    if (target === locale) return;

    const hash = typeof window !== 'undefined' ? window.location.hash : '';

    // pathname is like "/en/..." — replace the leading locale segment.
    const segments = pathname.split('/');
    segments[1] = target;
    const nextPath = segments.join('/') + hash;

    // scroll:false prevents Next from resetting to the top of the page.
    router.replace(nextPath, { scroll: false });

    // After the route updates, bring the same section back into view (the DOM
    // re-renders with translated content, so we re-anchor to the hash).
    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        // Two frames: let the re-render settle before measuring scroll target.
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      });
    }
  };

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
