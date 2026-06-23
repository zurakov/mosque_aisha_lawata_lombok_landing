import { getScheduleEntries } from '@/lib/schedule';
import { AdminShell } from './AdminShell';
import { ScheduleManager } from './ScheduleManager';

// Always render fresh data; the middleware guarantees a valid session here.
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const entries = await getScheduleEntries();

  return (
    <AdminShell>
      <ScheduleManager initial={entries} />
    </AdminShell>
  );
}
