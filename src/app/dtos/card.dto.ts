import { VoucherType } from "@shared/domain/voucher-type";

export interface CardDTO {
  id: string;
  number: string;
  cardholderName: string;
  securityCode: string;
  expirationDate: string;
  type: VoucherType;
}
