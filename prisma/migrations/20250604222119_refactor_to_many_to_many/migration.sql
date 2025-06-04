/*
  Warnings:

  - You are about to drop the `RecommendedStack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StackItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StackItem" DROP CONSTRAINT "StackItem_userId_fkey";

-- DropIndex
DROP INDEX "QuizResponse_userId_key";

-- DropTable
DROP TABLE "RecommendedStack";

-- DropTable
DROP TABLE "StackItem";

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "category" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStack" (
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStack_pkey" PRIMARY KEY ("userId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_title_key" ON "Item"("title");

-- AddForeignKey
ALTER TABLE "UserStack" ADD CONSTRAINT "UserStack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStack" ADD CONSTRAINT "UserStack_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
