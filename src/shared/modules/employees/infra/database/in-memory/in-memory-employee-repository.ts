import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";
import { EmployeeFindUniqueArgs, EmployeeRepository } from "@shared/modules/employees/app/ports/employee-repository";
import { Employee } from '@shared/modules/employees/domain/employee';
import { EmployeeMapper } from "@shared/modules/employees/mapper/employee-mapper";


export class InMemoryEmployeeRepository implements EmployeeRepository {
  private readonly database: InMemoryDatabase;

  constructor(database: InMemoryDatabase) {
    this.database = database;
  }

  public async save(data: Employee): Promise<void> {
    const rawEmployee = EmployeeMapper.toPersistence(data);

    this.database.employees.push(rawEmployee);
  }

  public async findUnique({ id, cpf, email }: EmployeeFindUniqueArgs): Promise<Employee | null> {
    const rawEmployee = this.database.employees.find(
      (employee) => employee.id === id || employee.cpf === cpf || employee.email === email
    );

    if (!rawEmployee) return null;

    return EmployeeMapper.toDomain(rawEmployee);
  }
}