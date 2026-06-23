import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seed with the original placeholder kajian rows so the public Schedule and the
// admin dashboard have data on first run. Admins edit these via /admin.
const seedRows = [
  { day: 'Mon', time: "Ba'da Maghrib", topic: "Kajian Rutin — Tafsir Al-Qur'an", ustadz: 'Ustadz (TBD)', audience: 'umum', order: 0 },
  { day: 'Tue', time: "Ba'da Maghrib", topic: 'Kajian Kitab — Riyadhus Shalihin', ustadz: 'Ustadz (TBD)', audience: 'umum', order: 0 },
  { day: 'Wed', time: "Ba'da Subuh", topic: "Tahsin & Tahfizh Al-Qur'an", ustadz: 'Ustadz (TBD)', audience: 'ikhwan', order: 0 },
  { day: 'Thu', time: "Ba'da Maghrib", topic: 'Kajian Kitab — Aqidah', ustadz: 'Ustadz LIPIA / Madinah (TBD)', audience: 'umum', order: 0 },
  { day: 'Fri', time: '12:00 WITA', topic: "Sholat Jum'at & Khutbah", ustadz: 'Khatib (TBD)', audience: 'ikhwan', order: 0 },
  { day: 'Sat', time: "Ba'da Maghrib", topic: 'Kajian Muslimah', ustadz: 'Ustadz (TBD)', audience: 'akhwat', order: 0 },
  { day: 'Sun', time: "Ba'da Subuh", topic: 'Tabligh Akbar (bulanan)', ustadz: 'Ustadz Tamu (TBD)', audience: 'umum', order: 0 },
] as const;

async function main() {
  const count = await prisma.scheduleEntry.count();
  if (count > 0) {
    console.log(`Schedule already has ${count} entries — skipping seed.`);
    return;
  }
  for (const row of seedRows) {
    await prisma.scheduleEntry.create({ data: row });
  }
  console.log(`Seeded ${seedRows.length} schedule entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
