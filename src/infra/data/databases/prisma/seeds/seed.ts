import { Company } from "@domain/company/company";
import { Employee } from "@domain/employee/employee";
import { CompanyDataMapper } from "@infra/data/mappers/company-data-mapper";
import { EmployeeDataMapper } from "@infra/data/mappers/employee-data-mapper";
import { PrismaClient } from "@prisma/client";

class Seed {
  private static readonly prisma = new PrismaClient();

  private static async clean(): Promise<void> {
    console.log("\nTruncating tables...");
    await this.prisma.$queryRaw`TRUNCATE TABLE companies CASCADE`;
    await this.prisma.$queryRaw`TRUNCATE TABLE employees CASCADE`;
    await this.prisma.$queryRaw`TRUNCATE TABLE cards CASCADE`;
    await this.prisma.$queryRaw`TRUNCATE TABLE recharges CASCADE`;
  }

  public static async main(): Promise<void> {
    console.clear();
    console.log("\nRunning seed 🌱");

    await this.clean();

    const company = Company.create({
      name: "Fake Company",
      apiKey: "dca4afcc-e623-4f11-a0cc-27733410d86b",
    }).value.getValue()!;

    await this.prisma.prismaCompany.create({
      data: CompanyDataMapper.toPersistence(company),
    });

    const employee = Employee.create({
      id: "75c9524a-9843-4c5e-91de-8e3e239e17af",
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
