'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Images, LogOut, Phone, Share2 } from 'lucide-react';
import { MosqueIcon } from '@/components/ui/MosqueIcon';
import { createClient } from '@/lib/supabase/client';
import { ToastProvider } from './Toast';
import type { ImageRow, ScheduleRow, ContactRow, SocialRow } from '@/lib/supabase/types';
import { HeroManager } from './modules/HeroManager';
import { GalleryManager } from './modules/GalleryManager';
import { ScheduleManager } from './modules/ScheduleManager';
import { ContactManager } from './modules/ContactManager';
import { SocialsManager } from './modules/SocialsManager';

export interface AdminData {
  hero: ImageRow[];
  gallery: ImageRow[];
  schedule: ScheduleRow[];
  contact: ContactRow | null;
  socials: SocialRow[];
}

type TabKey = 'hero' | 'gallery' | 'schedule' | 'contact' | 'socials';

const TABS: { key: TabKey; label: string; icon: typeof Images }[] = [
  { key: 'hero', label: 'Hero Images', icon: Images },
  { key: 'gallery', label: 'Gallery', icon: Images },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays },
  { key: 'contact', label: 'Contact', icon: Phone },
  { key: 'socials', label: 'Socials', icon: Share2 },
];

export function AdminShell({ data, email }: { data: AdminData; email: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('hero');

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="flex shrink-0 flex-col bg-primary text-white md:w-64">
          <div className="flex items-center gap-2.5 px-6 py-5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-accent">
              <MosqueIcon className="h-5 w-5" />
            </span>
            <span className="font-semibold">Admin</span>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-2 md:flex-1 md:flex-col md:overflow-visible md:py-2">
            {TABS.map((tItem) => {
              const active = tab === tItem.key;
              return (
                <button
                  key={tItem.key}
                  onClick={() => setTab(tItem.key)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active ? 'bg-white/15 font-medium' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <tItem.icon className="h-4 w-4" />
                  {tItem.label}
                </button>
              );
            })}
          </nav>
          <div className="hidden px-3 pb-5 md:block">
            <p className="px-3 pb-2 text-xs text-white/50">{email}</p>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-primary/10 bg-white px-6 py-4">
            <h1 className="text-lg font-semibold text-primary">
              {TABS.find((x) => x.key === tab)?.label}
            </h1>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-3 py-1.5 text-sm text-primary hover:bg-primary/5 md:hidden"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </header>
          <main className="p-4 sm:p-6">
            {tab === 'hero' && <HeroManager initial={data.hero} />}
            {tab === 'gallery' && <GalleryManager initial={data.gallery} />}
            {tab === 'schedule' && <ScheduleManager initial={data.schedule} />}
            {tab === 'contact' && <ContactManager initial={data.contact} />}
            {tab === 'socials' && <SocialsManager initial={data.socials} />}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
