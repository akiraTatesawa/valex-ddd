import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaCompanyRepository } from "@shared/modules/companies/infra/database/prisma/prisma-company-repository";
import { PrismaEmployeeRepository } from "@infra/data/repositories/prisma/prisma-employee-repository";
import { GetEmployeeImpl } from "app/services/get-employee/get-employee.service";
import { GetCompanyImpl } from "@shared/modules/companies/app/services/get-company/get-company.service";
import { CreateCardImpl } from "@modules/cards/app/use-cases/create-card/create-card";
import { PrismaCardRepository } from "@modules/cards/infra/database/prisma/prisma-card-repository";
import { CreateCardController } from "./create-card.controller";

function createCardControllerFactory(): CreateCardController {
  const companyRepo = new PrismaCompanyRepository(prisma);
  const employeeRepo = new PrismaEmployeeRepository(prisma);

  const getEmployeeService = new GetEmployeeImpl(employeeRepo);
  const getCompanyService = new GetCompanyImpl(companyRepo);

  const cardRepo = new PrismaCardRepository(prisma);

  const useCase = new CreateCardImpl(getCompanyService, getEmployeeService, cardRepo);

  return new CreateCardController(useCase);
}

export const createCardController = createCardControllerFactory();
