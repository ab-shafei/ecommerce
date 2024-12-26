/*
  Warnings:

  - Added the required column `cartItemTotalPriceAfterDiscount` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `priceAfterDiscount` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "cartItemTotalPriceAfterDiscount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "priceAfterDiscount" SET NOT NULL;
