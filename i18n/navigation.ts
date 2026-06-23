import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware navigation helpers. `usePathname` returns the path WITHOUT the
// locale prefix, and `useRouter().replace(path, { locale })` swaps only the
// locale segment — exactly what the language switcher needs.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
