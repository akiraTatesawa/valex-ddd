import { Repository } from "@core/app/repository";
import { Recharge } from "@domain/recharge/recharge";

export interface RechargeRepository extends Repository<Recharge> {
  findAll(cardId: string): Promise<Recharge[]>;
}
