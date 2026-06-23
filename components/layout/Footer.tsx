import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { MosqueIcon } from '@/components/ui/MosqueIcon';
import { LanguageSwitcher } from './LanguageSwitcher';

const QUICK_LINKS = [
  { key: 'about', href: '#about' },
  { key: 'prayerTimes', href: '#prayer-times' },
  { key: 'activities', href: '#activities' },
  { key: 'donation', href: '#donation' },
  { key: 'location', href: '#location' },
] as const;

export function Footer({ locale }: { locale: 'en' | 'id' }) {
  const t = useTranslations();
  const year = 2026; // Static to avoid hydration mismatch; bump in config if needed.
  const name = siteConfig.name.full[locale];
  const foundation = siteConfig.foundation[locale];

  return (
    <footer className="bg-primary-dark text-white/80">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-accent">
                <MosqueIcon className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-semibold text-white">
                {siteConfig.name.short[locale]}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              {name}
            </p>
            <p className="mt-2 text-sm">
              {t('footer.under')} <span className="text-accent">{foundation}</span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {t('footer.quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="text-sm transition-colors hover:text-accent">
                    {t(`nav.${l.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {t('language.label')}
            </h3>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
          © {year} {name}. {t('footer.rights')}
        </div>
      </Container>
    </footer>
  );
}
