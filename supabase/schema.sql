-- ============================================================================
-- Masjid Aisyah Lawata — Supabase schema (tables, RLS, storage, seed)
--
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query) once, on a
-- fresh project. It is idempotent where practical.
--
-- Model summary:
--   hero_images, gallery_images : id, storage_path, public_url, alt, sort_order, active
--   schedule_entries            : id, day, time, topic, ustadz, audience, sort_order
--   contact_info (single row)   : phone, whatsapp, email, address_en, address_id
--   social_links                : id, platform, url, sort_order, active
--
-- Security model:
--   • anon (public site)      → SELECT only on all tables, READ on the bucket.
--   • authenticated (admin)   → full INSERT/UPDATE/DELETE + uploads.
-- ============================================================================

-- Enums -----------------------------------------------------------------------
do $$ begin
  create type day_of_week as enum ('Mon','Tue','Wed','Thu','Fri','Sat','Sun');
exception when duplicate_object then null; end $$;

do $$ begin
  create type audience_kind as enum ('ikhwan','akhwat','umum');
exception when duplicate_object then null; end $$;

-- Helper: auto-update updated_at ----------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

-- ── hero_images ──────────────────────────────────────────────────────────────
create table if not exists hero_images (
  id           uuid primary key default gen_random_uuid(),
  storage_path text,
  public_url   text not null,
  alt          text,
  sort_order   int  not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists trg_hero_updated on hero_images;
create trigger trg_hero_updated before update on hero_images
  for each row execute function set_updated_at();

-- ── gallery_images ───────────────────────────────────────────────────────────
create table if not exists gallery_images (
  id           uuid primary key default gen_random_uuid(),
  storage_path text,
  public_url   text not null,
  alt          text,
  sort_order   int  not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists trg_gallery_updated on gallery_images;
create trigger trg_gallery_updated before update on gallery_images
  for each row execute function set_updated_at();

-- ── schedule_entries ─────────────────────────────────────────────────────────
create table if not exists schedule_entries (
  id         uuid primary key default gen_random_uuid(),
  day        day_of_week   not null,
  time       text          not null,
  topic      text          not null,
  ustadz     text          not null default '',
  audience   audience_kind not null default 'umum',
  sort_order int           not null default 0,
  created_at timestamptz   not null default now(),
  updated_at timestamptz   not null default now()
);
drop trigger if exists trg_schedule_updated on schedule_entries;
create trigger trg_schedule_updated before update on schedule_entries
  for each row execute function set_updated_at();

-- ── contact_info (single row) ────────────────────────────────────────────────
create table if not exists contact_info (
  id         uuid primary key default gen_random_uuid(),
  phone      text,
  whatsapp   text,
  email      text,
  address_en text,
  address_id text,
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_contact_updated on contact_info;
create trigger trg_contact_updated before update on contact_info
  for each row execute function set_updated_at();

-- ── social_links ─────────────────────────────────────────────────────────────
create table if not exists social_links (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,
  url        text not null,
  sort_order int  not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_social_updated on social_links;
create trigger trg_social_updated before update on social_links
  for each row execute function set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table hero_images      enable row level security;
alter table gallery_images   enable row level security;
alter table schedule_entries enable row level security;
alter table contact_info     enable row level security;
alter table social_links     enable row level security;

-- Public read; authenticated full write. One pair of policies per table.
do $$
declare t text;
begin
  foreach t in array array['hero_images','gallery_images','schedule_entries','contact_info','social_links']
  loop
    execute format('drop policy if exists "public_read_%1$s" on %1$s;', t);
    execute format('drop policy if exists "auth_write_%1$s" on %1$s;', t);
    execute format(
      'create policy "public_read_%1$s" on %1$s for select using (true);', t);
    execute format(
      'create policy "auth_write_%1$s" on %1$s for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ============================================================================
-- Storage: public bucket "mosque-images"
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('mosque-images', 'mosque-images', true)
on conflict (id) do update set public = true;

-- Public read on the bucket; authenticated can upload/update/delete.
drop policy if exists "mosque_images_public_read" on storage.objects;
create policy "mosque_images_public_read" on storage.objects
  for select using (bucket_id = 'mosque-images');

drop policy if exists "mosque_images_auth_write" on storage.objects;
create policy "mosque_images_auth_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'mosque-images')
  with check (bucket_id = 'mosque-images');

-- ============================================================================
-- Seed data (placeholders — matches what the site shipped with)
-- ============================================================================

-- Schedule (idempotent: only seed when empty)
insert into schedule_entries (day, time, topic, ustadz, audience, sort_order)
select * from (values
  ('Mon'::day_of_week, 'Ba''da Maghrib', 'Kajian Rutin — Tafsir Al-Qur''an', 'Ustadz (TBD)', 'umum'::audience_kind, 0),
  ('Tue', 'Ba''da Maghrib', 'Kajian Kitab — Riyadhus Shalihin', 'Ustadz (TBD)', 'umum', 0),
  ('Wed', 'Ba''da Subuh', 'Tahsin & Tahfizh Al-Qur''an', 'Ustadz (TBD)', 'ikhwan', 0),
  ('Thu', 'Ba''da Maghrib', 'Kajian Kitab — Aqidah', 'Ustadz LIPIA / Madinah (TBD)', 'umum', 0),
  ('Fri', '12:00 WITA', 'Sholat Jum''at & Khutbah', 'Khatib (TBD)', 'ikhwan', 0),
  ('Sat', 'Ba''da Maghrib', 'Kajian Muslimah', 'Ustadz (TBD)', 'akhwat', 0),
  ('Sun', 'Ba''da Subuh', 'Tabligh Akbar (bulanan)', 'Ustadz Tamu (TBD)', 'umum', 0)
) as v(day, time, topic, ustadz, audience, sort_order)
where not exists (select 1 from schedule_entries);

-- Contact (single placeholder row)
insert into contact_info (phone, whatsapp, email, address_en, address_id)
select '+62 812-3456-789', '628123456789', 'info@masjidaisyahlawata.id',
       'Jalan Soromandi, Dasan Agung Baru, Selaparang District, Mataram City, West Nusa Tenggara, Indonesia',
       'Jalan Soromandi, Kelurahan Dasan Agung Baru, Kecamatan Selaparang, Kota Mataram, Nusa Tenggara Barat, Indonesia'
where not exists (select 1 from contact_info);

-- Social links (placeholders)
insert into social_links (platform, url, sort_order, active)
select * from (values
  ('instagram', 'https://instagram.com/', 0, true),
  ('youtube', 'https://youtube.com/', 1, true)
) as v(platform, url, sort_order, active)
where not exists (select 1 from social_links);

-- Note: hero_images and gallery_images start EMPTY on purpose — the public site
-- falls back to bundled placeholder mosque photos until the admin uploads real
-- ones via /admin.
