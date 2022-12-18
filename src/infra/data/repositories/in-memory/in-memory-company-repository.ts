import { CompanyRepository, CompanyUniqueArgs } from "@app/ports/repositories/company-repository";
import { Company } from "@domain/company/company";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { CompanyDataMapper } from "@infra/data/mappers/company-data-mapper";

export class InMemoryCompanyRepository implements CompanyRepository {
  private readonly database: InMemoryDatabase;

  constructor(inMemoryDatabase: InMemoryDatabase) {
    this.database = inMemoryDatabase;
  }

  public async save(data: Company): Promise<void> {
    const rawCompany = CompanyDataMapper.toPersistence(data);

    this.database.companies.push(rawCompany);
  }

  public async findUnique({ id, name, apiKey }: CompanyUniqueArgs): Promise<Company | null> {
    const rawCompany = this.database.companies.find(
      (company) => company.id === id || company.name === name || company.apiKey === apiKey
    );

    if (!rawCompany) return null;

    return CompanyDataMapper.toDomain(rawCompany);
  }
}
