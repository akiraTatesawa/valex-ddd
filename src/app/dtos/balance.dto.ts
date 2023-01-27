import { PaymentDTO } from "./payment.dto";
import { RechargeDTO } from "./recharge.dto";

export interface BalanceDTO {
  balance: number;
  recharges: RechargeDTO[];
  payments: PaymentDTO[];
}
