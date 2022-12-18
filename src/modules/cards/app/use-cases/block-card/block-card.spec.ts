import { randUuid, randPastDate } from "@ngneat/falso";
import { Card } from "@modules/cards/domain/card";
import { CardRepository } from "@modules/cards/app/ports/card-repository";
import { InMemoryDatabase } from "@infra/data/in-memory/in-memory.database";
import { InMemoryCardRepository } from "@modules/cards/infra/database/in-memory/in-memory-card-repository";
import { CardFactory } from "@modules/cards/factories/card-factory";
import { Left, Right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { BlockCardDTO } from "@modules/cards/dtos/block-unblock-card.dto";
import { BlockCardUseCase, BlockCardImpl } from "./block-card";
import { BlockCardErrors } from "./block-card-errors/errors";

describe("Block Card Use Case", () => {
  let card: Card;
  let cardRepo: CardRepository;
  let sut: BlockCardUseCase;

  beforeEach(async () => {
    const inMemoryDatabase = new InMemoryDatabase();
    cardRepo = new InMemoryCardRepository(inMemoryDatabase);
    sut = new BlockCardImpl(cardRepo);

    card = new CardFactory().generate();

    await cardRepo.save(card);
  });

  describe("Success", () => {
    it("Should be able to block a card", async () => {
      const cardPassword = "1234";
      card.activate(cardPassword);
      await cardRepo.save(card);
      const blockCardRequest: BlockCardDTO = {
        cardId: card._id,
        password: cardPassword,
      };

      const result = await sut.execute(blockCardRequest);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toBeNull();
    });
  });

  describe("Fail", () => {
    it("Should return an error if the card does not exist", async () => {
      const blockCardRequest: BlockCardDTO = {
        cardId: randUuid(),
        password: "2345",
      };

      const result = await sut.execute(blockCardRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card not found");
    });

    it("Should return an error if the card is not active", async () => {
      const blockCardRequest: BlockCardDTO = {
        cardId: card._id,
        password: "2345",
      };

      const result = await sut.execute(blockCardRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.InactiveCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("The card must be active");
    });

    it("Should return an error if the password is incorrect", async () => {
      const cardPassword = "1234";
      card.activate(cardPassword);
      await cardRepo.save(card);
      const blockCardRequest: BlockCardDTO = {
        cardId: card._id,
        password: "4321",
      };

      const result = await sut.execute(blockCardRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.WrongPasswordError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Wrong Password");
    });

    it("Should return an error if the card is expired", async () => {
      const cardPassword = "1234";
      const expiredCard = new CardFactory().generate({
        expirationDate: randPastDate({ years: 10 }),
      });
      expiredCard.activate(cardPassword);
      await cardRepo.save(expiredCard);

      const blockCardRequest: BlockCardDTO = {
        cardId: expiredCard._id,
        password: cardPassword,
      };

      const result = await sut.execute(blockCardRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.ExpiredCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("The card is expired");
    });

    it("Should return an error if the card is already blocked", async () => {
      const cardPassword = "1234";
      card.activate(cardPassword);
      card.block();
      await cardRepo.save(card);
      const blockCardRequest: BlockCardDTO = {
        cardId: card._id,
        password: cardPassword,
      };

      const result = await sut.execute(blockCardRequest);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(BlockCardErrors.CardIsAlreadyBlockedError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("The card is already blocked");
    });
  });
});
