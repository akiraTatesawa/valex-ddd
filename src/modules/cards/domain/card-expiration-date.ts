import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";
import { Guard } from "@core/logic/guard";

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

  public getValue(): string {
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
      return DomainErrors.InvalidPropsError.create(guardResult.message);
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

    return Result.ok<string>(expirationDateString);
  }

  public static create(expirationDate?: Date): CreateExpirationDateResult {
    let expirationDateTimestamp: Date;

    if (expirationDate === undefined) {
      expirationDateTimestamp = new Date();

      expirationDateTimestamp.setFullYear(new Date().getFullYear() + 5);
    } else {
      expirationDateTimestamp = expirationDate;
    }

    const expirationDateStringOrError = CardExpirationDate.validate(expirationDateTimestamp);

    if (expirationDateStringOrError.error) {
      const { error } = expirationDateStringOrError;

      return DomainErrors.InvalidPropsError.create(error.message);
    }

    const expirationDateString = expirationDateStringOrError.value;

    const expirationDateEntity = new CardExpirationDate({
      value: expirationDateString,
      timestamp: expirationDateTimestamp,
    });

    return Result.ok<CardExpirationDate>(expirationDateEntity);
  }
}
