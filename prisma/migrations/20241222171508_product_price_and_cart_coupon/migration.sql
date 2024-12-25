/*
  Warnings:

  - You are about to alter the column `cartTotalPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cartTotalPriceAfterDiscount` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cartItemTotalPrice` on the `CartItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `discount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `minPurchase` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `shipping` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `priceAfterDiscount` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "couponId" INTEGER,
ALTER COLUMN "cartTotalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cartTotalPriceAfterDiscount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "cartItemTotalPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minPurchase" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "shipping" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "priceAfterDiscount" SET DATA TYPE DOUBLE PRECISION;
