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
}
