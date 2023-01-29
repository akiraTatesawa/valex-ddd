import { VoucherType } from "@shared/domain/voucher-type";
import { Entity } from "@core/domain/entity";
import { Result } from "@core/logic/result";
import { Either, left, right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";
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
      return left(DomainErrors.InvalidPropsError.create("Card is already activated"));
    }

    const passwordResult = CardPassword.create(password);

    if (passwordResult.isLeft()) {
      const passwordError = passwordResult.value;

      return left(passwordError);
    }

    this.props.password = passwordResult.value.getValue();

    return right(Result.pass());
  }

  private static validate(props: CreateCardProps): ValidateCardResult {
    const { type, employeeId } = props;

    const guardResult = Guard.againstNonUUID(employeeId, "Employee ID");
    if (!guardResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(guardResult.message));
    }

    const validTypes = ["education", "groceries", "health", "transport", "restaurant"];
    if (!validTypes.includes(type)) {
      return left(
        DomainErrors.InvalidPropsError.create(
          "Card Type can only assume the values: 'restaurant' | 'health' | 'transport' | 'groceries' | 'education'"
        )
      );
    }

    return right(Result.pass());
  }

  public static create(props: CreateCardProps): CreateCardResult {
    const validationResult = Card.validate(props);

    if (validationResult.isLeft()) {
      const validationError = validationResult.value;

      return left(validationError);
    }

    const { type, employeeId, cardholderName } = props;

    const cardholderNameResult = CardholderName.create(cardholderName, false);
    if (cardholderNameResult.isLeft()) {
      const cardholderNameError = cardholderNameResult.value;

      return left(cardholderNameError);
    }

    const numberResult = CardNumber.create(props.number);
    if (numberResult.isLeft()) {
      const numberError = numberResult.value;

      return left(numberError);
    }

    const securityCodeResult = CardCVV.create(props.securityCode);
    if (securityCodeResult.isLeft()) {
      const securityCodeError = securityCodeResult.value;

      return left(securityCodeError);
    }

    const expirationDateResult = CardExpirationDate.create(props.expirationDate);
    if (expirationDateResult.isLeft()) {
      const expirationDateError = expirationDateResult.value;

      return left(expirationDateError);
    }

    const password = props.password
      ? CardPassword.create(props.password, true).value.getValue()!
      : undefined;

    const isVirtual = props.isVirtual ?? false;
    const originalCardId = props.originalCardId ?? undefined;
    const isBlocked = props.isBlocked ?? false;

    const card = new Card(
      {
        employeeId,
        number: numberResult.value.getValue(),
        cardholderName: cardholderNameResult.value.getValue(),
        securityCode: securityCodeResult.value.getValue(),
        expirationDate: expirationDateResult.value.getValue(),
        password,
        isVirtual,
        originalCardId,
        isBlocked,
        type,
      },
      props.id
    );

    return right(Result.ok<Card>(card));
  }

  public generateVirtualCard(): CreateCardResult {
    if (this.password === undefined) {
      return left(
        DomainErrors.InvalidPropsError.create("Cannot create a Virtual Card from an inactive card")
      );
    }

    if (this.isVirtual) {
      return left(
        DomainErrors.InvalidPropsError.create(
          "Cannot create a Virtual Card from another virtual card"
        )
      );
    }

    const virtualCardOrError = Card.create({
      cardholderName: this.cardholderName.value,
      password: this.password?.value,
      employeeId: this.employeeId,
      type: this.type,
      originalCardId: this._id,
      isVirtual: true,
    });

    if (virtualCardOrError.isLeft()) {
      return left(virtualCardOrError.value);
    }

    const virtualCard = virtualCardOrError.value.getValue();

    return right(Result.ok<Card>(virtualCard));
  }
}
