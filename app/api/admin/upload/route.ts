import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { SUPABASE_BUCKET } from '@/lib/supabase/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

/** Accepts a multipart upload (`file`, optional `folder`), stores it in the
 *  public bucket, and returns { path, publicUrl }. */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  const folder = (form?.get('folder') as string) || 'uploads';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 8MB)' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  // Avoid Math.random/Date in shared libs is unnecessary here (route, not workflow).
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${folder}/${unique}.${ext}`;

  const supabase = createAdminClient();
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
  return NextResponse.json({ path, publicUrl: data.publicUrl }, { status: 201 });
}
