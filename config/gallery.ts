/**
 * config/gallery.ts — Image arrays for the hero carousel and gallery grid.
 *
 * HOW TO SWAP IN REAL PHOTOS:
 *  1. Drop your photos into /public/images/ (e.g. hero-1.jpg, gallery-1.jpg).
 *  2. Change each `src` below to "/images/your-file.jpg".
 *  3. Update the bilingual `alt` text for accessibility.
 *
 * The current `src` values are tasteful, verified Unsplash MOSQUE photographs
 * used as temporary placeholders until the owner provides real photos of
 * Masjid Aisyah Lawata. Replace them at launch.
 */

export type LocalizedString = { en: string; id: string };

export interface GalleryImage {
  src: string;
  alt: LocalizedString;
}

const unsplash = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// 4 wide mosque images for the auto-advancing hero carousel.
export const heroImages: GalleryImage[] = [
  {
    src: unsplash('photo-1574246604907-db69e30ddb97'),
    alt: { en: 'Worshippers in a mosque prayer hall', id: 'Jamaah di ruang shalat masjid' },
  },
  {
    src: unsplash('photo-1512632578888-169bbbc64f33'),
    alt: { en: 'Grand mosque reflected in water at dusk', id: 'Masjid agung terpantul di air saat senja' },
  },
  {
    src: unsplash('photo-1519817650390-64a93db51149'),
    alt: { en: 'Mosque with a large dome and minarets at golden hour', id: 'Masjid berkubah besar dan menara saat senja' },
  },
  {
    src: unsplash('photo-1519818187420-8e49de7adeef'),
    alt: { en: 'Illuminated mosque at sunset', id: 'Masjid bercahaya saat matahari terbenam' },
  },
];

// 6 mosque/Islamic images for the secondary gallery grid.
export const galleryImages: GalleryImage[] = [
  {
    src: unsplash('photo-1512970648279-ff3398568f77', 1200),
    alt: { en: 'White mosque domes against a clear sky', id: 'Kubah masjid putih dengan langit cerah' },
  },
  {
    src: unsplash('photo-1572358899655-f63ece97bfa5', 1200),
    alt: { en: 'Mosque courtyard with minarets', id: 'Halaman masjid dengan menara' },
  },
  {
    src: unsplash('photo-1590075865003-e48277faa558', 1200),
    alt: { en: 'Mosque arches and marble floral inlay', id: 'Lengkungan masjid dan inlay marmer bermotif bunga' },
  },
  {
    src: unsplash('photo-1713239060784-e6ed820a0715', 1200),
    alt: { en: 'View through an ornate mosque archway', id: 'Pemandangan melalui lengkungan masjid berukir' },
  },
  {
    src: unsplash('photo-1511091734515-e50d46c37240', 1200),
    alt: { en: 'White mosque domes and courtyard', id: 'Kubah masjid putih dan halaman' },
  },
  {
    src: unsplash('photo-1542816417-0983c9c9ad53', 1200),
    alt: { en: "Qur'an resting on a dark surface", id: "Al-Qur'an di atas permukaan gelap" },
  },
];
