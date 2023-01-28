import { CardRepository } from "@app/ports/repositories/card-repository";
import { InMemoryCardRepository } from "@infra/data/repositories/in-memory/in-memory-card-repository";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { randUuid } from "@ngneat/falso";
import { CardFactory } from "@tests/factories/card-factory";
import { Card } from "@domain/card/card";
import { Left, Right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";
import { GetCardService, GetCardByDetailsRequest } from "./get-card.service";
import { GetCardErrors } from "./get-card-errors/errors";

describe("Get Card Service", () => {
  let cardRepository: CardRepository;
  let sut: GetCardService;

  const cardId = randUuid();
  let card: Card;

  beforeEach(async () => {
    const inMemoryDatabase = new InMemoryDatabase();
    cardRepository = new InMemoryCardRepository(inMemoryDatabase);
    sut = new GetCardService(cardRepository);
  });

  describe("Success", () => {
    beforeEach(async () => {
      card = new CardFactory().generate({ id: cardId });
      await cardRepository.save(card);
    });

    beforeEach(async () => {
      card = new CardFactory().generate({ id: cardId });
      await cardRepository.save(card);
    });

    it("Should be able to get a card by id", async () => {
      const result = await sut.getCard(cardId);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Card);
      expect(result.value.getValue()?._id).toEqual(cardId);
    });

    it("Should be able to get a card by details", async () => {
      const request: GetCardByDetailsRequest = {
        cardholderName: card.cardholderName.value,
        cardNumber: card.number.value,
        expirationDate: card.expirationDate.getStringExpirationDate(),
      };

      const result = await sut.getCardByDetails(request);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Card);
      expect(result.value.getValue()?._id).toEqual(cardId);
    });
  });

  describe("Fail", () => {
    it("[getCard] Should return an error if the card does not exist", async () => {
      const mockCardId = randUuid();

      const result = await sut.getCard(mockCardId);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCardErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card not found");
    });

    it("[getCardByDetails] Should return an error if the card does not exist", async () => {
      const request: GetCardByDetailsRequest = {
        cardholderName: "FAKE NAME",
        cardNumber: "123456789012",
        expirationDate: "12/12",
      };

      const result = await sut.getCardByDetails(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCardErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card not found");
    });

    it("[getCard] Should return an error if the card id is invalid", async () => {
      const mockCardId = "invalid_card_id";

      const result = await sut.getCard(mockCardId);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCardErrors.InvalidCardIdError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card ID must be a valid UUID");
    });

    it("[getCardByDetails] Should return an error if the expirationDate format is invalid", async () => {
      const request: GetCardByDetailsRequest = {
        cardholderName: "FAKE NAME",
        cardNumber: "123456789012",
        expirationDate: "invalid",
      };

      const result = await sut.getCardByDetails(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Invalid Card Expiration Date format");
    });
  });
});
