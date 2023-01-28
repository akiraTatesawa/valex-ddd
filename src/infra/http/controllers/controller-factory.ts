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
import { GetCardService } from "@app/services/get-card/get-card.service";
import { RechargeCardImpl } from "@app/use-cases/recharge-card/recharge-card";
import { PrismaRechargeRepository } from "@infra/data/repositories/prisma/prisma-recharge-repository";
import { BuyPosUseCase } from "@app/use-cases/buy-pos/buy-pos";
import { PrismaPaymentRepository } from "@infra/data/repositories/prisma/prisma-payment-repository";
import { GetBusinessService } from "@app/services/get-business/get-business.service";
import { PrismaBusinessRepository } from "@infra/data/repositories/prisma/prisma-business-repository";
import { GetBalanceService } from "@app/services/get-balance/get-balance.service";
import { CardController } from "./card.controller";
import { PaymentController } from "./payment.controller";

function cardControllerFactory(): CardController {
  const cardRepository = new PrismaCardRepository(prisma);
  const companyRepository = new PrismaCompanyRepository(prisma);
  const employeeRepository = new PrismaEmployeeRepository(prisma);
  const rechargeRepository = new PrismaRechargeRepository(prisma);

  const getCompany = new GetCompanyImpl(companyRepository);
  const getEmployee = new GetEmployeeImpl(employeeRepository);
  const getCard = new GetCardService(cardRepository);

  const createCard = new CreateCardImpl(getCompany, getEmployee, cardRepository);
  const activateCard = new ActivateCardImpl(cardRepository);
  const blockCard = new BlockCardImpl(cardRepository);
  const unblockCard = new UnblockCardImpl(cardRepository);
  const rechargeCard = new RechargeCardImpl(rechargeRepository, getCompany, getCard);

  return new CardController(createCard, activateCard, blockCard, unblockCard, rechargeCard);
}

function paymentControllerFactory() {
  const paymentRepository = new PrismaPaymentRepository(prisma);
  const rechargeRepository = new PrismaRechargeRepository(prisma);
  const cardRepository = new PrismaCardRepository(prisma);
  const businessRepository = new PrismaBusinessRepository(prisma);

  const getCardService = new GetCardService(cardRepository);
  const getBusinessService = new GetBusinessService(businessRepository);
  const getBalanceService = new GetBalanceService(paymentRepository, rechargeRepository);

  const buyPosUseCase = new BuyPosUseCase(
    paymentRepository,
    getCardService,
    getBusinessService,
    getBalanceService
  );

  return new PaymentController(buyPosUseCase);
}

export const cardController = cardControllerFactory();
export const paymentController = paymentControllerFactory();
