import bcrypt from "bcrypt";
import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";

interface CardPasswordProps {
  value: string;
}

type CreateCardPasswordResult = Either<DomainErrors.InvalidPropsError, Result<CardPassword, null>>;

type ValidateCardPasswordResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

export class CardPassword extends ValueObject<CardPasswordProps> {
  private constructor(props: CardPasswordProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public compare(value: string): boolean {
    return bcrypt.compareSync(value, this.props.value);
  }

  private static encrypt(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private static validate(password: string): ValidateCardPasswordResult {
    const passwordRegex = /^[0-9]{4}$/;

    if (!passwordRegex.test(password)) {
      return DomainErrors.InvalidPropsError.create(
        "Card Password must be a 4 numeric digits string"
      );
    }

    return Result.pass();
  }

  public static create(password: string, isHashed: boolean = false): CreateCardPasswordResult {
    const validation = CardPassword.validate(password);

    if (validation.error && validation.isFailure && !isHashed) {
      return DomainErrors.InvalidPropsError.create(validation.error.message);
    }

    let hashedPassword: string = password;

    if (!isHashed) {
      hashedPassword = CardPassword.encrypt(password);
    }

    const cardPassword = new CardPassword({ value: hashedPassword });

    return Result.ok<CardPassword>(cardPassword);
  }
}
