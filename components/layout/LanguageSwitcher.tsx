'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/i18n';
import { cn } from '@/lib/utils';

/**
 * Toggles between locales while preserving the current path and #anchor.
 * next-intl uses locale-prefixed routes (/en, /id); we swap the prefix and
 * re-attach the hash so the user stays on the same section.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');

  const switchTo = (target: string) => {
    if (target === locale) return;
    // pathname is like "/en/..." — replace the leading locale segment.
    const segments = pathname.split('/');
    segments[1] = target;
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    router.replace(segments.join('/') + hash);
  };

  return (
    <div
      className={cn('inline-flex items-center rounded-full border border-primary/20 p-0.5', className)}
      role="group"
      aria-label={t('label')}
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-pressed={locale === l}
          aria-label={l === 'en' ? t('switchToEn') : t('switchToId')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
            locale === l
              ? 'bg-primary text-white'
              : 'text-primary hover:bg-primary/5',
          )}
        >
          {t(l)}
        </button>
      ))}
    </div>
  );
}
