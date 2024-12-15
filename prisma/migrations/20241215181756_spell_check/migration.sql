/*
  Warnings:

  - You are about to drop the column `diamensionsImages` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "diamensionsImages",
ADD COLUMN     "dimensionsImages" TEXT[];
