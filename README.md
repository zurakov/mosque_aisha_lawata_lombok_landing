# Masjid Aisyah Lawata — Landing Page

A bilingual (Bahasa Indonesia / English) landing page for **Masjid Aisyah
Islamic Center Al-Hunafa Lawata** in Mataram, Indonesia. Built with Next.js 14
(App Router), TypeScript, Tailwind CSS and `next-intl`, with **live prayer
times** from the Aladhan API and a **Supabase-backed admin dashboard** for
hero images, gallery, the weekly schedule, contact info, and social links.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys (optional for first run)
npm run dev                  # http://localhost:3000  → redirects to /id
```

Default language is **Indonesian** (`/id`). English lives at `/en`. The "/" root
redirects to the default locale.

> **Runs without Supabase too.** With the Supabase keys blank, the public site
> renders from bundled placeholder content and `/admin` shows a setup notice.
> Add the keys to make content editable. See **Admin dashboard** below.

### Environment variables (`.env.local`)

| Variable                        | Purpose                                              |
|---------------------------------|------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL.                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key.                          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service-role key (server-only; admin writes/uploads).|
| `NEXT_PUBLIC_SUPABASE_BUCKET`   | Public storage bucket name (default `mosque-images`).|

No prayer-times key is needed — Aladhan is free/keyless.

---

## Admin dashboard (`/admin`)

A protected dashboard where the owner edits all dynamic content — **no code
changes required**.

**Setup (one time):** follow [`supabase/README.md`](./supabase/README.md):
1. Create a free Supabase project and copy the three keys into `.env.local`.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL editor
   (creates tables, RLS policies, the `mosque-images` storage bucket, and seeds
   the schedule + contact + socials placeholders).
3. Create one admin user under **Authentication → Users**.

**Using it:** visit `/admin` → log in with the admin email + password
(Supabase Auth). The middleware gates `/admin` and `/api/admin/*`; writes use a
service-role client only after the session is verified. Modules:

| Module    | What you can do                                              |
|-----------|-------------------------------------------------------------|
| Hero      | Upload / reorder / hide / delete the rotating hero images.  |
| Gallery   | Upload / reorder / hide / delete gallery images.            |
| Schedule  | Create / edit / delete / reorder weekly kajian entries.     |
| Contact   | Edit phone, WhatsApp, email, and EN/ID address.             |
| Socials   | Add / edit / reorder / toggle social links (label + url).   |

Edits revalidate the public pages, so they appear after a short window. Hero and
gallery **fall back to bundled placeholder mosque photos** when their tables are
empty, so the site always looks complete.

**Security model (RLS):** anon/public can only `SELECT` the content tables and
read the public bucket; all `INSERT/UPDATE/DELETE` and uploads require an
authenticated session.

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

### 3. Weekly schedule, hero & gallery images, contact, socials — **`/admin`**
These are all edited in the browser via the Supabase-backed admin dashboard, not
by editing files. See the [Admin dashboard](#admin-dashboard-admin) section
above. Seed values live in `supabase/schema.sql`; the bundled fallbacks (used
when Supabase is unconfigured) live in `lib/content.ts`. `config/site.ts` still
holds the map coordinates and the mosque name.

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
app/api/admin/       schedule, hero, gallery, contact, socials, upload (CRUD)
app/admin/           login + dashboard (Hero/Gallery/Schedule/Contact/Socials)
components/layout/   Navbar, Footer, LanguageSwitcher
components/sections/ Hero, PrayerTimes, About, Activities, Schedule,
                     Facilities, Gallery, Donation, Location, Contact
components/ui/       Button, Card, Container, Section, SectionHeading,
                     Carousel, CopyButton, MosqueIcon, SocialIcon
lib/                 prayer-times.ts, content.ts, admin-images.ts, utils.ts
lib/supabase/        client, server, admin, middleware, config, types,
                     require-admin
supabase/            schema.sql, README.md
i18n/                routing.ts, navigation.ts        ← locale-aware nav
config/              site, donation, gallery, schedule ← static fallbacks
messages/            en.json, id.json                  ← all strings
middleware.ts        locale routing + Supabase admin auth gate
```

---

## Deployment

This is a **server-rendered** Next.js app (API routes, Supabase admin, auth
middleware, live prayer-times). It needs a Node/serverless host — **it cannot run
on GitHub Pages** or any static-only host.

Set the four Supabase env vars (see the table above) in your host. The
prayer-times API is keyless. Supabase is a managed Postgres + Storage + Auth
service, so there's no database to provision on the host itself.

### Vercel (recommended)
Step-by-step guide: [`DEPLOY.md`](./DEPLOY.md). In short: import the repo at
[vercel.com/new](https://vercel.com/new), add the four env vars, and deploy —
every push to `main` redeploys. (Netlify works the same way.)

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
# Supabase env vars must be present at build time for NEXT_PUBLIC_* inlining.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
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

On **Coolify**: point it at the repo, choose the Dockerfile build pack, expose
port 3000, and set the four Supabase env vars (the two `NEXT_PUBLIC_*` ones also
as build args). No volume is needed — Supabase holds the data. Then deploy.

---

## Accessibility & performance notes
- Semantic landmarks, alt text on every image, AA-contrast palette,
  keyboard-navigable carousel and language switcher with visible focus states.
- `next/image` with `sizes`, lazy-loading below the fold, and
  `prefers-reduced-motion` honoured for animations and smooth scroll.
- Per-locale metadata, OpenGraph tags, and `PlaceOfWorship` JSON-LD.
```
