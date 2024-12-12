/*
  Warnings:

  - You are about to drop the column `color` on the `Product` table. All the data in the column will be lost.
  - The `size` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "color",
ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "diamensionsImages" TEXT,
ADD COLUMN     "priceAfterDiscount" DECIMAL(65,30),
DROP COLUMN "size",
ADD COLUMN     "size" TEXT[];
