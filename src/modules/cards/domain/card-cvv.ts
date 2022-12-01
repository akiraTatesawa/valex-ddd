import "dotenv/config";
import { randCreditCardCVV } from "@ngneat/falso";

import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";
import Cryptr from "cryptr";

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

      return Result.ok<string>(encryptedCVV);
    }

    try {
      const decryptedPassword = CardCVV._cryptr.decrypt(cvv);

      const cvvRegex = /^[0-9]{3}$/;

      if (!cvvRegex.test(decryptedPassword)) {
        return DomainErrors.InvalidPropsError.create("Card CVV must be a 3 digits numeric string");
      }
    } catch (err) {
      return DomainErrors.InvalidPropsError.create("Invalid CVV encryption");
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
