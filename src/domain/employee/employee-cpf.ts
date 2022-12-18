import { ValueObject } from "@core/domain/value-object";
import { Either, left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";

interface EmployeeCpfProps {
  value: string;
}

type EmployeeCPFCreateResult = Either<DomainErrors.InvalidPropsError, Result<EmployeeCPF, null>>;
type EmployeeCPFValidationResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

export class EmployeeCPF extends ValueObject<EmployeeCpfProps> {
  private constructor(props: EmployeeCpfProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  private static validate(cpf: string): EmployeeCPFValidationResult {
    const cpfRegex = /^[0-9]{11}$/;

    if (!cpfRegex.test(cpf)) {
      return left(
        DomainErrors.InvalidPropsError.create(
          "Employee CPF must be an eleven numeric digits string"
        )
      );
    }

    return right(Result.pass());
  }

  public static create(cpf: string): EmployeeCPFCreateResult {
    const validationResult = EmployeeCPF.validate(cpf);

    if (validationResult.isLeft()) {
      const error = validationResult.value;

      return left(error);
    }

    const employeeCpf = new EmployeeCPF({ value: cpf });

    return right(Result.ok<EmployeeCPF>(employeeCpf));
  }
}
