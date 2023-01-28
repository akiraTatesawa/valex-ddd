import { BusinessRepository } from "@app/ports/repositories/business-repository";
import { Business } from "@domain/business/business";
import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import { BusinessDataMapper } from "@infra/data/mappers/business-data-mapper";

export class PrismaBusinessRepository implements BusinessRepository {
  private readonly prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this.prisma = prisma;
  }

  public async save(data: Business): Promise<void> {
    const rawBusiness = BusinessDataMapper.toPersistence(data);

    await this.prisma.business.create({
      data: rawBusiness,
    });
  }

  public async findById(id: string): Promise<Business | null> {
    const rawBusiness = await this.prisma.business.findUnique({
      where: {
        id,
      },
    });

    if (!rawBusiness) return null;

    return BusinessDataMapper.toDomain(rawBusiness);
  }
}
