import { Repository } from "@core/app/repository";
import { Employee } from "@modules/employees/domain/employee";

export interface EmployeeRepository extends Repository<Employee> {}
