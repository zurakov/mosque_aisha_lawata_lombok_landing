import { useTranslations } from 'next-intl';
import { Instagram, Mail, MessageCircle, Phone, Youtube } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { siteConfig } from '@/config/site';

export function Contact() {
  const t = useTranslations('contact');
  const { contact, socials } = siteConfig;

  const channels = [
    {
      icon: MessageCircle,
      label: t('whatsapp'),
      value: contact.phoneDisplay,
      href: `https://wa.me/${contact.whatsapp}`,
    },
    {
      icon: Phone,
      label: t('phone'),
      value: contact.phoneDisplay,
      href: `tel:${contact.phoneDisplay.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: t('email'),
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: socials.instagram },
    { icon: Youtube, href: socials.youtube },
  ].filter((s) => s.href);

  return (
    <Section id="contact" muted>
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
        {channels.map((c) => (
          <Card key={c.label} className="text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-primary/5 text-primary">
              <c.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted">{c.label}</p>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-words font-medium text-primary hover:text-accent-dark"
            >
              {c.value}
            </a>
          </Card>
        ))}
      </div>

      {socialLinks.length > 0 && (
        <div className="mt-10 text-center">
          <p className="text-sm text-muted">{t('follow')}</p>
          <div className="mt-3 flex justify-center gap-3">
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
