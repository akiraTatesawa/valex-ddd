import { prisma } from "@infra/database/prisma/config/prisma.database";
import { ActivateCardImpl } from "@modules/cards/app/use-cases/activate-card/activate-card";
import { PrismaCardRepository } from "@modules/cards/infra/database/prisma/prisma-card-repository";
import { ActivateCardController } from "./activate-card.controller";

function activateCardControllerFactory() {
  const cardRepo = new PrismaCardRepository(prisma);
  const useCase = new ActivateCardImpl(cardRepo);

  return new ActivateCardController(useCase);
}

export const activateCardController = activateCardControllerFactory();
