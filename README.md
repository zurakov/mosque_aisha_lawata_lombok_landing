# Masjid Aisyah Lawata — Landing Page

A bilingual (Bahasa Indonesia / English) landing page for **Masjid Aisyah
Islamic Center Al-Hunafa Lawata** in Mataram, Indonesia. Built with Next.js 14
(App Router), TypeScript, Tailwind CSS and `next-intl`, with **live prayer
times** for Mataram from the Aladhan API.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /id
npm run build    # production build
npm start        # serve the production build
```

Default language is **Indonesian** (`/id`). English lives at `/en`. The "/" root
redirects to the default locale.

---

## How to update content (no coding required)

Everything an owner needs to edit lives under **`config/`** and
**`public/images/`** — never inside component code.

### 1. Mosque details, address, contact — `config/site.ts`
- Names (full/short, both languages), foundation name.
- **Coordinates** (`coordinates.lat` / `coordinates.lng`) — these drive **both**
  the map embed **and** the prayer-time calculation.
  > ⚠️ **Before launch:** open Google Maps, search "Masjid Aisyah Lawata", copy
  > the exact pin's coordinates, and replace the approximate values.
- WhatsApp number, phone, email, and social links (leave a social URL empty `''`
  to hide its icon).

### 2. Prayer-time location / method
Already configured for Mataram (WITA, `Asia/Makassar`) using **method 20
(KEMENAG)** and **school 0 (Shafi'i)** — the official Indonesian settings. If
the mosque ever moves, just update the coordinates in `config/site.ts`; the
prayer pipeline reads them automatically. The method/school constants live at the
top of `lib/prayer-times.ts`.

### 3. Weekly study schedule — `config/schedule.ts`
Edit the `weeklySchedule` array. Each entry:
```ts
{ day: 1, time: "Ba'da Maghrib", topic: "...", ustadz: "...", audience: "umum" }
```
- `day`: 0 = Sunday … 6 = Saturday (the table sorts and localizes day names).
- `audience`: `'ikhwan'` (men) | `'akhwat'` (women) | `'umum'` (general).
- The seeded rows are **placeholders**. Once confirmed, set
  `isPlaceholderSchedule = false` to hide the "to be confirmed" notice.

### 4. Donation details — `config/donation.ts`
- `bankName`, `accountNumber`, `accountHolder` — shown with copy-to-clipboard
  buttons.
- **QRIS image:** a placeholder ships at `public/images/qris.svg`. Drop the real
  QRIS file into `public/images/` and point `qrisImage` at it
  (e.g. `'/images/qris.png'`).
- Set `isPlaceholder = false` to hide the placeholder warning banner.
- **Never** commit anything beyond the plain account number the owner provides.

### 5. Photos (hero + gallery) — `config/gallery.ts`
The hero carousel and gallery grid currently use Unsplash placeholders. To use
real photos:
1. Drop images into `public/images/` (e.g. `hero-1.jpg`, `gallery-1.jpg`).
2. Change each `src` to `'/images/your-file.jpg'`.
3. Update the bilingual `alt` text for accessibility.

`heroImages` = wide shots for the top carousel; `galleryImages` = the grid below.

### 6. Text / translations — `messages/en.json` & `messages/id.json`
All UI strings live here. Keep the two files' keys in sync. No user-facing text
is hardcoded in components.

---

## Theming

Colours and fonts are centralized:
- **Colours:** CSS variables in `app/[locale]/globals.css` (mirrored as Tailwind
  tokens in `tailwind.config.ts`). Edit the `:root` block to retheme everything —
  background cream `#F7F5F0`, primary teal `#0B3B36`, gold accent `#C9A24B`.
- **Fonts:** loaded via `next/font` in `app/[locale]/layout.tsx`
  (Cormorant Garamond for display, Plus Jakarta Sans for body, Amiri for the
  Arabic accent).

---

## Prayer times — how it works

- `lib/prayer-times.ts` fetches today's timings from Aladhan
  (`method=20`, `school=0`, `timezonestring=Asia/Makassar`), strips seconds,
  computes the **current** and **next** prayer, and rolls over to tomorrow's
  Fajr after Isha. The date is always derived from the **current day in
  Mataram**, not the server's timezone.
- `app/api/prayer-times/route.ts` is a same-origin proxy (no CORS) that caches
  the result for an hour and serves stale-while-revalidate.
- `components/sections/PrayerTimes.tsx` fetches that endpoint, shows a loading
  skeleton / error+retry state, highlights the active prayer, runs a live
  countdown, shows the Hijri date, and swaps Dhuhr → **Jumu'ah** on Fridays.

The Jumu'ah note text is editable in `messages/*.json` (`prayer.jumuahNote`).

---

## Project structure

```
app/[locale]/        layout (html/fonts/metadata/JSON-LD), page, globals.css
app/api/prayer-times Aladhan proxy + cache
components/layout/   Navbar, Footer, LanguageSwitcher
components/sections/ Hero, PrayerTimes, About, Activities, Schedule,
                     Facilities, Gallery, Donation, Location, Contact
components/ui/       Button, Card, Container, Section, SectionHeading,
                     Carousel, CopyButton
lib/                 prayer-times.ts, utils.ts
config/              site, schedule, donation, gallery  ← owner-editable
messages/            en.json, id.json                   ← all strings
```

---

## Deployment

### Vercel / Netlify
Push to a Git repo and import. No environment variables are required — the
Aladhan API is keyless. Build command `npm run build`, output is a standard
Next.js app.

### Self-hosted (Docker / Coolify)
A minimal Dockerfile:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

On **Coolify**, point it at the repo, choose the Dockerfile build pack (or the
Nixpacks Next.js preset), expose port 3000, and deploy. No env vars needed.

---

## Accessibility & performance notes
- Semantic landmarks, alt text on every image, AA-contrast palette,
  keyboard-navigable carousel and language switcher with visible focus states.
- `next/image` with `sizes`, lazy-loading below the fold, and
  `prefers-reduced-motion` honoured for animations and smooth scroll.
- Per-locale metadata, OpenGraph tags, and `PlaceOfWorship` JSON-LD.
```
