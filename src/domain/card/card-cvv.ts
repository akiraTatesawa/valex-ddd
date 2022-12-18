import "dotenv/config";
import { randCreditCardCVV } from "@ngneat/falso";
import Cryptr from "cryptr";

import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either, left, right } from "@core/logic/either";

import { DomainErrors } from "@domain/errors/domain-error";

interface CardCVVProps {
  value: string;
}

type CreateCardCVVResult = Either<DomainErrors.InvalidPropsError, Result<CardCVV, null>>;

type ValidateCardCVVResult = Either<DomainErrors.InvalidPropsError, Result<string, null>>;

export class CardCVV extends ValueObject<CardCVVProps> {
  private static _cryptr: Cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

  private constructor(props: CardCVVProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public compare(value: string): boolean {
    const decryptedCVV = CardCVV._cryptr.decrypt(this.props.value);

    return decryptedCVV === value;
  }

  public decrypt(): string {
    return CardCVV._cryptr.decrypt(this.props.value);
  }

  private static encrypt(cvv: string): string {
    return CardCVV._cryptr.encrypt(cvv);
  }

  private static validate(cvv?: string): ValidateCardCVVResult {
    if (cvv === undefined) {
      const encryptedCVV = CardCVV.encrypt(randCreditCardCVV());

      return right(Result.ok<string>(encryptedCVV));
    }

    try {
      const decryptedPassword = CardCVV._cryptr.decrypt(cvv);

      const cvvRegex = /^[0-9]{3}$/;

      if (!cvvRegex.test(decryptedPassword)) {
        return left(
          DomainErrors.InvalidPropsError.create("Card CVV must be a 3 digits numeric string")
        );
      }
    } catch (err) {
      return left(DomainErrors.InvalidPropsError.create("Invalid CVV encryption"));
    }

    return right(Result.ok<string>(cvv));
  }

  public static create(cvv?: string): CreateCardCVVResult {
    const cvvValidationResult = CardCVV.validate(cvv);

    if (cvvValidationResult.isLeft()) {
      const cvvError = cvvValidationResult.value;

      return left(cvvError);
    }

    const cvvValue = cvvValidationResult.value.getValue();
    const cardCVVEntity = new CardCVV({ value: cvvValue });

    return right(Result.ok<CardCVV>(cardCVVEntity));
  }
}
