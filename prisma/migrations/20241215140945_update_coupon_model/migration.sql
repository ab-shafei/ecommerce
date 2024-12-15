/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Coupon` table. All the data in the column will be lost.
  - Added the required column `end` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('UNUSED', 'USED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "expiresAt",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "minPurchase" DECIMAL(65,30),
ADD COLUMN     "numberOfUsage" SERIAL NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "CouponStatus" NOT NULL DEFAULT 'UNUSED';
