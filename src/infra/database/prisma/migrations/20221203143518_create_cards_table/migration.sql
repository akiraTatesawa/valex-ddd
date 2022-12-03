-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('restaurant', 'health', 'transport', 'groceries', 'education');

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "cardholderName" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL,
    "number" TEXT NOT NULL,
    "securityCode" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "password" TEXT,
    "isVirtual" BOOLEAN NOT NULL,
    "isBlocked" BOOLEAN NOT NULL,
    "originalCardId" TEXT,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cards_employeeId_type_key" ON "cards"("employeeId", "type");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_originalCardId_fkey" FOREIGN KEY ("originalCardId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
