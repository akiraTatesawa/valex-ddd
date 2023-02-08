import { randNumber, randCreditCardCVV, randUuid } from "@ngneat/falso";
import { CreateOnlinePaymentDTO } from "@app/dtos/create-payment.dto";
import { BusinessRepository } from "@app/ports/repositories/business-repository";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { GetBalanceService } from "@app/services/get-balance/get-balance.service";
import { GetBusinessService } from "@app/services/get-business/get-business.service";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryBusinessRepository } from "@infra/data/repositories/in-memory/in-memory-business-repository";
import { InMemoryCardRepository } from "@infra/data/repositories/in-memory/in-memory-card-repository";
import { InMemoryPaymentRepository } from "@infra/data/repositories/in-memory/in-memory-payment-repository";
import { InMemoryRechargeRepository } from "@infra/data/repositories/in-memory/in-memory-recharge-repository";
import { BusinessFactory } from "@tests/factories/business-factory";
import { CardFactory } from "@tests/factories/card-factory";
import { RechargeFactory } from "@tests/factories/recharge-factory";
import { Left, Right } from "@core/logic/either";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { GetBusinessErrors } from "@app/services/get-business/get-business-errors/errors";
import { PaymentErrors } from "@app/errors/payment-errors";
import { DomainErrors } from "@domain/errors/domain-error";
import { BuyOnlineUseCase } from "./buy-online";

describe("Buy Online Use Case", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let paymentRepository: PaymentRepository;
  let rechargeRepository: RechargeRepository;
  let cardRepository: CardRepository;
  let businessRepository: BusinessRepository;

  let getCardService: GetCardService;
  let getBusinessService: GetBusinessService;
  let getBalanceService: GetBalanceService;

  const card = new CardFactory().generate({ type: "health" });
  const business = new BusinessFactory().generate({ type: "health" });
  const recharge = new RechargeFactory().generate({ amount: 100, cardId: card._id });

  let sut: BuyOnlineUseCase;

  beforeEach(async () => {
    inMemoryDatabase = new InMemoryDatabase();
    paymentRepository = new InMemoryPaymentRepository(inMemoryDatabase);
    rechargeRepository = new InMemoryRechargeRepository(inMemoryDatabase);
    cardRepository = new InMemoryCardRepository(inMemoryDatabase);
    businessRepository = new InMemoryBusinessRepository(inMemoryDatabase);

    getCardService = new GetCardService(cardRepository);
    getBusinessService = new GetBusinessService(businessRepository);
    getBalanceService = new GetBalanceService(paymentRepository, rechargeRepository);

    sut = new BuyOnlineUseCase(
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
    it("Should be able to create an online payment", async () => {
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 1, max: 40 }),
        businessId: business._id,
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Right);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toHaveProperty("id");
      expect(result.value.getValue()).toHaveProperty("cardId", card._id);
      expect(result.value.getValue()).toHaveProperty("businessId", request.businessId);
      expect(result.value.getValue()).toHaveProperty("amount", request.amount);
      expect(result.value.getValue()).toHaveProperty("timestamp");
      expect(inMemoryDatabase.payments).toHaveLength(1);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the card does not exist", async () => {
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 1, max: 40 }),
        businessId: business._id,
        cardInfo: {
          cardholderName: "MOCK NAME",
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(GetCardErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Card not found");
    });

    it("Should return an error if the card is not active", async () => {
      inMemoryDatabase.cards[0].password = undefined;
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 1, max: 40 }),
        businessId: business._id,
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.InactiveCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "The card must be active");
    });

    it("Should return an error if the card is expired", async () => {
      inMemoryDatabase.cards[0].expirationDate = "01/01";
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 1, max: 40 }),
        businessId: business._id,
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: "01/01",
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.ExpiredCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "The card is expired");
    });

    it("Should return an error if the card is blocked", async () => {
      inMemoryDatabase.cards[0].isBlocked = true;
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 1, max: 40 }),
        businessId: business._id,
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.BlockedCardError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "The card is blocked");
    });

    it("Should return an error if the security code is incorrect", async () => {
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 1, max: 40 }),
        businessId: business._id,
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: randCreditCardCVV(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.IncorrectCVVError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Incorrect Card CVV");
    });

    it("Should return an error if the business does not exist", async () => {
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 1, max: 40 }),
        businessId: randUuid(),
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(GetBusinessErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Business not found");
    });

    it("Should return an error if the card type is not the same as the business type", async () => {
      inMemoryDatabase.businesses[0].type = "education";
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 1, max: 40 }),
        businessId: business._id,
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(PaymentErrors.IncompatibleTypesError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Business Type must be the same as the Card Type"
      );
    });

    it("Should return an error if the card balance is insufficient", async () => {
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 900 }),
        businessId: business._id,
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(PaymentErrors.InsufficientBalance);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Insufficient Card Balance");
    });

    it("Should return an error if the payment amount is invalid", async () => {
      const request: CreateOnlinePaymentDTO = {
        amount: randNumber({ min: 900 }) / 90,
        businessId: business._id,
        cardInfo: {
          cardholderName: card.cardholderName.value,
          cardNumber: card.number.value,
          cvv: card.securityCode.decrypt(),
          expirationDate: card.expirationDate.getStringExpirationDate(),
        },
      };

      const result = await sut.execute(request);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Amount must be an integer");
    });
  });
});
