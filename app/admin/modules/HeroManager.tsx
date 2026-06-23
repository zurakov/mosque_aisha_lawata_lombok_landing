'use client';

import type { ImageRow } from '@/lib/supabase/types';
import { ImageManager } from './ImageManager';

export function HeroManager({ initial }: { initial: ImageRow[] }) {
  return <ImageManager initial={initial} endpoint="/api/admin/hero" folder="hero" />;
}
