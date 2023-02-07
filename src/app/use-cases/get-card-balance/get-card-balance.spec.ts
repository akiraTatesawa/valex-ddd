import { randNumber, randUuid } from "@ngneat/falso";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { GetBalanceService } from "@app/services/get-balance/get-balance.service";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryCardRepository } from "@infra/data/repositories/in-memory/in-memory-card-repository";
import { InMemoryPaymentRepository } from "@infra/data/repositories/in-memory/in-memory-payment-repository";
import { InMemoryRechargeRepository } from "@infra/data/repositories/in-memory/in-memory-recharge-repository";
import { CardFactory } from "@tests/factories/card-factory";
import { PaymentFactory } from "@tests/factories/payment-factory";
import { RechargeFactory } from "@tests/factories/recharge-factory";
import { Left, Right } from "@core/logic/either";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { GetCardBalanceUseCase } from "./get-card-balance";

describe("Get Card Balance Use Case", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let cardRepository: CardRepository;
  let paymentRepository: PaymentRepository;
  let rechargeRepository: RechargeRepository;

  let getBalanceService: GetBalanceService;

  let sut: GetCardBalanceUseCase;

  const card = new CardFactory().generate();
  card.activate("1234");
  const recharge = new RechargeFactory().generate({
    cardId: card._id,
    amount: randNumber({ min: 90 }),
  });
  const payment = new PaymentFactory().generate({
    cardId: card._id,
    amount: randNumber({ min: 1, max: 80 }),
  });

  beforeEach(async () => {
    inMemoryDatabase = new InMemoryDatabase();
    cardRepository = new InMemoryCardRepository(inMemoryDatabase);
    paymentRepository = new InMemoryPaymentRepository(inMemoryDatabase);
    rechargeRepository = new InMemoryRechargeRepository(inMemoryDatabase);

    getBalanceService = new GetBalanceService(paymentRepository, rechargeRepository);
    sut = new GetCardBalanceUseCase(cardRepository, getBalanceService);

    await cardRepository.save(card);
    await rechargeRepository.save(recharge);
    await paymentRepository.save(payment);
  });

  describe("Success", () => {
    it("Should be able to get the balance", async () => {
      const result = await sut.execute({ cardId: card._id });

      expect(result).toBeInstanceOf(Right);
      expect(result.value.getValue()).toHaveProperty("balance");
      expect(result.value.getValue()).toHaveProperty("payments");
      expect(result.value.getValue()).toHaveProperty("recharges");
      expect(result.value.getValue()?.recharges).toHaveLength(1);
      expect(result.value.getValue()?.payments).toHaveLength(1);
      expect(result.value.getValue()?.balance).toEqual(
        recharge.amount.value - payment.amount.value
      );
    });

    it("Should be able to get the balance if the card is virtual", async () => {
      const virtualCard = card.generateVirtualCard().value.getValue()!;
      await cardRepository.save(virtualCard);

      const result = await sut.execute({ cardId: virtualCard._id });

      expect(result).toBeInstanceOf(Right);
      expect(result.value.getValue()).toHaveProperty("balance");
      expect(result.value.getValue()).toHaveProperty("payments");
      expect(result.value.getValue()).toHaveProperty("recharges");
      expect(result.value.getValue()?.recharges).toHaveLength(1);
      expect(result.value.getValue()?.payments).toHaveLength(1);
      expect(result.value.getValue()?.balance).toEqual(
        recharge.amount.value - payment.amount.value
      );
    });

    it("Should be able to get the balance, even if there are no transactions", async () => {
      const mockCard = new CardFactory().generate();
      await cardRepository.save(mockCard);

      const result = await sut.execute({ cardId: mockCard._id });

      expect(result).toBeInstanceOf(Right);
      expect(result.value.getValue()).toHaveProperty("balance");
      expect(result.value.getValue()).toHaveProperty("payments");
      expect(result.value.getValue()).toHaveProperty("recharges");
      expect(result.value.getValue()?.recharges).toHaveLength(0);
      expect(result.value.getValue()?.payments).toHaveLength(0);
      expect(result.value.getValue()?.balance).toEqual(0);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the card does not exist", async () => {
      const result = await sut.execute({ cardId: randUuid() });

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(CardUseCaseErrors.NotFoundError);
      expect(result.value.getError()).toHaveProperty("message", "Card not found");
    });
  });
});
