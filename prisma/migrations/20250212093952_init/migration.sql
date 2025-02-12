/*
  Warnings:

  - You are about to drop the column `districtId` on the `CrimeReport` table. All the data in the column will be lost.
  - The primary key for the `District` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `District` table. All the data in the column will be lost.
  - Added the required column `districtName` to the `CrimeReport` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CrimeReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "postTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "crimeTime" DATETIME NOT NULL,
    "postedById" INTEGER NOT NULL,
    CONSTRAINT "CrimeReport_districtName_fkey" FOREIGN KEY ("districtName") REFERENCES "District" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CrimeReport_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CrimeReport" ("crimeTime", "description", "id", "latitude", "longitude", "postTime", "postedById", "title") SELECT "crimeTime", "description", "id", "latitude", "longitude", "postTime", "postedById", "title" FROM "CrimeReport";
DROP TABLE "CrimeReport";
ALTER TABLE "new_CrimeReport" RENAME TO "CrimeReport";
CREATE TABLE "new_District" (
    "name" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_District" ("name") SELECT "name" FROM "District";
DROP TABLE "District";
ALTER TABLE "new_District" RENAME TO "District";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
