import { CardRepository } from "@app/ports/repositories/card-repository";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { Left, Right } from "@core/logic/either";
import { Card } from "@domain/card/card";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryCardRepository } from "@infra/data/repositories/in-memory/in-memory-card-repository";
import { randUuid } from "@ngneat/falso";
import { CardFactory } from "@tests/factories/card-factory";
import { DeleteVirtualCardDTO } from "@app/dtos/delete-virtual-card.dto";
import { DeleteVirtualCardErrors } from "@app/errors/delete-virtual-card-errors";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { DeleteVirtualCardUseCase } from "./delete-virtual-card";

describe("Delete Virtual Card Use Case", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let cardRepo: CardRepository;
  let getCardService: GetCardService;
  let sut: DeleteVirtualCardUseCase;

  let card: Card;

  beforeEach(async () => {
    inMemoryDatabase = new InMemoryDatabase();
    cardRepo = new InMemoryCardRepository(inMemoryDatabase);
    getCardService = new GetCardService(cardRepo);
    sut = new DeleteVirtualCardUseCase(cardRepo, getCardService);

    card = new CardFactory().generate({ isVirtual: true });
    card.activate("1234");

    await cardRepo.save(card);
  });

  describe("Success", () => {
    it("Should be able to delete a virtual card", async () => {
      const request: DeleteVirtualCardDTO = {
        cardId: card._id,
        password: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Right);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeNull();
      expect(inMemoryDatabase.cards.some((rawCard) => rawCard.isVirtual)).toEqual(false);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the virtual card does not exist", async () => {
      const request: DeleteVirtualCardDTO = {
        cardId: randUuid(),
        password: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(GetCardErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Card not found");
    });

    it("Should return an error if the card is not virtual", async () => {
      inMemoryDatabase.cards[0].isVirtual = false;
      const request: DeleteVirtualCardDTO = {
        cardId: card._id,
        password: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(DeleteVirtualCardErrors.NotVirtualError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "The card must be virtual");
    });

    it("Should return an error if the password is incorrect", async () => {
      const request: DeleteVirtualCardDTO = {
        cardId: card._id,
        password: "incorrect_password",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.WrongPasswordError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Wrong Password");
    });
  });
});
