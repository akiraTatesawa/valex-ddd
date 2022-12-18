import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { BlockCardImpl } from "@modules/cards/app/use-cases/block-card/block-card";
import { PrismaCardRepository } from "@modules/cards/infra/database/prisma/prisma-card-repository";
import { BlockCardController } from "./block-card.controller";

function blockCardControllerFactory() {
  const cardRepository = new PrismaCardRepository(prisma);
  const blockCardUseCase = new BlockCardImpl(cardRepository);

  return new BlockCardController(blockCardUseCase);
}

export const blockCardController = blockCardControllerFactory();
