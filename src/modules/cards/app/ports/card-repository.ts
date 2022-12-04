import { Repository } from "@core/app/repository";
import { Card } from "@modules/cards/domain/card";
import { VoucherType } from "@shared/domain/voucher-type";

export interface CardFindByTypeArgs {
  employeeId: string;
  type: VoucherType;
}

export interface CardRepository extends Repository<Card> {
  findByType(args: CardFindByTypeArgs): Promise<Card | null>;
  findById(id: string): Promise<Card | null>;
}
