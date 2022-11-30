import { ValueObject } from "@core/domain/value-object";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { Either } from "@core/logic/either";
import { Guard } from "@core/logic/guard";

interface EmployeeNameProps {
  value: string;
}

type EmployeeNameCreateResult = Either<DomainErrors.InvalidPropsError, Result<EmployeeName, null>>;
type EmployeeNameValidationResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

export class EmployeeName extends ValueObject<EmployeeNameProps> {
  private constructor(props: EmployeeNameProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  private static validate(name: string): EmployeeNameValidationResult {
    const guardResult = Guard.againstNullOrUndefined(name, "Employee Name");

    if (!guardResult.succeeded) {
      return DomainErrors.InvalidPropsError.create(guardResult.message);
    }

    if (name.length > 30) {
      return DomainErrors.InvalidPropsError.create(
        "Employee Name cannot be longer than 30 characters"
      );
    }

    const nameRegex = /^[\p{L}\s]+$/gu;

    if (!nameRegex.test(name)) {
      return DomainErrors.InvalidPropsError.create("Employee Name must consist of only letters");
    }

    return Result.pass();
  }

  public static create(name: string): EmployeeNameCreateResult {
    const isValidOrError = EmployeeName.validate(name);

    if (isValidOrError.isFailure && isValidOrError.error) {
      return isValidOrError;
    }

    const employeeName = new EmployeeName({ value: name });

    return Result.ok<EmployeeName>(employeeName);
  }
}
