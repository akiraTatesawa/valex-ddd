import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import { Card } from "@domain/card/card";
import { CardPersistence } from "@infra/data/persistence-model/card-persistence";
import { CardFindByTypeArgs, CardRepository } from "@app/ports/card-repository";
import { CardDataMapper } from "@infra/data/mappers/card-data-mapper";

export class PrismaCardRepository implements CardRepository {
  private readonly prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this.prisma = prisma;
  }

  public async findById(id: string): Promise<Card | null> {
    const rawCard = await this.prisma.card.findUnique({
      where: {
        id,
      },
    });

    if (!rawCard) return null;

    const rawCardPersistence: CardPersistence = {
      ...rawCard,
      password: rawCard.password ?? undefined,
      originalCardId: rawCard.originalCardId ?? undefined,
    };

    return CardDataMapper.toDomain(rawCardPersistence);
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

    return CardDataMapper.toDomain(rawCardPersistence);
  }

  public async save(data: Card): Promise<void> {
    const rawCard = CardDataMapper.toPersistence(data);

    await this.prisma.card.upsert({
      where: {
        id: rawCard.id,
      },
      create: rawCard,
      update: rawCard,
    });
  }
}
