import { GetCompanyImpl } from "@app/services/get-company/get-company.service";
import { GetEmployeeImpl } from "@app/services/get-employee/get-employee.service";
import { ActivateCardImpl } from "@app/use-cases/activate-card/activate-card";
import { BlockCardImpl } from "@app/use-cases/block-card/block-card";
import { CreateCardImpl } from "@app/use-cases/create-card/create-card";
import { UnblockCardImpl } from "@app/use-cases/unblock-card/unblock-card";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaCardRepository } from "@infra/data/repositories/prisma/prisma-card-repository";
import { PrismaCompanyRepository } from "@infra/data/repositories/prisma/prisma-company-repository";
import { PrismaEmployeeRepository } from "@infra/data/repositories/prisma/prisma-employee-repository";
import { CardController } from "./card.controller";

function cardControllerFactory(): CardController {
  const cardRepository = new PrismaCardRepository(prisma);
  const companyRepository = new PrismaCompanyRepository(prisma);
  const employeeRepository = new PrismaEmployeeRepository(prisma);

  const getCompany = new GetCompanyImpl(companyRepository);
  const getEmployee = new GetEmployeeImpl(employeeRepository);

  const createCard = new CreateCardImpl(getCompany, getEmployee, cardRepository);
  const activateCard = new ActivateCardImpl(cardRepository);
  const blockCard = new BlockCardImpl(cardRepository);
  const unblockCard = new UnblockCardImpl(cardRepository);

  return new CardController(createCard, activateCard, blockCard, unblockCard);
}

export const cardController = cardControllerFactory();
