import {
  EmployeeFindUniqueArgs,
  EmployeeRepository,
} from "@app/ports/repositories/employee-repository";
import { Employee } from "@domain/employee/employee";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { EmployeeDataMapper } from "@infra/data/mappers/employee-data-mapper";

export class InMemoryEmployeeRepository implements EmployeeRepository {
  private readonly database: InMemoryDatabase;

  constructor(database: InMemoryDatabase) {
    this.database = database;
  }

  public async save(data: Employee): Promise<void> {
    const rawEmployee = EmployeeDataMapper.toPersistence(data);

    this.database.employees.push(rawEmployee);
  }

  public async findUnique({ id, cpf, email }: EmployeeFindUniqueArgs): Promise<Employee | null> {
    const rawEmployee = this.database.employees.find(
      (employee) => employee.id === id || employee.cpf === cpf || employee.email === email
    );

    if (!rawEmployee) return null;

    return EmployeeDataMapper.toDomain(rawEmployee);
  }
}
