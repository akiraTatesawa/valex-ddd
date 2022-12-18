import { DomainErrors } from "@domain/errors/domain-error";
import { ValueObject } from "@core/domain/value-object";
import { Either, right, left } from "@core/logic/either";
import { Guard } from "@core/logic/guard";
import { Result } from "@core/logic/result";

interface RechargeAmountProps {
  value: number;
}

type RechargeAmountCreate = Either<DomainErrors.InvalidPropsError, Result<RechargeAmount, null>>;

export class RechargeAmount extends ValueObject<RechargeAmountProps> {
  private constructor(props: RechargeAmountProps) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(amount: number): RechargeAmountCreate {
    const guardResult = Guard.againstNonInteger(amount, "Recharge Amount");

    if (!guardResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(guardResult.message));
    }

    if (amount <= 0) {
      const lowerThanZeroErrorMessage = "Recharge Amount must greater than zero";

      return left(DomainErrors.InvalidPropsError.create(lowerThanZeroErrorMessage));
    }

    const rechargeAmount = new RechargeAmount({ value: amount });

    return right(Result.ok<RechargeAmount>(rechargeAmount));
  }
}
