import { VoucherType } from "@shared/domain/voucher-type";

export interface CreateCardRequest {
  employeeId: string;
  type: VoucherType;
}
