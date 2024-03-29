import {
  CardFindByTypeArgs,
  CardRepository,
  FindCardByDetailsArgs,
} from "@app/ports/repositories/card-repository";
import { Card } from "@domain/card/card";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { CardDataMapper } from "@infra/data/mappers/card-data-mapper";

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

    return CardDataMapper.toDomain(rawCard);
  }

  public async findByType({ employeeId, type }: CardFindByTypeArgs): Promise<Card | null> {
    const rawCard = this.database.cards.find(
      (card) => card.employeeId === employeeId && card.type === type
    );

    if (!rawCard) return null;

    return CardDataMapper.toDomain(rawCard);
  }

  public async findByDetails(args: FindCardByDetailsArgs): Promise<Card | null> {
    const { cardNumber, cardholderName, expirationDate } = args;

    const rawCard = this.database.cards.find(
      (raw) =>
        raw.cardholderName === cardholderName &&
        raw.expirationDate === expirationDate &&
        raw.number === cardNumber
    );

    if (!rawCard) return null;

    return CardDataMapper.toDomain(rawCard);
  }

  public async save(data: Card): Promise<void> {
    const rawCard = CardDataMapper.toPersistence(data);

    const cardAlreadyExist = await this.exists(rawCard.id);

    if (cardAlreadyExist) {
      const indexOfCard = this.database.cards.findIndex((card) => card.id === rawCard.id);

      this.database.cards[indexOfCard] = rawCard;
    } else {
      this.database.cards.push(rawCard);
    }
  }

  public async delete(id: string): Promise<void> {
    const cardIndex = this.database.cards.findIndex((rawCard) => rawCard.id === id);

    this.database.cards.splice(cardIndex);
  }
}
