import { VoucherType } from "@shared/domain/voucher-type";

export interface BusinessPersistence {
  id: string;
  name: string;
  type: VoucherType;
}
