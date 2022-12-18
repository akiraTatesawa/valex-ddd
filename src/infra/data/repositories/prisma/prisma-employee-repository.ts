import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import {
  EmployeeFindUniqueArgs,
  EmployeeRepository,
} from "@app/ports/repositories/employee-repository";
import { Employee } from "@domain/employee/employee";
import { EmployeeMapper } from "@shared/modules/employees/mapper/employee-mapper";

export class PrismaEmployeeRepository implements EmployeeRepository {
  private readonly prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this.prisma = prisma;
  }

  public async save(data: Employee): Promise<void> {
    const rawEmployee = EmployeeMapper.toPersistence(data);

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

    return EmployeeMapper.toDomain(rawEmployee);
  }
}
