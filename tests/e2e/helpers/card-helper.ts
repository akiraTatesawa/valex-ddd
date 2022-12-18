import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { Card } from "@domain/card/card";
import { PrismaCardRepository } from "@infra/data/repositories/prisma/prisma-card-repository";

export class CardHelper {
  public static async activateCard(card: Card, password: string): Promise<void> {
    card.activate(password);

    await new PrismaCardRepository(prisma).save(card);
  }
}
