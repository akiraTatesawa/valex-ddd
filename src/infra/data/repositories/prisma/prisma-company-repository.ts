import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";

import { Company } from "@domain/company/company";
import { CompanyRepository, CompanyUniqueArgs } from "@app/ports/repositories/company-repository";
import { CompanyDataMapper } from "@infra/data/mappers/company-data-mapper";

export class PrismaCompanyRepository implements CompanyRepository {
  private readonly prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this.prisma = prisma;
  }

  public async findUnique({ id, name, apiKey }: CompanyUniqueArgs): Promise<Company | null> {
    const rawCompany = await this.prisma.company.findUnique({
      where: {
        id,
        name,
        apiKey,
      },
    });

    if (!rawCompany) return null;

    return CompanyDataMapper.toDomain(rawCompany);
  }

  public async save(data: Company): Promise<void> {
    const rawCompany = CompanyDataMapper.toPersistence(data);

    await this.prisma.company.create({
      data: rawCompany,
    });
  }
}
