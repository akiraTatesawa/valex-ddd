import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { Recharge } from "@domain/recharge/recharge";
import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import { RechargeDataMapper } from "@infra/data/mappers/recharge-data-mapper";

export class PrismaRechargeRepository implements RechargeRepository {
  private readonly prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this.prisma = prisma;
  }

  public async save(domainRecharge: Recharge): Promise<void> {
    const rawRecharge = RechargeDataMapper.toPersistence(domainRecharge);

    await this.prisma.recharge.create({
      data: rawRecharge,
    });
  }

  public async findAll(cardId: string): Promise<Recharge[]> {
    const rawRecharges = await this.prisma.recharge.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        cardId,
      },
    });

    return RechargeDataMapper.bulkToDomain(rawRecharges);
  }
}
