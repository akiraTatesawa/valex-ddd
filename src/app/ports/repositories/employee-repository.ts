import { Repository } from "@core/app/repository";
import { Employee } from "@domain/employee/employee";

export interface EmployeeFindUniqueArgs {
  id?: string;
  cpf?: string;
  email?: string;
}

export interface EmployeeRepository extends Repository<Employee> {
  findUnique(args: EmployeeFindUniqueArgs): Promise<Employee | null>;
}
