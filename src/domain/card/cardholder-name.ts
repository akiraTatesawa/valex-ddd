import { ValueObject } from "@core/domain/value-object";
import { Either, left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";
import { Guard } from "@core/logic/guard";

interface CardholderNameProps {
  value: string;
}

type CreateCardholderNameResult = Either<
  DomainErrors.InvalidPropsError,
  Result<CardholderName, null>
>;

type ValidateCardholderNameResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

export class CardholderName extends ValueObject<CardholderNameProps> {
  private constructor(props: CardholderNameProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  private static formatName(cardholderName: string): string {
    const separatedNames = cardholderName.split(" ");

    const formattedNameArray: string[] = [];

    separatedNames.forEach((name, index) => {
      const upperCaseName = name.toUpperCase();

      if (index === 0 || index === separatedNames.length - 1) {
        formattedNameArray.push(upperCaseName);
        return;
      }

      if (name.length < 3) return;

      formattedNameArray.push(upperCaseName.charAt(0));
    });

    return formattedNameArray.join(" ");
  }

  private static validate(cardholderName: string): ValidateCardholderNameResult {
    const guardResult = Guard.againstNullOrUndefined(cardholderName, "Cardholder Name");

    if (!guardResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(guardResult.message));
    }

    const nameRegex = /^[\p{L}\s-]+$/gu;

    if (!nameRegex.test(cardholderName)) {
      return left(
        DomainErrors.InvalidPropsError.create("Cardholder Name must consist of only letters")
      );
    }

    return right(Result.pass());
  }

  public static create(
    cardholderName: string,
    isFormatted: boolean = false
  ): CreateCardholderNameResult {
    const validationResult = CardholderName.validate(cardholderName);

    if (validationResult.isLeft()) {
      const validationError = validationResult.value;

      return left(validationError);
    }

    let formattedName: string = cardholderName;

    if (!isFormatted) {
      formattedName = CardholderName.formatName(cardholderName);
    }

    const cardholderNameEntity = new CardholderName({ value: formattedName });

    return right(Result.ok<CardholderName>(cardholderNameEntity));
  }
}
