import { RechargeDTO } from "@app/dtos/recharge.dto";
import { Recharge } from "@domain/recharge/recharge";

export class RechargeAppMapper {
  public static toDTO(domain: Recharge): RechargeDTO {
    return {
      id: domain._id,
      amount: domain.amount.value,
      cardId: domain.cardId,
      timestamp: domain.createdAt,
    };
  }
}
