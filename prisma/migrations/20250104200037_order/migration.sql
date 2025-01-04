/*
  Warnings:

  - A unique constraint covering the columns `[payMobOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Order_payMobOrderId_key" ON "Order"("payMobOrderId");
