import { randCreditCardCVV } from "@ngneat/falso";
import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";

interface CardCVVProps {
  value: string;
}

type CreateCardCVVResult = Either<DomainErrors.InvalidPropsError, Result<CardCVV, null>>;

type ValidateCardCVVResult = Either<DomainErrors.InvalidPropsError, Result<string, null>>;

export class CardCVV extends ValueObject<CardCVVProps> {
  private constructor(props: CardCVVProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  private static validate(cvv?: string): ValidateCardCVVResult {
    if (cvv === undefined) {
      // When the CVV is not provided => generate random CVV
      return Result.ok<string>(randCreditCardCVV());
    }

    const cvvRegex = /^[0-9]{3}$/;

    if (!cvvRegex.test(cvv)) {
      return DomainErrors.InvalidPropsError.create("Card CVV must be a 3 digits numeric string");
    }

    return Result.ok<string>(cvv);
  }

  public static create(cvv?: string): CreateCardCVVResult {
    const cvvOrError = CardCVV.validate(cvv);

    if (cvvOrError.isFailure && cvvOrError.error) {
      return DomainErrors.InvalidPropsError.create(cvvOrError.error.message);
    }

    const cvvValue = cvvOrError.value!;

    const cardCVVEntity = new CardCVV({ value: cvvValue });

    return Result.ok<CardCVV>(cardCVVEntity);
  }
}
