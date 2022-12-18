import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { Card } from "@modules/cards/domain/card";
import { PrismaCardRepository } from "@modules/cards/infra/database/prisma/prisma-card-repository";

export class CardHelper {
  public static async activateCard(card: Card, password: string): Promise<void> {
    card.activate(password);

    await new PrismaCardRepository(prisma).save(card);
  }
}
