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

  public static toDomain(persistence: RechargePersistence): Recharge {
    const recharge = Recharge.create({
      id: persistence.id,
      amount: persistence.amount,
      cardId: persistence.cardId,
      createdAt: persistence.createdAt,
    });

    return recharge.value.getValue()!;
  }

  public static bulkToDomain(persistenceArray: RechargePersistence[]): Recharge[] {
    return persistenceArray.map((persistence) => RechargeDataMapper.toDomain(persistence));
  }
}
