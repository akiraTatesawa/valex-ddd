-- CreateTable
CREATE TABLE "PrismaBusiness" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL,

    CONSTRAINT "PrismaBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrismaBusiness_name_key" ON "PrismaBusiness"("name");
