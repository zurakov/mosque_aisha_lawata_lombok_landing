import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AdminShell, type AdminData } from './AdminShell';
import { SetupNotice } from './SetupNotice';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured) {
    return <SetupNotice />;
  }

  // Middleware already gated this route, but double-check the session.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  // Load all content with the service-role client (RLS-exempt server read).
  const admin = createAdminClient();
  const [hero, gallery, schedule, contact, socials] = await Promise.all([
    admin.from('hero_images').select('*').order('sort_order', { ascending: true }),
    admin.from('gallery_images').select('*').order('sort_order', { ascending: true }),
    admin
      .from('schedule_entries')
      .select('*')
      .order('day', { ascending: true })
      .order('sort_order', { ascending: true }),
    admin.from('contact_info').select('*').limit(1).maybeSingle(),
    admin.from('social_links').select('*').order('sort_order', { ascending: true }),
  ]);

  const data: AdminData = {
    hero: hero.data ?? [],
    gallery: gallery.data ?? [],
    schedule: schedule.data ?? [],
    contact: contact.data ?? null,
    socials: socials.data ?? [],
  };

  return <AdminShell data={data} email={user.email ?? 'admin'} />;
}
