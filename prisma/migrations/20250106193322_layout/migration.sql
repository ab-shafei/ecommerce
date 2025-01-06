/*
  Warnings:

  - You are about to drop the column `color` on the `Layout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Layout" DROP COLUMN "color",
ADD COLUMN     "color1" TEXT,
ADD COLUMN     "color2" TEXT,
ADD COLUMN     "color3" TEXT;
