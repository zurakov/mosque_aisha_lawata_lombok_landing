import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const unauthorized = () => NextResponse.json({ error: 'unauthorized' }, { status: 401 });

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('contact_info').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ contact: data ?? null });
}

interface Input {
  id?: unknown;
  phone?: unknown;
  whatsapp?: unknown;
  email?: unknown;
  address_en?: unknown;
  address_id?: unknown;
}

const str = (v: unknown) => (typeof v === 'string' ? v : null);

/** Upsert the single contact row. */
export async function PUT(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Input;
  const supabase = createAdminClient();

  const payload = {
    phone: str(body.phone),
    whatsapp: str(body.whatsapp),
    email: str(body.email),
    address_en: str(body.address_en),
    address_id: str(body.address_id),
  };

  // Update the existing row if present, else insert a new one.
  const { data: existing } = await supabase.from('contact_info').select('id').limit(1).single();
  const res = existing
    ? await supabase.from('contact_info').update(payload).eq('id', (existing as { id: string }).id).select().single()
    : await supabase.from('contact_info').insert(payload).select().single();

  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  revalidatePath('/en');
  revalidatePath('/id');
  return NextResponse.json({ contact: res.data });
}
