# Deploying to Vercel

This app is a **server-rendered Next.js app** (it has API routes, a Supabase
admin dashboard, auth middleware, and live prayer-times). It cannot run on
GitHub Pages or any static-only host — use Vercel (or any Node host).

> A GitHub Pages workflow was removed because Pages only serves static files and
> would strip the prayer-times API, `/admin`, Supabase content editing, and
> locale/auth middleware.

## One-time setup

1. **Push to GitHub** (already done — repo is `main`).

2. **Create the Supabase project** and run the schema — follow
   [`supabase/README.md`](./supabase/README.md). You'll get three keys and create
   one admin user.

3. **Import the repo into Vercel**
   - Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
   - Framework preset: **Next.js** (auto-detected). Build command and output are
     auto-configured — leave defaults.

4. **Add Environment Variables** (Vercel → Project → Settings → Environment
   Variables), for the Production (and Preview) environments:

   | Name                            | Value                          |
   |---------------------------------|--------------------------------|
   | `NEXT_PUBLIC_SUPABASE_URL`      | from Supabase → Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase → Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY`     | from Supabase → Settings → API |
   | `NEXT_PUBLIC_SUPABASE_BUCKET`   | `mosque-images`                |

5. **Deploy.** Vercel builds and hosts the full app. Every push to `main`
   redeploys automatically.

That's it — no database to provision on Vercel (Supabase is the managed backend),
and the prayer-times API is keyless.

## After deploy — verify

- `https://<your-app>.vercel.app/` → redirects to `/id`
- `/en` and `/id` render, language toggle stays in place
- Prayer times show today's times for Mataram with a live countdown
- `/admin` → log in with the Supabase admin user → edit hero/gallery/schedule/
  contact/socials and see changes on the public site

## Notes
- If you deploy **without** the Supabase env vars, the site still builds and runs
  on bundled placeholder content; `/admin` shows a setup notice.
- Custom domain: add it under Vercel → Project → Settings → Domains.
