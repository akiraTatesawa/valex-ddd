import { Company } from "@domain/company/company";
import { Employee } from "@domain/employee/employee";
import { CompanyDataMapper } from "@infra/data/mappers/company-data-mapper";
import { EmployeeDataMapper } from "@infra/data/mappers/employee-data-mapper";
import { PrismaClient } from "@prisma/client";

class Seed {
  private static readonly prisma = new PrismaClient();

  private static async clean(): Promise<void> {
    console.log("\nTruncating 'companies' table...");
    await this.prisma.$queryRaw`TRUNCATE TABLE companies CASCADE`;
  }

  public static async main(): Promise<void> {
    console.clear();
    console.log("\nRunning seed 🌱");

    await this.clean();

    const company = Company.create({ name: "Example Company" }).value.getValue()!;

    await this.prisma.prismaCompany.create({
      data: CompanyDataMapper.toPersistence(company),
    });

    const employee = Employee.create({
      fullName: "Fake Person",
      email: "fake@gmail.com",
      companyId: company._id,
      cpf: "12345678901",
    }).value.getValue()!;

    await this.prisma.prismaEmployee.create({
      data: EmployeeDataMapper.toPersistence(employee),
    });

    console.log("\nOK!");
  }
}

Seed.main().catch((err) => {
  console.log(err);
  process.exit(1);
});
