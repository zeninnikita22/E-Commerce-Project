-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "subcategory" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Item" ("content", "id", "price", "published", "title") SELECT "content", "id", "price", "published", "title" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
