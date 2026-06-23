/**
 * config/site.ts — Mosque constants (owner-editable).
 *
 * Edit the values here to update names, address, coordinates, contact details
 * and social links across the whole site. Components read from this file; they
 * never hardcode these values.
 *
 * ⚠️ COORDINATES: lat/lng below are approximate (Mataram / Dasan Agung Baru).
 * Before launch, find "Masjid Aisyah Lawata" on Google Maps, copy the precise
 * pin coordinates, and replace `coordinates` below — they drive BOTH the map
 * embed and the prayer-time calculation.
 */

export type LocalizedString = { en: string; id: string };

export const siteConfig = {
  name: {
    full: {
      en: 'Aisyah Islamic Center Al-Hunafa Lawata Mosque',
      id: 'Masjid Aisyah Islamic Center Al-Hunafa Lawata',
    } satisfies LocalizedString,
    short: {
      en: 'Aisyah Lawata Mosque',
      id: 'Masjid Aisyah Lawata',
    } satisfies LocalizedString,
    arabic: 'مسجد عائشة',
  },

  foundation: {
    en: 'Al-Hunafa Foundation',
    id: 'Yayasan Al-Hunafa',
  } satisfies LocalizedString,

  // Full street address.
  address: {
    en: 'Jalan Soromandi, Dasan Agung Baru, Selaparang District, Mataram City, West Nusa Tenggara, Indonesia',
    id: 'Jalan Soromandi, Kelurahan Dasan Agung Baru, Kecamatan Selaparang, Kota Mataram, Nusa Tenggara Barat, Indonesia',
  } satisfies LocalizedString,

  // ⚠️ Verify on Google Maps and replace with the exact mosque pin.
  coordinates: {
    lat: -8.5821,
    lng: 116.1042,
  },

  // IANA timezone — WITA (UTC+8). Drives the prayer-time date calculation.
  timezone: 'Asia/Makassar',

  // Google Maps place query used for the embed + directions deep link.
  mapsQuery: 'Masjid Aisyah Lawata, Jl. Soromandi, Dasan Agung Baru, Mataram',

  // Contact placeholders — replace with real values when available.
  contact: {
    // Use international format without "+" for the WhatsApp link, e.g. "628123456789".
    whatsapp: '628123456789',
    phoneDisplay: '+62 812-3456-789',
    email: 'info@masjidaisyahlawata.id',
  },

  // Social links — leave a value empty ('') to hide that icon.
  socials: {
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
    facebook: '',
  },

  // Established year (used for stat chips).
  established: 2001,
};

export type SiteConfig = typeof siteConfig;
