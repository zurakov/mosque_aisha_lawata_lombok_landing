import { getTranslations } from 'next-intl/server';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { getContact, getSocials } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function Contact() {
  const t = await getTranslations('contact');
  const contact = await getContact();
  const socials = await getSocials();

  const channels = [
    contact.whatsapp && {
      icon: MessageCircle,
      label: t('whatsapp'),
      value: contact.phone,
      href: `https://wa.me/${contact.whatsapp}`,
    },
    contact.phone && {
      icon: Phone,
      label: t('phone'),
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
    },
    contact.email && {
      icon: Mail,
      label: t('email'),
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string }[];

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

      {socials.length > 0 && (
        <div className="mt-10 text-center">
          <p className="text-sm text-muted">{t('follow')}</p>
          <div className="mt-3 flex justify-center gap-3">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <SocialIcon platform={s.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
