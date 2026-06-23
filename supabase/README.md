# Supabase setup

One-time setup to enable the database-backed content + admin dashboard.

## 1. Create a project
Create a free project at [supabase.com](https://supabase.com). Then open
**Project Settings → API** and copy:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` (server-only!)

Put them in `.env.local` (local) and in your host's env (production).

## 2. Run the schema
Open **SQL Editor → New query**, paste the contents of
[`schema.sql`](./schema.sql), and run it. This creates the tables, RLS
policies, the public `mosque-images` storage bucket, and seeds the schedule +
contact + social placeholders. Hero and gallery start empty (the site uses
bundled placeholder photos until you upload real ones).

## 3. Create the single admin user
**Authentication → Users → Add user** → enter the owner's email + a password,
and tick **Auto Confirm User**. That account is the only one that can log in to
`/admin`.

> Optional hardening: under **Authentication → Providers → Email**, disable
> "Enable sign-ups" so no new accounts can self-register.

## 4. Done
Restart the app. The public site now reads content from Supabase, and `/admin`
accepts the admin login. Edits (schedule, contact, socials, hero/gallery
uploads) appear on the public site after its short revalidation window.
