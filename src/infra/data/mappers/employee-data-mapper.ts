import { Employee } from "@domain/employee/employee";
import { EmployeePersistence } from "../persistence-model/employee-persistence";

export class EmployeeDataMapper {
  public static toDomain(persistence: EmployeePersistence): Employee {
    const employee = Employee.create({ ...persistence });

    return employee.value.getValue()!;
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
