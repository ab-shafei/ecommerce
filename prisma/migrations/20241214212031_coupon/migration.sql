/*
  Warnings:

  - You are about to drop the column `isActive` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `minAmount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Coupon` table. All the data in the column will be lost.
  - You are about to alter the column `discount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "isActive",
DROP COLUMN "minAmount",
DROP COLUMN "type",
ALTER COLUMN "discount" SET DATA TYPE INTEGER;
