import { Card } from "@domain/card/card";
import { Payment } from "@domain/payment/payment";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaBusinessRepository } from "@infra/data/repositories/prisma/prisma-business-repository";
import { PrismaPaymentRepository } from "@infra/data/repositories/prisma/prisma-payment-repository";
import { BusinessFactory } from "@tests/factories/business-factory";
import { PaymentFactory } from "@tests/factories/payment-factory";

export class PaymentHelper {
  private static readonly paymentRepo = new PrismaPaymentRepository(prisma);

  private static readonly businessRepo = new PrismaBusinessRepository(prisma);

  public static async createPayment(card: Card, amount?: number): Promise<Payment> {
    const business = new BusinessFactory().generate({ type: card.type });

    const payment = new PaymentFactory().generate({
      cardId: card._id,
      amount,
      businessId: business._id,
    });

    await this.businessRepo.save(business);
    await this.paymentRepo.save(payment);

    return payment;
  }
}
