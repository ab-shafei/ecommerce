-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "totalCartPrice" DECIMAL(65,30),
ADD COLUMN     "totalPriceAfterDiscount" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "totalCartItemPrice" DECIMAL(65,30),
ALTER COLUMN "quantity" SET DEFAULT 1;
