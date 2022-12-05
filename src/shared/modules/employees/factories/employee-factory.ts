import { randEmail, randUuid, randWord } from "@ngneat/falso";
import { Factory } from "@core/app/factory";
import { CreateEmployeeProps, Employee } from "../domain/employee";

type EmployeeFactoryGenerateProps = Partial<CreateEmployeeProps>;

export class EmployeeFactory extends Factory<Employee> {
  public generate({ ...props }: EmployeeFactoryGenerateProps = {}): Employee {
    const employeeOrError = Employee.create({
      fullName: randWord(),
      email: randEmail(),
      cpf: "12345678901",
      companyId: randUuid(),
      ...props,
    });

    return employeeOrError.value.getValue()!;
  }
}
