/*
  Warnings:

  - You are about to drop the `Division` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `divisionId` on the `District` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Division_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Division";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_District" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_District" ("id", "name") SELECT "id", "name" FROM "District";
DROP TABLE "District";
ALTER TABLE "new_District" RENAME TO "District";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
