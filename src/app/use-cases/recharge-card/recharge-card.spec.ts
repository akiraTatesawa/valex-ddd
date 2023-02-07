import { randNumber, randUuid, randPastDate } from "@ngneat/falso";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { CompanyRepository } from "@app/ports/repositories/company-repository";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { GetCompanyService } from "@app/services/get-company/get-company.interface";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryCardRepository } from "@infra/data/repositories/in-memory/in-memory-card-repository";
import { InMemoryCompanyRepository } from "@infra/data/repositories/in-memory/in-memory-company-repository";
import { InMemoryRechargeRepository } from "@infra/data/repositories/in-memory/in-memory-recharge-repository";
import { GetCompanyImpl } from "@app/services/get-company/get-company.service";
import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { CreateRechargeDTO } from "@app/dtos/create-recharge.dto";
import { Card } from "@domain/card/card";
import { CardFactory } from "@tests/factories/card-factory";
import { Company } from "@domain/company/company";
import { CompanyFactory } from "@tests/factories/company-factory";
import { Left, Right } from "@core/logic/either";
import { GetCompanyErrors } from "@app/services/get-company/get-company-errors/errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { DomainErrors } from "@domain/errors/domain-error";
import { RechargeCardUseCase, RechargeCardImpl } from "./recharge-card";

describe("Recharge Card Use Case", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let cardRepository: CardRepository;
  let getCardService: GetCardService;

  let companyRepository: CompanyRepository;
  let getCompanyService: GetCompanyService;

  let rechargeRepository: RechargeRepository;
  let sut: RechargeCardUseCase;

  const card: Card = new CardFactory().generate({ password: "1234" });
  const company: Company = new CompanyFactory().generate();

  beforeEach(async () => {
    inMemoryDatabase = new InMemoryDatabase();
    cardRepository = new InMemoryCardRepository(inMemoryDatabase);
    companyRepository = new InMemoryCompanyRepository(inMemoryDatabase);
    rechargeRepository = new InMemoryRechargeRepository(inMemoryDatabase);

    getCompanyService = new GetCompanyImpl(companyRepository);
    getCardService = new GetCardService(cardRepository);

    sut = new RechargeCardImpl(rechargeRepository, getCompanyService, getCardService);

    await companyRepository.save(company);
    await cardRepository.save(card);
  });

  describe("Success", () => {
    it("Should be able to recharge a card", async () => {
      const request: CreateRechargeDTO = {
        cardId: card._id,
        apiKey: company.apiKey,
        amount: randNumber({ min: 1 }),
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toHaveProperty("id");
      expect(result.value.getValue()).toHaveProperty("timestamp");
      expect(result.value.getValue()).toHaveProperty("cardId", request.cardId);
      expect(result.value.getValue()).toHaveProperty("amount", request.amount);
      expect(inMemoryDatabase.recharges).toHaveLength(1);
      expect(inMemoryDatabase.recharges[0]).toHaveProperty("id");
    });
  });

  describe("Fail", () => {
    it("Should return an error if the company does not exist", async () => {
      const request: CreateRechargeDTO = {
        cardId: card._id,
        apiKey: randUuid(),
        amount: randNumber({ min: 1 }),
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCompanyErrors.NotFoundError);
      expect(result.value.getError()?.message).toEqual("Company not found");
    });

    it("Should return an error if the card does not exist", async () => {
      const request: CreateRechargeDTO = {
        cardId: randUuid(),
        apiKey: company.apiKey,
        amount: randNumber({ min: 1 }),
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCardErrors.NotFoundError);
      expect(result.value.getError()?.message).toEqual("Card not found");
    });

    it("Should return an error if the card is virtual", async () => {
      inMemoryDatabase.cards[0].isVirtual = true;
      const request: CreateRechargeDTO = {
        cardId: card._id,
        apiKey: company.apiKey,
        amount: randNumber({ min: 1 }),
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.VirtualCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Cannot recharge a virtual card");
    });

    it("Should return an error if the card is inactive", async () => {
      inMemoryDatabase.cards[0].password = undefined;
      const request: CreateRechargeDTO = {
        cardId: card._id,
        apiKey: company.apiKey,
        amount: randNumber({ min: 1 }),
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.InactiveCardError);
      expect(result.value.getError()?.message).toEqual("The card must be active");
    });

    it("Should return an error if the card is expired", async () => {
      const expiredCard = new CardFactory().generate({
        expirationDate: randPastDate({ years: 20 }),
        password: "1234",
      });
      await cardRepository.save(expiredCard);
      const request: CreateRechargeDTO = {
        cardId: expiredCard._id,
        apiKey: company.apiKey,
        amount: randNumber({ min: 1 }),
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.ExpiredCardError);
      expect(result.value.getError()?.message).toEqual("The card is expired");
    });

    it("Should return an error if the recharge amount is invalid", async () => {
      const request: CreateRechargeDTO = {
        cardId: card._id,
        apiKey: company.apiKey,
        amount: randNumber({ min: 1, max: 9 }) / 10,
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getError()?.message).toEqual("Amount must be an integer");
    });
  });
});
