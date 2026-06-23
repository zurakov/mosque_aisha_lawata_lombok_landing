import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'id'] as const;
export const defaultLocale = 'id' as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});
