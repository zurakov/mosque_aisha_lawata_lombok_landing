import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import {
  getScheduleEntries,
  isValidAudience,
  isValidDay,
  type Audience,
  type Day,
} from '@/lib/schedule';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

interface EntryInput {
  day?: unknown;
  time?: unknown;
  topic?: unknown;
  ustadz?: unknown;
  audience?: unknown;
  order?: unknown;
}

function validate(input: EntryInput): {
  ok: boolean;
  error?: string;
  data?: { day: Day; time: string; topic: string; ustadz: string; audience: Audience; order: number };
} {
  if (!isValidDay(input.day)) return { ok: false, error: 'Invalid day' };
  if (!isValidAudience(input.audience)) return { ok: false, error: 'Invalid audience' };
  if (typeof input.time !== 'string' || !input.time.trim()) return { ok: false, error: 'Time is required' };
  if (typeof input.topic !== 'string' || !input.topic.trim()) return { ok: false, error: 'Topic is required' };
  const ustadz = typeof input.ustadz === 'string' ? input.ustadz : '';
  const order = typeof input.order === 'number' ? input.order : 0;
  return {
    ok: true,
    data: {
      day: input.day,
      audience: input.audience,
      time: input.time.trim(),
      topic: input.topic.trim(),
      ustadz: ustadz.trim(),
      order,
    },
  };
}

// Revalidate the public pages so schedule edits appear immediately.
function revalidatePublic() {
  revalidatePath('/en');
  revalidatePath('/id');
}

/** GET — list all entries (admin view). */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const entries = await getScheduleEntries();
  return NextResponse.json({ entries });
}

/** POST — create a new entry. */
export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as EntryInput;
  const v = validate(body);
  if (!v.ok || !v.data) return NextResponse.json({ error: v.error }, { status: 400 });

  const created = await prisma.scheduleEntry.create({ data: v.data });
  revalidatePublic();
  return NextResponse.json({ entry: created }, { status: 201 });
}

/** PUT — update an existing entry (also used for reordering via `order`). */
export async function PUT(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as EntryInput & { id?: unknown };
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const v = validate(body);
  if (!v.ok || !v.data) return NextResponse.json({ error: v.error }, { status: 400 });

  try {
    const updated = await prisma.scheduleEntry.update({ where: { id: body.id }, data: v.data });
    revalidatePublic();
    return NextResponse.json({ entry: updated });
  } catch {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
}

/** DELETE — remove an entry by id (?id=...). */
export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await prisma.scheduleEntry.delete({ where: { id } });
    revalidatePublic();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
}
