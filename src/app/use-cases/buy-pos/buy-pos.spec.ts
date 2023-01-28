import { CreatePoSPaymentDTO } from "@app/dtos/create-payment.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { BusinessRepository } from "@app/ports/repositories/business-repository";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { Left, Right } from "@core/logic/either";
import { Card } from "@domain/card/card";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryBusinessRepository } from "@infra/data/repositories/in-memory/in-memory-business-repository";
import { InMemoryCardRepository } from "@infra/data/repositories/in-memory/in-memory-card-repository";
import { InMemoryPaymentRepository } from "@infra/data/repositories/in-memory/in-memory-payment-repository";
import { randUuid, randNumber, randPastDate } from "@ngneat/falso";
import { CardFactory } from "@tests/factories/card-factory";
import { GetBusinessService } from "@app/services/get-business/get-business.service";
import { Business } from "@domain/business/business";
import { BusinessFactory } from "@tests/factories/business-factory";
import { GetBusinessErrors } from "@app/services/get-business/get-business-errors/errors";
import { PaymentErrors } from "@app/errors/payment-errors";
import { GetBalanceService } from "@app/services/get-balance/get-balance.service";
import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { InMemoryRechargeRepository } from "@infra/data/repositories/in-memory/in-memory-recharge-repository";
import { RechargeFactory } from "@tests/factories/recharge-factory";
import { DomainErrors } from "@domain/errors/domain-error";
import { BuyPosUseCase } from "./buy-pos";

describe("Buy at Points of Sale Use Case", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let paymentRepository: PaymentRepository;
  let rechargeRepository: RechargeRepository;
  let cardRepository: CardRepository;
  let businessRepository: BusinessRepository;

  let getCardService: GetCardService;
  let getBusinessService: GetBusinessService;
  let getBalanceService: GetBalanceService;

  const card: Card = new CardFactory().generate({ type: "health" });
  const business: Business = new BusinessFactory().generate({ type: "health" });
  const recharge = new RechargeFactory().generate({ amount: 100, cardId: card._id });

  let sut: BuyPosUseCase;

  beforeEach(async () => {
    inMemoryDatabase = new InMemoryDatabase();
    paymentRepository = new InMemoryPaymentRepository(inMemoryDatabase);
    rechargeRepository = new InMemoryRechargeRepository(inMemoryDatabase);
    cardRepository = new InMemoryCardRepository(inMemoryDatabase);
    businessRepository = new InMemoryBusinessRepository(inMemoryDatabase);

    getCardService = new GetCardService(cardRepository);
    getBusinessService = new GetBusinessService(businessRepository);
    getBalanceService = new GetBalanceService(paymentRepository, rechargeRepository);

    sut = new BuyPosUseCase(
      paymentRepository,
      getCardService,
      getBusinessService,
      getBalanceService
    );

    card.activate("1234");
    await cardRepository.save(card);
    await rechargeRepository.save(recharge);
    await businessRepository.save(business);
  });

  describe("Success", () => {
    it("Should be able to make a pos payment", async () => {
      const request: CreatePoSPaymentDTO = {
        cardId: card._id,
        businessId: business._id,
        amount: randNumber({ min: 1, max: 90 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toHaveProperty("id");
      expect(result.value.getValue()).toHaveProperty("cardId", request.cardId);
      expect(result.value.getValue()).toHaveProperty("businessId", request.businessId);
      expect(result.value.getValue()).toHaveProperty("amount", request.amount);
      expect(result.value.getValue()).toHaveProperty("timestamp");
      expect(inMemoryDatabase.payments).toHaveLength(1);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the card does not exist", async () => {
      const request: CreatePoSPaymentDTO = {
        cardId: randUuid(),
        businessId: business._id,
        amount: randNumber({ min: 1, max: 90 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCardErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Card not found");
    });

    it("Should return an error if the card is not active", async () => {
      const inactiveCard = new CardFactory().generate();
      await cardRepository.save(inactiveCard);
      const request: CreatePoSPaymentDTO = {
        cardId: inactiveCard._id,
        businessId: business._id,
        amount: randNumber({ min: 1, max: 90 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.InactiveCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "The card must be active");
    });

    it("Should return an error if the card is expired", async () => {
      const expiredCard = new CardFactory().generate({
        expirationDate: randPastDate({ years: 10 }),
      });
      expiredCard.activate("1234");
      await cardRepository.save(expiredCard);
      const request: CreatePoSPaymentDTO = {
        cardId: expiredCard._id,
        businessId: business._id,
        amount: randNumber({ min: 1, max: 90 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.ExpiredCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "The card is expired");
    });

    it("Should return an error if the card is blocked", async () => {
      const blockedCard = new CardFactory().generate({
        isBlocked: true,
      });
      blockedCard.activate("1234");
      await cardRepository.save(blockedCard);
      const request: CreatePoSPaymentDTO = {
        cardId: blockedCard._id,
        businessId: business._id,
        amount: randNumber({ min: 1, max: 90 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.BlockedCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "The card is blocked");
    });

    it("Should return an error if the 'cardPassword' is wrong", async () => {
      const request: CreatePoSPaymentDTO = {
        cardId: card._id,
        businessId: business._id,
        amount: randNumber({ min: 1, max: 90 }),
        cardPassword: "3211",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.WrongPasswordError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Wrong Password");
    });

    it("Should return an error if the business does not exist", async () => {
      const request: CreatePoSPaymentDTO = {
        cardId: card._id,
        businessId: randUuid(),
        amount: randNumber({ min: 1, max: 90 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetBusinessErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Business not found");
    });

    it("Should return an error if the business type is not the same as the card type", async () => {
      const educationBusiness = new BusinessFactory().generate({ type: "education" });
      await businessRepository.save(educationBusiness);
      const request: CreatePoSPaymentDTO = {
        cardId: card._id,
        businessId: educationBusiness._id,
        amount: randNumber({ min: 1, max: 90 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(PaymentErrors.IncompatibleTypesError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Business Type must be the same as the Card Type"
      );
    });

    it("Should return an error if the card balance is insufficient", async () => {
      const request: CreatePoSPaymentDTO = {
        cardId: card._id,
        businessId: business._id,
        amount: randNumber({ min: 900 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(PaymentErrors.InsufficientBalance);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Insufficient Card Balance");
    });

    it("Should return an error if the amount is invalid", async () => {
      const request: CreatePoSPaymentDTO = {
        cardId: card._id,
        businessId: business._id,
        amount: randNumber({ min: 1, max: 10, fraction: 2 }),
        cardPassword: "1234",
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Amount must be an integer");
    });
  });
});
