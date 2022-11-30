import { Company } from "@modules/companies/domain/company";
import { CompanyMapper } from "@modules/companies/mappers/company-mapper";
import { randCompanyName } from "@ngneat/falso";
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

    const company = Company.create({ name: randCompanyName() }).value!;

    await this.prisma.prismaCompany.create({
      data: CompanyMapper.toPersistence(company),
    });

    console.log("\nOK!");
  }
}

Seed.main().catch((err) => {
  console.log(err);
  process.exit(1);
});
