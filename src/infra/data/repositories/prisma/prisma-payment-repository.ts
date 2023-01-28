import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { Payment } from "@domain/payment/payment";
import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import { PaymentDataMapper } from "@infra/data/mappers/payment-data-mapper";

export class PrismaPaymentRepository implements PaymentRepository {
  private readonly prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this.prisma = prisma;
  }

  public async save(domainData: Payment): Promise<void> {
    const rawPayment = PaymentDataMapper.toPersistence(domainData);

    await this.prisma.payment.create({
      data: rawPayment,
    });
  }

  public async findAll(cardId: string): Promise<Payment[]> {
    const rawPayments = await this.prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        cardId,
      },
    });

    return PaymentDataMapper.bulkToDomain(rawPayments);
  }
}
