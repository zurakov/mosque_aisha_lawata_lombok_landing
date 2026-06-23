import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Download, Info, Landmark, QrCode } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { donationConfig } from '@/config/donation';

export function Donation() {
  const t = useTranslations('donation');

  const rows = [
    { label: t('bankName'), value: donationConfig.bankName, copy: false },
    { label: t('accountNumber'), value: donationConfig.accountNumber, copy: true },
    { label: t('accountHolder'), value: donationConfig.accountHolder, copy: true },
  ];

  return (
    <Section id="donation" muted>
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      {donationConfig.isPlaceholder && (
        <div className="mx-auto mb-8 flex max-w-3xl items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-dark">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{t('placeholderNotice')}</p>
        </div>
      )}

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {/* QRIS card */}
        <Card className="flex flex-col items-center text-center">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/5 text-primary">
            <QrCode className="h-5 w-5" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold text-primary">
            {t('qrisTitle')}
          </h3>
          <p className="mt-1 text-sm text-ink/70">{t('qrisDesc')}</p>
          <div className="relative mt-5 aspect-square w-full max-w-[260px] overflow-hidden rounded-xl border border-primary/10 bg-white">
            <Image
              src={donationConfig.qrisImage}
              alt="QRIS"
              fill
              sizes="260px"
              className="object-contain p-3"
            />
          </div>
          <a
            href={donationConfig.qrisImage}
            download
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            <Download className="h-4 w-4" />
            {t('qrisDownload')}
          </a>
        </Card>

        {/* Bank transfer card */}
        <Card className="flex flex-col">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/5 text-primary">
            <Landmark className="h-5 w-5" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold text-primary">
            {t('bankTitle')}
          </h3>
          <dl className="mt-5 space-y-4">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 border-b border-primary/5 pb-3 last:border-0"
              >
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">{row.label}</dt>
                  <dd className="mt-0.5 font-medium text-ink">{row.value}</dd>
                </div>
                {row.copy && (
                  <CopyButton
                    value={row.value}
                    copyLabel={t('copy')}
                    copiedLabel={t('copied')}
                  />
                )}
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </Section>
  );
}
