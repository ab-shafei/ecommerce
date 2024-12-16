/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactEmail` to the `Layout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhoneNumber` to the `Layout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_layoutId_fkey";

-- AlterTable
ALTER TABLE "Layout" ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactPhoneNumber" TEXT NOT NULL;

-- DropTable
DROP TABLE "Contact";
