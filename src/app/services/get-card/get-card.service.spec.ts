import { CardRepository } from "@app/ports/card-repository";
import { InMemoryCardRepository } from "@infra/data/repositories/in-memory/in-memory-card-repository";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { randUuid } from "@ngneat/falso";
import { CardFactory } from "@tests/factories/card-factory";
import { Card } from "@domain/card/card";
import { Left, Right } from "@core/logic/either";
import { GetCardService } from "./get-card.service";
import { GetCardErrors } from "./get-card-errors/errors";

describe("Get Card Service", () => {
  let cardRepository: CardRepository;
  let sut: GetCardService;

  beforeEach(async () => {
    const inMemoryDatabase = new InMemoryDatabase();
    cardRepository = new InMemoryCardRepository(inMemoryDatabase);
    sut = new GetCardService(cardRepository);
  });

  describe("Success", () => {
    it("Should be able to get a card by id", async () => {
      const mockCardId = randUuid();
      const mockCard: Card = new CardFactory().generate({ id: mockCardId });
      await cardRepository.save(mockCard);

      const result = await sut.getCard(mockCardId);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Card);
      expect(result.value.getValue()).toEqual(mockCard);
      expect(result.value.getValue()?._id).toEqual(mockCardId);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the card does not exist", async () => {
      const mockCardId = randUuid();

      const result = await sut.getCard(mockCardId);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCardErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card not found");
    });

    it("Should return an error if the card id is invalid", async () => {
      const mockCardId = "invalid_card_id";

      const result = await sut.getCard(mockCardId);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCardErrors.InvalidCardIdError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card ID must be a valid UUID");
    });
  });
});
