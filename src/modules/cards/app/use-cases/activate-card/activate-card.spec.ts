import { randUuid, randPastDate, randFullName } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { ActivateCardDTO } from "@modules/cards/dtos/activate-card.dto";
import { CardRepository } from "@modules/cards/app/ports/card-repository";
import { Card } from "@modules/cards/domain/card";
import { CardFactory } from "@modules/cards/factories/card-factory";
import { InMemoryCardRepository } from "@modules/cards/infra/database/in-memory/in-memory-card-repository";
import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";
import { ActivateCardImpl, ActivateCardUseCase } from "./activate-card";
import { CardUseCaseErrors } from "../../card-shared-errors/card-shared-errors";
import { ActivateCardErrors } from "./activate-card-errors/errors";

describe("Activate Card Use Case", () => {
  let card: Card;
  let cardRepo: CardRepository;
  let sut: ActivateCardUseCase;

  beforeEach(async () => {
    const inMemoryDatabase = new InMemoryDatabase();
    cardRepo = new InMemoryCardRepository(inMemoryDatabase);
    card = new CardFactory().generate();

    await cardRepo.save(card);

    sut = new ActivateCardImpl(cardRepo);
  });

  describe("Success", () => {
    it("Should be able to activate a card", async () => {
      const activateCardReq: ActivateCardDTO = {
        cardId: card._id,
        cvv: card.securityCode.decrypt(),
        password: "1234",
      };

      const result = await sut.execute(activateCardReq);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeNull();
    });
  });

  describe("Fail", () => {
    it("Should return an error if the card does not exist", async () => {
      const activateCardReq: ActivateCardDTO = {
        cardId: randUuid(),
        cvv: card.securityCode.decrypt(),
        password: "1234",
      };

      const result = await sut.execute(activateCardReq);

      expect(result).toBeInstanceOf(CardUseCaseErrors.NotFoundError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Card not found");
    });

    it("Should return an error if the card is already active", async () => {
      const activateCardReq: ActivateCardDTO = {
        cardId: card._id,
        cvv: card.securityCode.decrypt(),
        password: "1234",
      };
      await sut.execute(activateCardReq);

      const result = await sut.execute(activateCardReq);

      expect(result).toBeInstanceOf(ActivateCardErrors.CardIsAlreadyActiveError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("The card is already active");
    });

    it("Should return an error if the card is expired", async () => {
      const mockCard = new CardFactory().generate({ expirationDate: randPastDate({ years: 10 }) });
      await cardRepo.save(mockCard);

      const activateCardReq: ActivateCardDTO = {
        cardId: mockCard._id,
        cvv: mockCard.securityCode.decrypt(),
        password: "1234",
      };

      const result = await sut.execute(activateCardReq);

      expect(result).toBeInstanceOf(CardUseCaseErrors.ExpiredCardError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("The card is expired");
    });

    it("Should return an error if the CVV is incorrect", async () => {
      const activateCardReq: ActivateCardDTO = {
        cardId: card._id,
        cvv: "123",
        password: "1234",
      };

      const result = await sut.execute(activateCardReq);

      expect(result).toBeInstanceOf(CardUseCaseErrors.IncorrectCVVError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Incorrect Card CVV");
    });

    it("Should return an error if the password is not a 4 digits string", async () => {
      const activateCardReq: ActivateCardDTO = {
        cardId: card._id,
        cvv: card.securityCode.decrypt(),
        password: randFullName(),
      };

      const result = await sut.execute(activateCardReq);

      expect(result).toBeInstanceOf(ActivateCardErrors.InvalidPasswordError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Card Password must be a 4 numeric digits string");
    });
  });
});