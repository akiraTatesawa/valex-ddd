import { Employee } from "../domain/employee";
import { EmployeePersistence } from "../infra/database/employee-persistence.interface";

export class EmployeeMapper {
  public static toDomain(persistence: EmployeePersistence): Employee {
    const employee = Employee.create({ ...persistence }).value!;

    return employee;
  }

  public static toPersistence(domain: Employee): EmployeePersistence {
    return {
      id: domain._id,
      fullName: domain.fullName.value,
      cpf: domain.cpf.value,
      email: domain.email.value,
      companyId: domain.companyId,
      createdAt: domain.createdAt,
    };
  }
}
