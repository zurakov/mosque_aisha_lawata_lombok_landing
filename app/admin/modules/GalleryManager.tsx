'use client';

import type { ImageRow } from '@/lib/supabase/types';
import { ImageManager } from './ImageManager';

export function GalleryManager({ initial }: { initial: ImageRow[] }) {
  return <ImageManager initial={initial} endpoint="/api/admin/gallery" folder="gallery" />;
}
