/*
  Warnings:

  - You are about to drop the column `images` on the `Layout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Layout" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "BannerImage" (
    "id" SERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "BannerImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BannerImageToLayout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BannerImageToLayout_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BannerImageToLayout_B_index" ON "_BannerImageToLayout"("B");

-- AddForeignKey
ALTER TABLE "_BannerImageToLayout" ADD CONSTRAINT "_BannerImageToLayout_A_fkey" FOREIGN KEY ("A") REFERENCES "BannerImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BannerImageToLayout" ADD CONSTRAINT "_BannerImageToLayout_B_fkey" FOREIGN KEY ("B") REFERENCES "Layout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
