import { Repository } from "@core/app/repository";
import { Employee } from "@shared/modules/employees/domain/employee";

export interface EmployeeFindUniqueArgs {
  id?: string;
  cpf?: string;
  email?: string;
}

export interface EmployeeRepository extends Repository<Employee> {
  findUnique(args: EmployeeFindUniqueArgs): Promise<Employee | null>;
}
