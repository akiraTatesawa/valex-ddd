import { DomainErrors } from "@domain/errors/domain-error";
import { ValueObject } from "@core/domain/value-object";
import { Either, right, left } from "@core/logic/either";
import { Guard } from "@core/logic/guard";
import { Result } from "@core/logic/result";

interface AmountProps {
  value: number;
}

type AmountCreate = Either<DomainErrors.InvalidPropsError, Result<Amount, null>>;

export class Amount extends ValueObject<AmountProps> {
  private constructor(props: AmountProps) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(amount: number): AmountCreate {
    const guardResult = Guard.againstNonInteger(amount, "Amount");

    if (!guardResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(guardResult.message));
    }

    if (amount <= 0) {
      const lowerThanZeroErrorMessage = "Amount must greater than zero";

      return left(DomainErrors.InvalidPropsError.create(lowerThanZeroErrorMessage));
    }

    const rechargeAmount = new Amount({ value: amount });

    return right(Result.ok<Amount>(rechargeAmount));
  }
}
