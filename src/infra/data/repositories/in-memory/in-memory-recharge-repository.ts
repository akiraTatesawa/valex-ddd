import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { Recharge } from "@domain/recharge/recharge";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { RechargeDataMapper } from "@infra/data/mappers/recharge-data-mapper";

export class InMemoryRechargeRepository implements RechargeRepository {
  constructor(private readonly inMemoryDatabase: InMemoryDatabase) {}

  public async save(rechargeDomain: Recharge): Promise<void> {
    const rawRecharge = RechargeDataMapper.toPersistence(rechargeDomain);

    this.inMemoryDatabase.recharges.push(rawRecharge);
  }
}
