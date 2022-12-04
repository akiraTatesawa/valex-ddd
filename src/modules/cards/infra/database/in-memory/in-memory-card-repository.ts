import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";
import { CardFindByTypeArgs, CardRepository } from "@modules/cards/app/ports/card-repository";
import { Card } from "@modules/cards/domain/card";
import { CardMapper } from "@modules/cards/mappers/card-mapper";

export class InMemoryCardRepository implements CardRepository {
  private readonly database: InMemoryDatabase;

  constructor(database: InMemoryDatabase) {
    this.database = database;
  }

  public async exists(id: string): Promise<boolean> {
    const rawCard = this.database.cards.find((card) => card.id === id);

    if (!rawCard) return false;

    return true;
  }

  public async findById(id: string): Promise<Card | null> {
    const rawCard = this.database.cards.find((card) => card.id === id);

    if (!rawCard) return null;

    return CardMapper.toDomain(rawCard);
  }

  public async findByType({ employeeId, type }: CardFindByTypeArgs): Promise<Card | null> {
    const rawCard = this.database.cards.find(
      (card) => card.employeeId === employeeId && card.type === type
    );

    if (!rawCard) return null;

    return CardMapper.toDomain(rawCard);
  }

  public async save(data: Card): Promise<void> {
    const rawCard = CardMapper.toPersistence(data);

    const cardAlreadyExist = await this.exists(rawCard.id);

    if (cardAlreadyExist) {
      const indexOfCard = this.database.cards.findIndex((card) => card.id === rawCard.id);

      this.database.cards[indexOfCard] = rawCard;
    } else {
      this.database.cards.push(rawCard);
    }
  }
}
