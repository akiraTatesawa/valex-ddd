import { Recharge } from "@domain/recharge/recharge";
import { RechargePersistence } from "../persistence-model/recharge-persistence";

export class RechargeDataMapper {
  public static toPersistence(domain: Recharge): RechargePersistence {
    return {
      id: domain._id,
      amount: domain.amount.value,
      cardId: domain.cardId,
      createdAt: domain.createdAt,
    };
  }
}
