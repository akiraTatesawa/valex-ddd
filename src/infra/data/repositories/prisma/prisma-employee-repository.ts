import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import {
  EmployeeFindUniqueArgs,
  EmployeeRepository,
} from "@app/ports/repositories/employee-repository";
import { Employee } from "@domain/employee/employee";
import { EmployeeDataMapper } from "@infra/data/mappers/employee-data-mapper";

export class PrismaEmployeeRepository implements EmployeeRepository {
  private readonly prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this.prisma = prisma;
  }

  public async save(data: Employee): Promise<void> {
    const rawEmployee = EmployeeDataMapper.toPersistence(data);

    await this.prisma.employee.create({
      data: rawEmployee,
    });
  }

  public async findUnique({ id, cpf, email }: EmployeeFindUniqueArgs): Promise<Employee | null> {
    const rawEmployee = await this.prisma.employee.findUnique({
      where: {
        id,
        cpf,
        email,
      },
    });

    if (!rawEmployee) return null;

    return EmployeeDataMapper.toDomain(rawEmployee);
  }
}
