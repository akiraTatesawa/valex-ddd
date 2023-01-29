import { CreateVirtualCardDTO } from "@app/dtos/create-virtual-card.dto";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { Left, Right } from "@core/logic/either";
import { Card } from "@domain/card/card";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryCardRepository } from "@infra/data/repositories/in-memory/in-memory-card-repository";
import { CardFactory } from "@tests/factories/card-factory";
import { randUuid } from "@ngneat/falso";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { DomainErrors } from "@domain/errors/domain-error";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { CreateVirtualCardUseCase } from "./create-virtual-card";

describe("Create Virtual Card Use Case", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let cardRepository: CardRepository;
  let getCardService: GetCardService;
  let originalCard: Card;
  let sut: CreateVirtualCardUseCase;

  beforeEach(async () => {
    inMemoryDatabase = new InMemoryDatabase();
    cardRepository = new InMemoryCardRepository(inMemoryDatabase);
    getCardService = new GetCardService(cardRepository);
    originalCard = new CardFactory().generate();
    originalCard.activate("1234");

    sut = new CreateVirtualCardUseCase(cardRepository, getCardService);

    await cardRepository.save(originalCard);
  });

  describe("Success", () => {
    it("Should be able to create a virtual card", async () => {
      const request: CreateVirtualCardDTO = {
        cardId: originalCard._id,
        password: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Right);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toHaveProperty("id");
      expect(result.value.getValue()).toHaveProperty("type", originalCard.type);
      expect(result.value.getValue()).toHaveProperty(
        "cardholderName",
        originalCard.cardholderName.value
      );
      expect(result.value.getValue()?.securityCode).not.toEqual(
        originalCard.securityCode.decrypt()
      );
      expect(inMemoryDatabase.cards).toHaveLength(2);
      expect(inMemoryDatabase.cards[1].originalCardId).toEqual(originalCard._id);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the card does not exist", async () => {
      const result = await sut.execute({
        cardId: randUuid(),
        password: "1234",
      });

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(GetCardErrors.NotFoundError);
      expect(result.value.getError()).toHaveProperty("message", "Card not found");
    });

    it("Should return an error if the card is not active", async () => {
      inMemoryDatabase.cards[0].password = undefined;
      const result = await sut.execute({
        cardId: originalCard._id,
        password: "1234",
      });

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.InactiveCardError);
      expect(result.value.getError()).toHaveProperty("message", "The card must be active");
    });

    it("Should return an error if the password is incorrect", async () => {
      const result = await sut.execute({
        cardId: originalCard._id,
        password: "0000",
      });

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.WrongPasswordError);
      expect(result.value.getError()).toHaveProperty("message", "Wrong Password");
    });

    it("Should return an error if the originalCardId belongs to a virtual card", async () => {
      const virtualCard = originalCard.generateVirtualCard().value.getValue()!;
      await cardRepository.save(virtualCard);

      const result = await sut.execute({
        cardId: virtualCard._id,
        password: "1234",
      });

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Cannot create a Virtual Card from another virtual card"
      );
    });
  });
});
