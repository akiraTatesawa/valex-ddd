import { Entity } from "@core/domain/entity";
import { Result } from "@core/logic/result";
import { Either, left, right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";
import { Guard, GuardResult } from "@core/logic/guard";
import { EmployeeName } from "./employee-name";
import { EmployeeCPF } from "./employee-cpf";
import { EmployeeEmail } from "./employee-email";

interface EmployeeProps {
  fullName: EmployeeName;
  cpf: EmployeeCPF;
  email: EmployeeEmail;
  companyId: string;
  createdAt: Date;
}

export interface CreateEmployeeProps {
  id?: string;
  fullName: string;
  cpf: string;
  email: string;
  companyId: string;
  createdAt?: Date;
}

type EmployeeCreateResult = Either<DomainErrors.InvalidPropsError, Result<Employee, null>>;
type EmployeeValidateResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

export class Employee extends Entity<EmployeeProps> {
  private constructor(props: EmployeeProps, id?: string) {
    super(props, id);
  }

  public get fullName(): EmployeeName {
    return this.props.fullName;
  }

  public get cpf(): EmployeeCPF {
    return this.props.cpf;
  }

  public get email(): EmployeeEmail {
    return this.props.email;
  }

  public get companyId(): string {
    return this.props.companyId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  private static validate({
    id,
    companyId,
    createdAt,
  }: CreateEmployeeProps): EmployeeValidateResult {
    const guardResults: GuardResult[] = [];

    if (id !== undefined) {
      guardResults.push(Guard.againstNonUUID(id, "Employee ID"));
    }
    if (createdAt !== undefined) {
      guardResults.push(Guard.againstNonDate(createdAt, "Employee Created At"));
    }
    guardResults.push(Guard.againstNonUUID(companyId, "Company ID"));

    const combinedResult = Guard.combineResults(guardResults);

    if (!combinedResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(combinedResult.message));
    }

    return right(Result.pass());
  }

  public static create(props: CreateEmployeeProps): EmployeeCreateResult {
    const validationResult = Employee.validate(props);

    if (validationResult.isLeft()) {
      const validationError = validationResult.value;

      return left(validationError);
    }

    const employeeNameOrError = EmployeeName.create(props.fullName);

    if (employeeNameOrError.isLeft()) {
      const employeeNameError = employeeNameOrError.value;

      return left(employeeNameError);
    }

    const employeeCpfOrError = EmployeeCPF.create(props.cpf);

    if (employeeCpfOrError.isLeft()) {
      const employeeCpfError = employeeCpfOrError.value;

      return left(employeeCpfError);
    }

    const employeeEmailOrError = EmployeeEmail.create(props.email);

    if (employeeEmailOrError.isLeft()) {
      const employeeEmailError = employeeEmailOrError.value;

      return left(employeeEmailError);
    }

    const fullName = employeeNameOrError.value.getValue();
    const email = employeeEmailOrError.value.getValue();
    const cpf = employeeCpfOrError.value.getValue();

    const employee = new Employee(
      {
        fullName,
        email,
        cpf,
        companyId: props.companyId,
        createdAt: props.createdAt ?? new Date(),
      },
      props.id
    );

    return right(Result.ok<Employee>(employee));
  }
}
