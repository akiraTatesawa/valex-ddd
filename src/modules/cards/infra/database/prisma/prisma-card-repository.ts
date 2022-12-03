import { PrismaDatabase } from "@infra/database/prisma/config/prisma.database";
import { CardFindByTypeArgs, CardRepository } from "@modules/cards/app/ports/card-repository";
import { Card } from "@modules/cards/domain/card";
import { CardMapper } from "@modules/cards/mappers/card-mapper";
import { CardPersistence } from "../card-persistence";

export class PrismaCardRepository implements CardRepository {
  private readonly prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this.prisma = prisma;
  }

  public async findByType({ employeeId, type }: CardFindByTypeArgs): Promise<Card | null> {
    const rawCard = await this.prisma.card.findUnique({
      where: {
        employeeId_type: {
          employeeId,
          type,
        },
      },
    });

    if (!rawCard) return null;

    const rawCardPersistence: CardPersistence = {
      ...rawCard,
      password: rawCard.password ?? undefined,
      originalCardId: rawCard.originalCardId ?? undefined,
    };

    return CardMapper.toDomain(rawCardPersistence);
  }

  public async save(data: Card): Promise<void> {
    const rawCard = CardMapper.toPersistence(data);

    await this.prisma.card.upsert({
      where: {
        id: rawCard.id,
      },
      create: rawCard,
      update: rawCard,
    });
  }
}
