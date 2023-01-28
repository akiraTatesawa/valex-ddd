import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { Payment } from "@domain/payment/payment";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { PaymentDataMapper } from "@infra/data/mappers/payment-data-mapper";

export class InMemoryPaymentRepository implements PaymentRepository {
  private readonly database: InMemoryDatabase;

  constructor(database: InMemoryDatabase) {
    this.database = database;
  }

  public async save(paymentData: Payment): Promise<void> {
    const rawPayment = PaymentDataMapper.toPersistence(paymentData);

    this.database.payments.push(rawPayment);
  }

  public async findAll(cardId: string): Promise<Payment[]> {
    const rawPayments = this.database.payments.filter((raw) => raw.cardId === cardId);

    return PaymentDataMapper.bulkToDomain(rawPayments);
  }
}
