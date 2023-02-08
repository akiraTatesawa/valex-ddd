import { Business } from "@domain/business/business";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { VoucherType } from "@shared/domain/voucher-type";

export class BusinessHelper {
  public static async changeBusinessType(business: Business, type: VoucherType): Promise<void> {
    await prisma.business.update({
      where: {
        id: business._id,
      },
      data: {
        type,
      },
    });
  }
}
