import { Entity } from "@core/domain/entity";
import { Result } from "@core/logic/result";
import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";
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
      return DomainErrors.InvalidPropsError.create(combinedResult.message);
    }

    return Result.pass();
  }

  public static create(props: CreateEmployeeProps): EmployeeCreateResult {
    const validationOrError = Employee.validate(props);

    if (validationOrError.isFailure && validationOrError.error) {
      const { error } = validationOrError;

      return DomainErrors.InvalidPropsError.create(error.message);
    }

    const employeeNameOrError = EmployeeName.create(props.fullName);
    const employeeCpfOrError = EmployeeCPF.create(props.cpf);
    const employeeEmailOrError = EmployeeEmail.create(props.email);

    const combinedResult = Result.combine([
      employeeNameOrError,
      employeeEmailOrError,
      employeeCpfOrError,
    ]);

    if (combinedResult.isFailure && combinedResult.error) {
      return DomainErrors.InvalidPropsError.create(combinedResult.error.message);
    }

    const fullName = employeeNameOrError.value!;
    const email = employeeEmailOrError.value!;
    const cpf = employeeCpfOrError.value!;

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

    return Result.ok<Employee>(employee);
  }
}
