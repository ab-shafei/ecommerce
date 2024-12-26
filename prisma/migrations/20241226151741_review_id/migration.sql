/*
  Warnings:

  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[productId,userId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_productId_userId_key" ON "Review"("productId", "userId");
