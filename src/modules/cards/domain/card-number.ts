import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";
import { randCreditCardNumber } from "@ngneat/falso";

interface CardNumberProps {
  value: string;
}

type CreateCardNumberResult = Either<DomainErrors.InvalidPropsError, Result<CardNumber, null>>;

type ValidateCardNumberResult = Either<DomainErrors.InvalidPropsError, Result<string, null>>;

export class CardNumber extends ValueObject<CardNumberProps> {
  private constructor(props: CardNumberProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  private static validate(cardNumber?: string): ValidateCardNumberResult {
    if (cardNumber === undefined) {
      const creditCardNumber = randCreditCardNumber({ brand: "Mastercard" }).replaceAll(" ", "");

      return Result.ok<string>(creditCardNumber);
    }

    const cardNumberRegex = /^[0-9]{16}$/;

    if (!cardNumberRegex.test(cardNumber)) {
      return DomainErrors.InvalidPropsError.create(
        "Card Number must be a 13 to 16 numeric digits string"
      );
    }

    return Result.ok<string>(cardNumber);
  }

  public static create(cardNumber?: string): CreateCardNumberResult {
    const cardNumberOrError = CardNumber.validate(cardNumber);

    if (cardNumberOrError.isFailure && cardNumberOrError.error) {
      return DomainErrors.InvalidPropsError.create(cardNumberOrError.error.message);
    }

    const cardNumberValue = cardNumberOrError.value!;

    const cardNumberEntity = new CardNumber({ value: cardNumberValue });

    return Result.ok<CardNumber>(cardNumberEntity);
  }
}
