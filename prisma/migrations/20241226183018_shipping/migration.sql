/*
  Warnings:

  - You are about to drop the column `shipping` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shipping",
ADD COLUMN     "shippingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shippingLocation" TEXT;
