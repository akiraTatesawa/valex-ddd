// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { randNumber, randUuid } from "@ngneat/falso";

import { ExpressApp } from "@infra/http/app";
import { Employee } from "@domain/employee/employee";
import { Company } from "@domain/company/company";
import { Card } from "@domain/card/card";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaCompanyRepository } from "@infra/data/repositories/prisma/prisma-company-repository";
import { PrismaEmployeeRepository } from "@infra/data/repositories/prisma/prisma-employee-repository";
import { PrismaCardRepository } from "@infra/data/repositories/prisma/prisma-card-repository";
import { CompanyFactory } from "@tests/factories/company-factory";
import { EmployeeFactory } from "@tests/factories/employee-factory";
import { CardFactory } from "@tests/factories/card-factory";
import { TestHelper } from "../helpers/test-helper";
import { RechargeHelper } from "../helpers/recharge-helper";
import { PaymentHelper } from "../helpers/payment-helper";

describe("GET /cards/:cardId/balance", () => {
  let employee: Employee;
  let company: Company;
  let card: Card;

  const companyRepo = new PrismaCompanyRepository(prisma);
  const employeeRepo = new PrismaEmployeeRepository(prisma);
  const cardRepo = new PrismaCardRepository(prisma);

  const server = supertest(new ExpressApp().app);

  beforeEach(async () => {
    await TestHelper.cleanDB();

    company = new CompanyFactory().generate();
    employee = new EmployeeFactory().generate({ companyId: company._id });
    card = new CardFactory().generate({ employeeId: employee._id });

    await companyRepo.save(company);
    await employeeRepo.save(employee);
    await cardRepo.save(card);
  });

  describe("Success", () => {
    it("[200::OK] Should be able to get the card balance", async () => {
      const result = await server.get(`/cards/${card._id}/balance`);

      expect(result.statusCode).toEqual(httpStatus.OK);
      expect(result.body).toHaveProperty("balance", 0);
      expect(result.body).toHaveProperty("payments", []);
      expect(result.body).toHaveProperty("recharges", []);
    });

    it("[200::OK] Should be able to get the card balance when there are transactions", async () => {
      const recharge = await RechargeHelper.createRecharge(card, randNumber({ min: 1, max: 1000 }));
      const payment = await PaymentHelper.createPayment(card, randNumber({ min: 1, max: 900 }));

      const result = await server.get(`/cards/${card._id}/balance`);

      expect(result.statusCode).toEqual(httpStatus.OK);
      expect(result.body).toHaveProperty("balance", recharge.amount.value - payment.amount.value);
      expect(result.body).toHaveProperty("payments");
      expect(result.body.payments).toHaveLength(1);
      expect(result.body).toHaveProperty("recharges");
      expect(result.body.recharges).toHaveLength(1);
    });
  });

  describe("Fail", () => {
    it("[404::NOT_FOUND] Should return an error if the card does not exist", async () => {
      const result = await server.get(`/cards/${randUuid()}/balance`);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).toHaveProperty("type", httpStatus[404]);
      expect(result.body).toHaveProperty("message", "Card not found");
    });
  });
});
