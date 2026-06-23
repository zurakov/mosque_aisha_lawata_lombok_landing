import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, locales, defaultLocale, type Locale } from './i18n/routing';

// Re-export so existing `@/i18n` imports keep working.
export { locales, defaultLocale };
export type { Locale };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
    if (!locale) notFound();
  }

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
