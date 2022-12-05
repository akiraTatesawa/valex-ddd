import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { Either, left, right } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";
import { Guard } from "@core/logic/guard";

interface EmployeeEmailProps {
  value: string;
}

type EmployeeEmailCreateResult = Either<
  DomainErrors.InvalidPropsError,
  Result<EmployeeEmail, null>
>;

type EmployeeEmailValidateResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

export class EmployeeEmail extends ValueObject<EmployeeEmailProps> {
  private constructor(props: EmployeeEmailProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  private static validate(email: string): EmployeeEmailValidateResult {
    const guardResult = Guard.againstNullOrUndefined(email, "Employee Email");

    if (!guardResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(guardResult.message));
    }

    const emailRegex =
      /[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!emailRegex.test(email)) {
      return left(DomainErrors.InvalidPropsError.create("Employee Email must be a valid email"));
    }

    return right(Result.pass());
  }

  public static create(email: string): EmployeeEmailCreateResult {
    const validationResult = EmployeeEmail.validate(email);

    if (validationResult.isLeft()) {
      const validationError = validationResult.value;

      return left(validationError);
    }

    const employeeEmail = new EmployeeEmail({ value: email });

    return right(Result.ok<EmployeeEmail>(employeeEmail));
  }
}
