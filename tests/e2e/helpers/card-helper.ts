import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { Card } from "@domain/card/card";
import { PrismaCardRepository } from "@infra/data/repositories/prisma/prisma-card-repository";
import { CardExpirationDate } from "@domain/card/card-expiration-date";
import { randPastDate } from "@ngneat/falso";
import { PrismaCompanyRepository } from "@infra/data/repositories/prisma/prisma-company-repository";
import { PrismaEmployeeRepository } from "@infra/data/repositories/prisma/prisma-employee-repository";
import { CompanyFactory } from "@tests/factories/company-factory";
import { EmployeeFactory } from "@tests/factories/employee-factory";
import { CardFactory } from "@tests/factories/card-factory";

export class CardHelper {
  private static readonly prismaCardRepo = new PrismaCardRepository(prisma);

  public static async createCard(): Promise<Card> {
    const companyRepo = new PrismaCompanyRepository(prisma);
    const employeeRepo = new PrismaEmployeeRepository(prisma);

    const company = new CompanyFactory().generate();
    const employee = new EmployeeFactory().generate({ companyId: company._id });
    const card = new CardFactory().generate({ employeeId: employee._id });
    card.activate("1234");

    await companyRepo.save(company);
    await employeeRepo.save(employee);
    await this.prismaCardRepo.save(card);

    return card;
  }

  public static async activateCard(card: Card, password: string): Promise<void> {
    card.activate(password);

    await this.prismaCardRepo.save(card);
  }

  public static async inactivateCard(card: Card): Promise<void> {
    await prisma.card.update({
      data: {
        password: null,
      },
      where: {
        id: card._id,
      },
    });
  }

  public static async expireCard(card: Card): Promise<void> {
    const expiredDate = CardExpirationDate.create(randPastDate({ years: 10 })).value.getValue()!;
    const expiredStringDate = expiredDate.getStringExpirationDate();

    await prisma.card.update({
      data: {
        expirationDate: expiredStringDate,
      },
      where: {
        id: card._id,
      },
    });
  }

  public static async blockCard(card: Card): Promise<void> {
    await prisma.card.update({
      data: {
        isBlocked: true,
      },
      where: {
        id: card._id,
      },
    });
  }

  public static async createVirtualCard(card: Card): Promise<Card> {
    const virtualCard = card.generateVirtualCard().value.getValue()!;

    await this.prismaCardRepo.save(virtualCard);

    return virtualCard;
  }
}
