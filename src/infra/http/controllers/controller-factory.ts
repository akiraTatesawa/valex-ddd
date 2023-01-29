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
import { GetCardBalanceUseCase } from "@app/use-cases/get-card-balance/get-card-balance";
import { BuyOnlineUseCase } from "@app/use-cases/buy-online/buy-online";
import { CreateVirtualCardUseCase } from "@app/use-cases/create-virtual-card/create-virtual-card";
import { CardController } from "./card.controller";
import { PaymentController } from "./payment.controller";
import { VirtualCardController } from "./virtual-card.controller";

function cardControllerFactory(): CardController {
  const paymentRepository = new PrismaPaymentRepository(prisma);
  const rechargeRepository = new PrismaRechargeRepository(prisma);
  const cardRepository = new PrismaCardRepository(prisma);
  const companyRepository = new PrismaCompanyRepository(prisma);
  const employeeRepository = new PrismaEmployeeRepository(prisma);

  const getCompany = new GetCompanyImpl(companyRepository);
  const getEmployee = new GetEmployeeImpl(employeeRepository);
  const getCard = new GetCardService(cardRepository);
  const getBalanceService = new GetBalanceService(paymentRepository, rechargeRepository);

  const createCard = new CreateCardImpl(getCompany, getEmployee, cardRepository);
  const activateCard = new ActivateCardImpl(cardRepository);
  const blockCard = new BlockCardImpl(cardRepository);
  const unblockCard = new UnblockCardImpl(cardRepository);
  const rechargeCard = new RechargeCardImpl(rechargeRepository, getCompany, getCard);
  const getBalance = new GetCardBalanceUseCase(cardRepository, getBalanceService);

  return new CardController(
    createCard,
    activateCard,
    blockCard,
    unblockCard,
    rechargeCard,
    getBalance
  );
}

function virtualCardControllerFactory() {
  const cardRepository = new PrismaCardRepository(prisma);

  const getCardService = new GetCardService(cardRepository);

  const createVirtualCardUseCase = new CreateVirtualCardUseCase(cardRepository, getCardService);

  return new VirtualCardController(createVirtualCardUseCase);
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

  const buyOnlineUseCase = new BuyOnlineUseCase(
    paymentRepository,
    getCardService,
    getBusinessService,
    getBalanceService
  );

  return new PaymentController(buyPosUseCase, buyOnlineUseCase);
}

export const cardController = cardControllerFactory();
export const virtualCardController = virtualCardControllerFactory();
export const paymentController = paymentControllerFactory();
