import { prisma } from "@infra/database/prisma/config/prisma.database";
import { UnblockCardImpl } from "@modules/cards/app/use-cases/unblock-card/unblock-card";
import { PrismaCardRepository } from "@modules/cards/infra/database/prisma/prisma-card-repository";
import { UnblockCardController } from "./unblock-card.controller";

function unblockCardControllerFactory(): UnblockCardController {
  const cardRepository = new PrismaCardRepository(prisma);
  const useCase = new UnblockCardImpl(cardRepository);

  return new UnblockCardController(useCase);
}

export const unblockCardController = unblockCardControllerFactory();
