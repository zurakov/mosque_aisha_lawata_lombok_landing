# Masjid Aisyah Lawata — Landing Page

A bilingual (Bahasa Indonesia / English) landing page for **Masjid Aisyah
Islamic Center Al-Hunafa Lawata** in Mataram, Indonesia. Built with Next.js 14
(App Router), TypeScript, Tailwind CSS and `next-intl`, with **live prayer
times** for Mataram from the Aladhan API.

---

## Quick start

```bash
npm install                 # also runs `prisma generate`
cp .env.example .env        # then edit ADMIN_PASSWORD + SESSION_SECRET
npm run db:migrate          # create the SQLite db + tables
npm run db:seed             # seed the starter kajian schedule
npm run dev                 # http://localhost:3000  → redirects to /id
```

For production: `npm run build` then `npm start`. On first deploy run
`npm run db:setup` (applies migrations + seeds).

Default language is **Indonesian** (`/id`). English lives at `/en`. The "/" root
redirects to the default locale.

### Environment variables (`.env`)

| Variable          | Purpose                                                        |
|-------------------|---------------------------------------------------------------|
| `DATABASE_URL`    | SQLite file path (default `file:./prisma/dev.db`).            |
| `ADMIN_PASSWORD`  | Password for the `/admin` dashboard login.                    |
| `SESSION_SECRET`  | Secret used to sign the admin session cookie (≥16 chars).    |

Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## Admin dashboard (`/admin`)

The **Weekly Study Schedule** is stored in a database and edited through a
protected dashboard — it is no longer hardcoded.

- Visit **`/admin`** → you'll be redirected to `/admin/login`.
- Log in with `ADMIN_PASSWORD`. A signed, httpOnly session cookie is set
  (8-hour expiry). `/admin` and `/api/admin/*` are gated by middleware.
- The dashboard lets you **create, edit, delete, and reorder** schedule entries.
  Each entry: day, time, topic/book, teacher (ustadz), audience
  (men/women/general). Edits revalidate the public site immediately.

**Persistence:** Prisma + SQLite (`prisma/schema.prisma`, model `ScheduleEntry`).
To move to Postgres later, change `provider` to `postgresql` in the schema, set
`DATABASE_URL` to your Postgres URL, and run `npm run db:migrate` — the models
are unchanged.

**Extensible:** the admin is structured so donation details and gallery can be
added later as their own editable modules (the sidebar already lists them as
"Soon") without touching the public site or restructuring auth.

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

### 3. Weekly study schedule — **the admin dashboard** (`/admin`)
The schedule is now edited in the browser via the protected admin dashboard,
not by editing files. See the [Admin dashboard](#admin-dashboard-admin) section
above. The starter rows are seeded from `prisma/seed.ts`; `config/schedule.ts`
is retained only for type reference and no longer drives the site.

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
app/api/admin/       login, logout, schedule (CRUD, session-protected)
app/admin/           login page + dashboard (schedule CRUD UI)
components/layout/   Navbar, Footer, LanguageSwitcher
components/sections/ Hero, PrayerTimes, About, Activities, Schedule,
                     Facilities, Gallery, Donation, Location, Contact
components/ui/       Button, Card, Container, Section, SectionHeading,
                     Carousel, CopyButton, MosqueIcon
lib/                 prayer-times.ts, schedule.ts, prisma.ts, auth.ts, utils.ts
prisma/              schema.prisma, seed.ts, migrations/
config/              site, donation, gallery            ← owner-editable
messages/            en.json, id.json                   ← all strings
middleware.ts        locale routing + admin auth gate
```

---

## Deployment

Set these env vars in your host: `DATABASE_URL`, `ADMIN_PASSWORD`,
`SESSION_SECRET`. The prayer-times API itself is keyless.

> **Note on SQLite + serverless:** SQLite needs a persistent writable disk, so
> on **Vercel/Netlify** (ephemeral filesystem) switch the datasource to Postgres
> (change `provider` in `prisma/schema.prisma` and set `DATABASE_URL`). For
> self-hosted/Docker/Coolify with a mounted volume, SQLite works fine.

### Vercel / Netlify
Push to a Git repo and import. Use a hosted Postgres for `DATABASE_URL` (see
note above), set `ADMIN_PASSWORD` and `SESSION_SECRET`, and run
`prisma migrate deploy` as part of the build. Build command `npm run build`.

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
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
# Apply migrations + seed on boot, then start. (Persist /app/prisma on a volume.)
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts; npm start"]
```

On **Coolify**: point it at the repo, choose the Dockerfile build pack, expose
port 3000, set `ADMIN_PASSWORD` and `SESSION_SECRET` env vars, and mount a
**persistent volume at `/app/prisma`** so the SQLite database survives restarts
(`DATABASE_URL=file:./prisma/dev.db`). Then deploy.

---

## Accessibility & performance notes
- Semantic landmarks, alt text on every image, AA-contrast palette,
  keyboard-navigable carousel and language switcher with visible focus states.
- `next/image` with `sizes`, lazy-loading below the fold, and
  `prefers-reduced-motion` honoured for animations and smooth scroll.
- Per-locale metadata, OpenGraph tags, and `PlaceOfWorship` JSON-LD.
```
