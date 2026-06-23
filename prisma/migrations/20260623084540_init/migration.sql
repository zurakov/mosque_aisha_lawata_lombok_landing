-- CreateTable
CREATE TABLE "ScheduleEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "ustadz" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT 'umum',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
