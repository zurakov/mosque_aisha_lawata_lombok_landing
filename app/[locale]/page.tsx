import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { PrayerTimes } from '@/components/sections/PrayerTimes';
import { About } from '@/components/sections/About';
import { Activities } from '@/components/sections/Activities';
import { Schedule } from '@/components/sections/Schedule';
import { Facilities } from '@/components/sections/Facilities';
import { Gallery } from '@/components/sections/Gallery';
import { Donation } from '@/components/sections/Donation';
import { Location } from '@/components/sections/Location';
import { Contact } from '@/components/sections/Contact';

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const locale = params.locale as 'en' | 'id';

  return (
    <>
      <Navbar locale={locale} />
      <main>
        <Hero locale={locale} />
        <PrayerTimes />
        <About />
        <Activities />
        <Schedule />
        <Facilities />
        <Gallery />
        <Donation />
        <Location />
        <Contact />
      </main>
      <Footer locale={locale} />
    </>
  );
}
