import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { Card } from "@domain/card/card";
import { PrismaCardRepository } from "@infra/data/repositories/prisma/prisma-card-repository";
import { CardExpirationDate } from "@domain/card/card-expiration-date";
import { randPastDate } from "@ngneat/falso";

export class CardHelper {
  private static readonly prismaCardRepo = new PrismaCardRepository(prisma);

  public static async activateCard(card: Card, password: string): Promise<void> {
    card.activate(password);

    await this.prismaCardRepo.save(card);
  }

  public static async inactivateCard(card: Card): Promise<void> {
    await prisma.card.update({
      data: {
        password: null,
      },
      where: {
        id: card._id,
      },
    });
  }

  public static async expireCard(card: Card): Promise<void> {
    const expiredDate = CardExpirationDate.create(randPastDate({ years: 10 })).value.getValue()!;
    const expiredStringDate = expiredDate.getStringExpirationDate();

    await prisma.card.update({
      data: {
        expirationDate: expiredStringDate,
      },
      where: {
        id: card._id,
      },
    });
  }

  public static async createVirtualCard(card: Card): Promise<Card> {
    const virtualCard = card.generateVirtualCard().value.getValue()!;

    await this.prismaCardRepo.save(virtualCard);

    return virtualCard;
  }
}
