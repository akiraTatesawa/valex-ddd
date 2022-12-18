// import { Company } from "@modules/companies/domain/company";
// import { CompanyMapper } from "@modules/companies/mappers/company-mapper";
// import { Employee } from "@modules/employees/domain/employee";
// import { EmployeeMapper } from "@modules/employees/mapper/employee-mapper";
// import { PrismaClient } from "@prisma/client";

// class Seed {
//   private static readonly prisma = new PrismaClient();

//   private static async clean(): Promise<void> {
//     console.log("\nTruncating 'companies' table...");
//     await this.prisma.$queryRaw`TRUNCATE TABLE companies CASCADE`;
//   }

//   public static async main(): Promise<void> {
//     console.clear();
//     console.log("\nRunning seed 🌱");

//     await this.clean();

//     const company = Company.create({ name: "Example Company" }).value!;

//     await this.prisma.prismaCompany.create({
//       data: CompanyMapper.toPersistence(company),
//     });

//     const employee = Employee.create({
//       fullName: "Fake Person",
//       email: "fake@gmail.com",
//       companyId: company._id,
//       cpf: "12345678901",
//     }).value!;

//     await this.prisma.prismaEmployee.create({
//       data: EmployeeMapper.toPersistence(employee),
//     });

//     console.log("\nOK!");
//   }
// }

// Seed.main().catch((err) => {
//   console.log(err);
//   process.exit(1);
// });
