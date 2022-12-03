import { VoucherType } from "@shared/domain/voucher-type";
import { Entity } from "@core/domain/entity";
import { Result } from "@core/logic/result";
import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";
import { Guard } from "@core/logic/guard";
import { CardholderName } from "./cardholder-name";
import { CardNumber } from "./card-number";
import { CardCVV } from "./card-cvv";
import { CardExpirationDate } from "./card-expiration-date";
import { CardPassword } from "./card-password";

interface CardProps {
  employeeId: string;
  number: CardNumber;
  cardholderName: CardholderName;
  securityCode: CardCVV;
  expirationDate: CardExpirationDate;
  password?: CardPassword | undefined;
  isVirtual: boolean;
  originalCardId?: string | undefined;
  isBlocked: boolean;
  type: VoucherType;
}

export interface CreateCardProps {
  id?: string;
  employeeId: string;
  cardholderName: string;
  type: VoucherType;
  number?: string;
  securityCode?: string;
  expirationDate?: Date;
  password?: string | undefined;
  isVirtual?: boolean;
  originalCardId?: string | undefined;
  isBlocked?: boolean;
}

type CreateCardResult = Either<DomainErrors.InvalidPropsError, Result<Card, null>>;

type ValidateCardResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

type ActivateCardResult = ValidateCardResult;

export class Card extends Entity<CardProps> {
  private constructor(props: CardProps, id?: string) {
    super(props, id);
  }

  public get employeeId(): string {
    return this.props.employeeId;
  }

  public get number(): CardNumber {
    return this.props.number;
  }

  public get cardholderName(): CardholderName {
    return this.props.cardholderName;
  }

  public get securityCode(): CardCVV {
    return this.props.securityCode;
  }

  public get expirationDate(): CardExpirationDate {
    return this.props.expirationDate;
  }

  public get password(): CardPassword | undefined {
    return this.props.password;
  }

  public get isVirtual(): boolean {
    return this.props.isVirtual;
  }

  public get originalCardId(): string | undefined {
    return this.props.originalCardId;
  }

  public get isBlocked(): boolean {
    return this.props.isBlocked;
  }

  public get type(): VoucherType {
    return this.props.type;
  }

  public block(): void {
    this.props.isBlocked = true;
  }

  public unblock(): void {
    this.props.isBlocked = false;
  }

  public get isActive(): boolean {
    if (this.props.password) {
      return true;
    }
    return false;
  }

  public activate(password: string): ActivateCardResult {
    if (this.props.password !== undefined) {
      return DomainErrors.InvalidPropsError.create("Card is already activated");
    }

    const passwordOrError = CardPassword.create(password);

    if (passwordOrError.error) {
      const { error } = passwordOrError;
      return DomainErrors.InvalidPropsError.create(error.message);
    }

    this.props.password = passwordOrError.value;

    return Result.pass();
  }

  private static validate(props: CreateCardProps): ValidateCardResult {
    const { type, employeeId } = props;

    const guardResult = Guard.againstNonUUID(employeeId, "Employee ID");
    if (!guardResult.succeeded) {
      return DomainErrors.InvalidPropsError.create(guardResult.message);
    }

    const validTypes = ["education", "groceries", "health", "transport", "restaurant"];
    if (!validTypes.includes(type)) {
      return DomainErrors.InvalidPropsError.create(
        "Card Type can only assume the values: 'restaurant' | 'health' | 'transport' | 'groceries' | 'education'"
      );
    }

    return Result.pass();
  }

  public static create(props: CreateCardProps): CreateCardResult {
    const validation = Card.validate(props);

    if (validation.error && validation.isFailure) {
      return DomainErrors.InvalidPropsError.create(validation.error.message);
    }

    const { type, employeeId, cardholderName } = props;

    const cardholderNameOrError = CardholderName.create(cardholderName, false);
    const numberOrError = CardNumber.create(props.number);
    const securityCodeOrError = CardCVV.create(props.securityCode);
    const expirationDateOrError = CardExpirationDate.create(props.expirationDate);

    const combinedResult = Result.combine([
      cardholderNameOrError,
      numberOrError,
      securityCodeOrError,
      expirationDateOrError,
    ]);

    if (combinedResult.error && combinedResult.isFailure) {
      const { error } = combinedResult;
      return DomainErrors.InvalidPropsError.create(error.message);
    }

    const password = props.password ? CardPassword.create(props.password, true).value! : undefined;
    const isVirtual = props.isVirtual ?? false;
    const originalCardId = props.originalCardId ?? undefined;
    const isBlocked = props.isBlocked ?? false;

    const card = new Card(
      {
        employeeId,
        number: numberOrError.value!,
        cardholderName: cardholderNameOrError.value!,
        securityCode: securityCodeOrError.value!,
        expirationDate: expirationDateOrError.value!,
        password,
        isVirtual,
        originalCardId,
        isBlocked,
        type,
      },
      props.id
    );

    return Result.ok<Card>(card);
  }
}
