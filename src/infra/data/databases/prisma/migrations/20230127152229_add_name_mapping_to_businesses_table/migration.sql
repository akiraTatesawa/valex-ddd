/*
  Warnings:

  - You are about to drop the `PrismaBusiness` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PrismaBusiness";

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_name_key" ON "businesses"("name");
