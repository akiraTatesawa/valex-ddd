import { EmployeeRepository } from "@modules/employees/app/ports/employee-repository";
import { Employee } from "@modules/employees/domain/employee";
import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";
import { EmployeeMapper } from "@modules/employees/mapper/employee-mapper";

export class InMemoryEmployeeRepository implements EmployeeRepository {
  private readonly database: InMemoryDatabase;

  constructor(database: InMemoryDatabase) {
    this.database = database;
  }

  public async save(data: Employee): Promise<void> {
    const rawEmployee = EmployeeMapper.toPersistence(data);

    this.database.employees.push(rawEmployee);
  }
}
