import { randUuid, randNumber } from "@ngneat/falso";
import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { Payment } from "@domain/payment/payment";
import { Recharge } from "@domain/recharge/recharge";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryPaymentRepository } from "@infra/data/repositories/in-memory/in-memory-payment-repository";
import { InMemoryRechargeRepository } from "@infra/data/repositories/in-memory/in-memory-recharge-repository";
import { RechargeFactory } from "@tests/factories/recharge-factory";
import { PaymentFactory } from "@tests/factories/payment-factory";
import { GetBalanceService } from "./get-balance.service";

describe("Get Balance Service", () => {
  let rechargeRepository: RechargeRepository;
  let paymentRepository: PaymentRepository;

  let sut: GetBalanceService;

  let cardId: string;
  let rechargeAmount: number;
  let paymentAmount: number;
  let recharge: Recharge;
  let payment: Payment;

  beforeEach(async () => {
    const inMemoryDatabase = new InMemoryDatabase();
    rechargeRepository = new InMemoryRechargeRepository(inMemoryDatabase);
    paymentRepository = new InMemoryPaymentRepository(inMemoryDatabase);

    sut = new GetBalanceService(paymentRepository, rechargeRepository);

    cardId = randUuid();
    rechargeAmount = randNumber({ min: 90 });
    paymentAmount = randNumber({ min: 1, max: 89 });
    recharge = new RechargeFactory().generate({ cardId, amount: rechargeAmount });
    payment = new PaymentFactory().generate({ cardId, amount: paymentAmount });

    await rechargeRepository.save(recharge);
    await paymentRepository.save(payment);
  });

  it("Should be able to get the balance", async () => {
    const result = await sut.getBalance(cardId);

    expect(result.balance).toEqual(rechargeAmount - paymentAmount);
    expect(result.payments).toHaveLength(1);
    expect(result.recharges).toHaveLength(1);
  });

  it("Should be able to get the balance even if there are no transactions", async () => {
    const result = await sut.getBalance(randUuid());

    expect(result.balance).toEqual(0);
    expect(result.payments).toHaveLength(0);
    expect(result.recharges).toHaveLength(0);
  });
});
