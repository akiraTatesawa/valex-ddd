import { BalanceDTO } from "@app/dtos/balance.dto";
import { PaymentDTO } from "@app/dtos/payment.dto";
import { RechargeDTO } from "@app/dtos/recharge.dto";
import { PaymentAppMapper } from "@app/mappers/payment-app-mapper";
import { RechargeAppMapper } from "@app/mappers/recharge-app-mapper";
import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { RechargeRepository } from "@app/ports/repositories/recharge-repository";

export class GetBalanceService {
  private readonly paymentRepository: PaymentRepository;

  private readonly rechargeRepository: RechargeRepository;

  constructor(paymentRepository: PaymentRepository, rechargeRepository: RechargeRepository) {
    this.paymentRepository = paymentRepository;
    this.rechargeRepository = rechargeRepository;
  }

  private calcBalance(payments: PaymentDTO[], recharges: RechargeDTO[]): number {
    const sumPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const sumRecharges = recharges.reduce((acc, curr) => acc + curr.amount, 0);

    return sumRecharges - sumPayments;
  }

  public async getBalance(cardId: string): Promise<BalanceDTO> {
    const recharges = await this.rechargeRepository.findAll(cardId);
    const rechargesDTO = RechargeAppMapper.bulkToDTO(recharges);

    const payments = await this.paymentRepository.findAll(cardId);
    const paymentsDTO = PaymentAppMapper.bulkToDTO(payments);

    const balance: BalanceDTO = {
      balance: this.calcBalance(paymentsDTO, rechargesDTO),
      payments: paymentsDTO,
      recharges: rechargesDTO,
    };

    return balance;
  }
}
