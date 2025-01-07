/*
  Warnings:

  - You are about to drop the `_BannerImageToLayout` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `layoutId` to the `BannerImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BannerImageToLayout" DROP CONSTRAINT "_BannerImageToLayout_A_fkey";

-- DropForeignKey
ALTER TABLE "_BannerImageToLayout" DROP CONSTRAINT "_BannerImageToLayout_B_fkey";

-- AlterTable
ALTER TABLE "BannerImage" ADD COLUMN     "layoutId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_BannerImageToLayout";

-- AddForeignKey
ALTER TABLE "BannerImage" ADD CONSTRAINT "BannerImage_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
