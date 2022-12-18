import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import {
  CompanyRepository,
  CompanyUniqueArgs,
} from "@shared/modules/companies/app/ports/company-repository";
import { Company } from "@shared/modules/companies/domain/company";
import { CompanyMapper } from "@shared/modules/companies/mappers/company-mapper";

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

    return CompanyMapper.toDomain(rawCompany);
  }

  public async save(data: Company): Promise<void> {
    const rawCompany = CompanyMapper.toPersistence(data);

    await this.prisma.company.create({
      data: rawCompany,
    });
  }
}
