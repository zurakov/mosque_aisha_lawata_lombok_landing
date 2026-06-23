'use client';

import { useRouter } from 'next/navigation';
import { CalendarDays, HeartHandshake, ImageIcon, LogOut } from 'lucide-react';
import { MosqueIcon } from '@/components/ui/MosqueIcon';

/**
 * Admin chrome: sidebar + header + logout. Built to be extensible — the nav
 * lists future content modules (Donation, Gallery) as disabled items so they
 * can be enabled by adding sibling pages without restructuring.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  const nav = [
    { label: 'Weekly Schedule', icon: CalendarDays, active: true, soon: false },
    { label: 'Donation', icon: HeartHandshake, active: false, soon: true },
    { label: 'Gallery', icon: ImageIcon, active: false, soon: true },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-primary text-white md:flex">
        <div className="flex items-center gap-2.5 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-accent">
            <MosqueIcon className="h-5 w-5" />
          </span>
          <span className="font-semibold">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-2">
          {nav.map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                item.active ? 'bg-white/10 font-medium' : 'text-white/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.soon && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase">
                  Soon
                </span>
              )}
            </div>
          ))}
        </nav>
        <div className="px-3 pb-5">
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
          <h1 className="text-lg font-semibold text-primary">Weekly Study Schedule</h1>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-3 py-1.5 text-sm text-primary hover:bg-primary/5 md:hidden"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
