/**
 * config/gallery.ts — Image arrays for the hero carousel and gallery grid.
 *
 * HOW TO SWAP IN REAL PHOTOS:
 *  1. Drop your photos into /public/images/ (e.g. hero-1.jpg, gallery-1.jpg).
 *  2. Change each `src` below to "/images/your-file.jpg".
 *  3. Update the bilingual `alt` text for accessibility.
 * The current `src` values point to tasteful Unsplash placeholders so the site
 * looks complete before real photos arrive. Replace them at launch.
 */

export type LocalizedString = { en: string; id: string };

export interface GalleryImage {
  src: string;
  alt: LocalizedString;
}

// 3–4 wide images for the auto-advancing hero carousel.
export const heroImages: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=2000&q=80',
    alt: { en: 'Mosque interior with arches', id: 'Interior masjid dengan lengkungan' },
  },
  {
    src: 'https://images.unsplash.com/photo-1591197172062-c718f82aba20?auto=format&fit=crop&w=2000&q=80',
    alt: { en: 'Mosque dome at dusk', id: 'Kubah masjid saat senja' },
  },
  {
    src: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=2000&q=80',
    alt: { en: 'Worshippers gathered for prayer', id: 'Jamaah berkumpul untuk shalat' },
  },
  {
    src: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=2000&q=80',
    alt: { en: 'Islamic geometric pattern', id: 'Pola geometris islami' },
  },
];

// Images for the secondary gallery grid.
export const galleryImages: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1200&q=80',
    alt: { en: 'Mosque archway', id: 'Lengkungan masjid' },
  },
  {
    src: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=1200&q=80',
    alt: { en: 'Prayer hall carpet', id: 'Karpet ruang shalat' },
  },
  {
    src: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=1200&q=80',
    alt: { en: 'Ornate ceiling detail', id: 'Detail langit-langit berukir' },
  },
  {
    src: 'https://images.unsplash.com/photo-1597935258735-6a41c8b4d6f3?auto=format&fit=crop&w=1200&q=80',
    alt: { en: 'Quran on a stand', id: 'Al-Qur\'an di atas rehal' },
  },
  {
    src: 'https://images.unsplash.com/photo-1535540878298-0c9a3a4b2c6c?auto=format&fit=crop&w=1200&q=80',
    alt: { en: 'Minaret against sky', id: 'Menara masjid menghadap langit' },
  },
  {
    src: 'https://images.unsplash.com/photo-1604062209983-0b6c0d6a1b2e?auto=format&fit=crop&w=1200&q=80',
    alt: { en: 'Mosque courtyard', id: 'Halaman masjid' },
  },
];
