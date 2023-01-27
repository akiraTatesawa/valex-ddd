import { randUuid, randNumber } from "@ngneat/falso";

import { Factory } from "@core/app/factory";
import { CreateRechargeProps, Recharge } from "@domain/recharge/recharge";

type RechargeGenerateProps = Partial<CreateRechargeProps>;

export class RechargeFactory extends Factory<Recharge> {
  public generate({ ...props }: RechargeGenerateProps = {}): Recharge {
    const rechargeOrError = Recharge.create({
      cardId: randUuid(),
      amount: randNumber({ min: 1 }),
      ...props,
    });

    return rechargeOrError.value.getValue()!;
  }
}
