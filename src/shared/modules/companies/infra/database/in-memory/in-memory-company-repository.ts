import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";
import { CompanyRepository, CompanyUniqueArgs } from "@shared/modules/companies/app/ports/company-repository";
import { Company } from "@shared/modules/companies/domain/company";
import { CompanyMapper } from "@shared/modules/companies/mappers/company-mapper";


export class InMemoryCompanyRepository implements CompanyRepository {
  private readonly database: InMemoryDatabase;

  constructor(inMemoryDatabase: InMemoryDatabase) {
    this.database = inMemoryDatabase;
  }

  public async save(data: Company): Promise<void> {
    const rawCompany = CompanyMapper.toPersistence(data);

    this.database.companies.push(rawCompany);
  }

  public async findUnique({ id, name }: CompanyUniqueArgs): Promise<Company | null> {
    const rawCompany = this.database.companies.find(
      (company) => company.id === id || company.name === name
    );

    if (!rawCompany) return null;

    return CompanyMapper.toDomain(rawCompany);
  }
}
