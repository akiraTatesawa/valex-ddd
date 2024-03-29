import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either, left, right } from "@core/logic/either";
import { Guard } from "@core/logic/guard";
import { DomainErrors } from "@domain/errors/domain-error";

interface CardExpirationDateProps {
  value: string;
  timestamp: Date;
}

type CreateExpirationDateResult = Either<
  DomainErrors.InvalidPropsError,
  Result<CardExpirationDate, null>
>;

type ValidateExpirationDateResult = Either<DomainErrors.InvalidPropsError, Result<string, null>>;

export class CardExpirationDate extends ValueObject<CardExpirationDateProps> {
  private constructor(props: CardExpirationDateProps) {
    super(props);
  }

  public getStringExpirationDate(): string {
    return this.props.value;
  }

  public getDate(): Date {
    return this.props.timestamp;
  }

  public isExpired(): boolean {
    return new Date() > this.props.timestamp;
  }

  private static validate(expirationDate: Date): ValidateExpirationDateResult {
    const guardResult = Guard.againstNonDate(expirationDate, "Card Expiration Date");

    if (!guardResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(guardResult.message));
    }

    const expirationMonthNumber = expirationDate.getMonth() + 1;
    let expirationMonthFormatted: string;

    if (expirationMonthNumber < 10) {
      expirationMonthFormatted = `0${expirationMonthNumber}`;
    } else {
      expirationMonthFormatted = `${expirationMonthNumber}`;
    }

    const expirationYear = `${expirationDate.getFullYear()}`.slice(2);

    const expirationDateString = `${expirationMonthFormatted}/${expirationYear}`;

    return right(Result.ok<string>(expirationDateString));
  }

  public static create(expirationDate?: Date): CreateExpirationDateResult {
    let expirationDateTimestamp: Date;

    if (expirationDate === undefined) {
      expirationDateTimestamp = new Date();

      expirationDateTimestamp.setFullYear(new Date().getFullYear() + 5);
    } else {
      expirationDateTimestamp = expirationDate;
    }

    const validationResult = CardExpirationDate.validate(expirationDateTimestamp);

    if (validationResult.isLeft()) {
      const expirationDateError = validationResult.value;

      return left(expirationDateError);
    }

    const expirationDateString = validationResult.value.getValue();

    const expirationDateEntity = new CardExpirationDate({
      value: expirationDateString,
      timestamp: expirationDateTimestamp,
    });

    return right(Result.ok<CardExpirationDate>(expirationDateEntity));
  }

  public static createFromString(expirationDate: string): CreateExpirationDateResult {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;

    if (!regex.test(expirationDate)) {
      return left(DomainErrors.InvalidPropsError.create("Invalid Card Expiration Date format"));
    }

    const month = parseInt(expirationDate.slice(0, 2), 10) - 1;
    const year = parseInt(`20${expirationDate.slice(3)}`, 10);
    const day = month === 1 ? 28 : 30;

    const date = new Date(year, month, day);

    const cardExpirationDate = new CardExpirationDate({
      value: expirationDate,
      timestamp: date,
    });

    return right(Result.ok<CardExpirationDate>(cardExpirationDate));
  }
}
