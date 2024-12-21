/*
  Warnings:

  - Made the column `cartTotalPrice` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cartTotalPriceAfterDiscount` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shipping` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "cartTotalPrice" SET NOT NULL,
ALTER COLUMN "cartTotalPrice" SET DEFAULT 0,
ALTER COLUMN "cartTotalPriceAfterDiscount" SET NOT NULL,
ALTER COLUMN "cartTotalPriceAfterDiscount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "shipping" SET NOT NULL,
ALTER COLUMN "shipping" SET DEFAULT 0;
