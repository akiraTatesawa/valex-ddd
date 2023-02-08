import { Card } from "@domain/card/card";
import { Recharge } from "@domain/recharge/recharge";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaRechargeRepository } from "@infra/data/repositories/prisma/prisma-recharge-repository";
import { RechargeFactory } from "@tests/factories/recharge-factory";

export class RechargeHelper {
  private static readonly rechargeRepo = new PrismaRechargeRepository(prisma);

  public static async createRecharge(card: Card, amount?: number): Promise<Recharge> {
    const recharge = new RechargeFactory().generate({ cardId: card._id, amount });

    await this.rechargeRepo.save(recharge);

    return recharge;
  }
}
