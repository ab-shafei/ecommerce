-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "numberOfUsage" DROP DEFAULT;
DROP SEQUENCE "Coupon_numberOfUsage_seq";
