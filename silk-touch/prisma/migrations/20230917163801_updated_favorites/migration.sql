/*
  Warnings:

  - The primary key for the `Favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Favorites` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Favorites` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Favorites` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Favorites` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT '',
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "Favorites_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Favorites" ("id", "itemId", "userId") SELECT "id", "itemId", "userId" FROM "Favorites";
DROP TABLE "Favorites";
ALTER TABLE "new_Favorites" RENAME TO "Favorites";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
