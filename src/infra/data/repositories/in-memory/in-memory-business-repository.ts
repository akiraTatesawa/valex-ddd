import { BusinessRepository } from "@app/ports/repositories/business-repository";
import { Business } from "@domain/business/business";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { BusinessDataMapper } from "@infra/data/mappers/business-data-mapper";

export class InMemoryBusinessRepository implements BusinessRepository {
  private readonly database: InMemoryDatabase;

  constructor(database: InMemoryDatabase) {
    this.database = database;
  }

  public async findById(id: string): Promise<Business | null> {
    const rawBusiness = this.database.businesses.find((raw) => raw.id === id);

    if (!rawBusiness) return null;

    return BusinessDataMapper.toDomain(rawBusiness);
  }

  public async save(domainBusiness: Business): Promise<void> {
    const rawBusiness = BusinessDataMapper.toPersistence(domainBusiness);

    this.database.businesses.push(rawBusiness);
  }
}
