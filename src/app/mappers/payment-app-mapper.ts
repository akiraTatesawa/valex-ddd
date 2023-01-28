import { PaymentDTO } from "@app/dtos/payment.dto";
import { Payment } from "@domain/payment/payment";

export class PaymentAppMapper {
  public static toDTO(domain: Payment): PaymentDTO {
    return {
      id: domain._id,
      amount: domain.amount.value,
      businessId: domain.businessId,
      cardId: domain.cardId,
      timestamp: domain.createdAt,
    };
  }

  public static bulkToDTO(domainArray: Payment[]): PaymentDTO[] {
    return domainArray.map((domain) => PaymentAppMapper.toDTO(domain));
  }
}
