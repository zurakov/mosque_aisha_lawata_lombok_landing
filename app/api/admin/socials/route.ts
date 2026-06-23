import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const unauthorized = () => NextResponse.json({ error: 'unauthorized' }, { status: 401 });
const revalidatePublic = () => {
  revalidatePath('/en');
  revalidatePath('/id');
};

interface Input {
  id?: unknown;
  platform?: unknown;
  url?: unknown;
  sort_order?: unknown;
  active?: unknown;
}

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ socials: data });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Input;
  if (typeof body.platform !== 'string' || !body.platform.trim()) {
    return NextResponse.json({ error: 'Platform is required' }, { status: 400 });
  }
  if (typeof body.url !== 'string' || !body.url.trim()) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('social_links')
    .insert({
      platform: body.platform.trim().toLowerCase(),
      url: body.url.trim(),
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
      active: typeof body.active === 'boolean' ? body.active : true,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublic();
  return NextResponse.json({ social: data }, { status: 201 });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Input;
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body.platform === 'string') patch.platform = body.platform.trim().toLowerCase();
  if (typeof body.url === 'string') patch.url = body.url.trim();
  if (typeof body.sort_order === 'number') patch.sort_order = body.sort_order;
  if (typeof body.active === 'boolean') patch.active = body.active;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('social_links')
    .update(patch)
    .eq('id', body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublic();
  return NextResponse.json({ social: data });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const supabase = createAdminClient();
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublic();
  return NextResponse.json({ ok: true });
}
