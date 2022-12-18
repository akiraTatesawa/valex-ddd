import bcrypt from "bcrypt";
import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either, left, right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";

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
      return left(
        DomainErrors.InvalidPropsError.create("Card Password must be a 4 numeric digits string")
      );
    }

    return right(Result.pass());
  }

  public static create(password: string, isHashed: boolean = false): CreateCardPasswordResult {
    const validationResult = CardPassword.validate(password);

    if (validationResult.isLeft() && !isHashed) {
      const validationError = validationResult.value;

      return left(validationError);
    }

    let hashedPassword: string = password;

    if (!isHashed) {
      hashedPassword = CardPassword.encrypt(password);
    }

    const cardPassword = new CardPassword({ value: hashedPassword });

    return right(Result.ok<CardPassword>(cardPassword));
  }
}
