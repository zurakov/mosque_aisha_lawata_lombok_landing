import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Verifies there is an authenticated Supabase user on the request. Admin route
 * handlers call this before performing any service-role write.
 * Returns the user id when authorized, or null otherwise.
 */
export async function requireAdmin(): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ? { id: user.id } : null;
  } catch {
    return null;
  }
}
