import { VoucherType } from "@shared/domain/voucher-type";

export interface CreateCardDTO {
  apiKey: string;
  employeeId: string;
  type: VoucherType;
}
