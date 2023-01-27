import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { Recharge } from "@domain/recharge/recharge";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { RechargeDataMapper } from "@infra/data/mappers/recharge-data-mapper";

export class InMemoryRechargeRepository implements RechargeRepository {
  constructor(private readonly database: InMemoryDatabase) {}

  public async save(rechargeDomain: Recharge): Promise<void> {
    const rawRecharge = RechargeDataMapper.toPersistence(rechargeDomain);

    this.database.recharges.push(rawRecharge);
  }

  public async findAll(cardId: string): Promise<Recharge[]> {
    const rawRecharges = this.database.recharges.filter((raw) => raw.cardId === cardId);

    return RechargeDataMapper.bulkToDomain(rawRecharges);
  }
}
