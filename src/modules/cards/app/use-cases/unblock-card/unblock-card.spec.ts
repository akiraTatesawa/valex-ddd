import { randUuid, randPastDate } from "@ngneat/falso";
import { InMemoryDatabase } from "@infra/data/in-memory/in-memory.database";
import { CardRepository } from "@modules/cards/app/ports/card-repository";
import { Card } from "@modules/cards/domain/card";
import { UnblockCardDTO } from "@modules/cards/dtos/block-unblock-card.dto";
import { CardFactory } from "@modules/cards/factories/card-factory";
import { InMemoryCardRepository } from "@modules/cards/infra/database/in-memory/in-memory-card-repository";
import { Right, Left } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { UnblockCardImpl, UnblockCardUseCase } from "./unblock-card";
import { UnblockCardErrors } from "./unblock-card-errors/errors";

describe("Unblock Card Use Case", () => {
  let cardRepository: CardRepository;
  let sut: UnblockCardUseCase;

  let card: Card;
  const cardPassword = "1234";

  beforeEach(async () => {
    cardRepository = new InMemoryCardRepository(new InMemoryDatabase());
    sut = new UnblockCardImpl(cardRepository);

    card = new CardFactory().generate();

    await cardRepository.save(card);
  });

  describe("Success", () => {
    beforeEach(async () => {
      card.activate(cardPassword);
      card.block();

      await cardRepository.save(card);
    });

    it("Should be able to unblock a card", async () => {
      const sutRequest: UnblockCardDTO = {
        cardId: card._id,
        password: cardPassword,
      };

      const result = await sut.execute(sutRequest);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeNull();
    });
  });

  describe("Fail", () => {
    it("Should return an error if the card does not exist", async () => {
      const sutRequest: UnblockCardDTO = {
        cardId: randUuid(),
        password: cardPassword,
      };

      const result = await sut.execute(sutRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card not found");
    });

    it("Should return an error if the card has not been activated", async () => {
      const sutRequest: UnblockCardDTO = {
        cardId: card._id,
        password: cardPassword,
      };

      const result = await sut.execute(sutRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.InactiveCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("The card must be active");
    });

    it("Should return an error if the password is incorrect", async () => {
      card.activate(cardPassword);
      await cardRepository.save(card);

      const sutRequest: UnblockCardDTO = {
        cardId: card._id,
        password: "4321",
      };

      const result = await sut.execute(sutRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.WrongPasswordError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Wrong Password");
    });

    it("Should return an error if the card is expired", async () => {
      const expiredCard = new CardFactory().generate({
        expirationDate: randPastDate({
          years: 10,
        }),
      });
      expiredCard.activate(cardPassword);
      await cardRepository.save(expiredCard);
      const sutRequest: UnblockCardDTO = {
        cardId: expiredCard._id,
        password: cardPassword,
      };

      const result = await sut.execute(sutRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.ExpiredCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("The card is expired");
    });

    it("Should return an error if the card is not blocked", async () => {
      card.activate(cardPassword);
      await cardRepository.save(card);
      const sutRequest: UnblockCardDTO = {
        cardId: card._id,
        password: cardPassword,
      };

      const result = await sut.execute(sutRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(UnblockCardErrors.CardIsAlreadyUnblockedError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("The card is already unblocked");
    });
  });
});
