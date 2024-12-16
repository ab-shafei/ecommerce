-- CreateTable
CREATE TABLE "Layout" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "paragraph" TEXT,
    "images" TEXT[],

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "layoutId" INTEGER NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_layoutId_key" ON "Contact"("layoutId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
