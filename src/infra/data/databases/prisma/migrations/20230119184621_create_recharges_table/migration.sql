-- CreateTable
CREATE TABLE "recharges" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recharges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recharges" ADD CONSTRAINT "recharges_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
