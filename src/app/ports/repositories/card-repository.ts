import { Repository } from "@core/app/repository";
import { Card } from "@domain/card/card";
import { VoucherType } from "@shared/domain/voucher-type";

export interface CardFindByTypeArgs {
  employeeId: string;
  type: VoucherType;
}

export interface FindCardByDetailsArgs {
  cardholderName: string;
  cardNumber: string;
  expirationDate: string;
}

export interface CardRepository extends Repository<Card> {
  findByType(args: CardFindByTypeArgs): Promise<Card | null>;
  findById(id: string): Promise<Card | null>;
  findByDetails(args: FindCardByDetailsArgs): Promise<Card | null>;
  findByDetails(args: FindCardByDetailsArgs): Promise<Card | null>;
}
