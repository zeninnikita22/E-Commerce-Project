-- AlterTable
ALTER TABLE "Category" ADD COLUMN "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "ItemImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "ItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
