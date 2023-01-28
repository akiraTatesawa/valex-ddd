import { Payment } from "@domain/payment/payment";
import { PaymentPersistence } from "../persistence-model/payment-persistence";

export class PaymentDataMapper {
  public static toPersistence(domain: Payment): PaymentPersistence {
    return {
      id: domain._id,
      amount: domain.amount.value,
      cardId: domain.cardId,
      businessId: domain.businessId,
      createdAt: domain.createdAt,
    };
  }

  public static toDomain(persistence: PaymentPersistence): Payment {
    const paymentOrError = Payment.create({
      id: persistence.id,
      amount: persistence.amount,
      businessId: persistence.businessId,
      cardId: persistence.cardId,
      createdAt: persistence.createdAt,
    });

    return paymentOrError.value.getValue()!;
  }

  public static bulkToDomain(persistenceArray: PaymentPersistence[]): Payment[] {
    return persistenceArray.map((persistence) => PaymentDataMapper.toDomain(persistence));
  }
}
