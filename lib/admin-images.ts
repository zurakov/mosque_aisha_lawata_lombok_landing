import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Shared CRUD handlers for the hero_images and gallery_images tables, which have
 * identical shapes. Each table's route.ts wires these with its table name.
 */

const unauthorized = () => NextResponse.json({ error: 'unauthorized' }, { status: 401 });

function revalidatePublic() {
  revalidatePath('/en');
  revalidatePath('/id');
}

type Table = 'hero_images' | 'gallery_images';

interface Input {
  id?: unknown;
  public_url?: unknown;
  storage_path?: unknown;
  alt?: unknown;
  sort_order?: unknown;
  active?: unknown;
}

export async function listImages(table: Table) {
  if (!(await requireAdmin())) return unauthorized();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ images: data });
}

export async function createImage(table: Table, req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Input;
  if (typeof body.public_url !== 'string' || !body.public_url) {
    return NextResponse.json({ error: 'public_url is required' }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(table)
    .insert({
      public_url: body.public_url,
      storage_path: typeof body.storage_path === 'string' ? body.storage_path : null,
      alt: typeof body.alt === 'string' ? body.alt : null,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
      active: typeof body.active === 'boolean' ? body.active : true,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublic();
  return NextResponse.json({ image: data }, { status: 201 });
}

export async function updateImage(table: Table, req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Input;
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body.alt === 'string') patch.alt = body.alt;
  if (typeof body.sort_order === 'number') patch.sort_order = body.sort_order;
  if (typeof body.active === 'boolean') patch.active = body.active;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(table)
    .update(patch)
    .eq('id', body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublic();
  return NextResponse.json({ image: data });
}

export async function deleteImage(table: Table, req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = createAdminClient();
  // Remove the storage object too, if we recorded its path.
  const { data: row } = await supabase.from(table).select('storage_path').eq('id', id).single();
  const storagePath = (row as { storage_path: string | null } | null)?.storage_path;
  if (storagePath) {
    await supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'mosque-images').remove([storagePath]);
  }
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublic();
  return NextResponse.json({ ok: true });
}
