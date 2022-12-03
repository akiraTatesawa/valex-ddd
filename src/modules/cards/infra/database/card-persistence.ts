import { VoucherType } from "@shared/domain/voucher-type";

export interface CardPersistence {
  id: string;
  employeeId: string;
  cardholderName: string;
  type: VoucherType;
  number: string;
  securityCode: string;
  expirationDate: Date;
  password: string | undefined;
  isVirtual: boolean;
  originalCardId: string | undefined;
  isBlocked: boolean;
}
