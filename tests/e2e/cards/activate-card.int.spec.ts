// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { randUuid, randPastDate } from "@ngneat/falso";
import { CompanyFactory } from "@shared/modules/companies/factories/company-factory";
import { PrismaCompanyRepository } from "@shared/modules/companies/infra/database/prisma/prisma-company-repository";
import { EmployeeFactory } from "@shared/modules/employees/factories/employee-factory";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaCardRepository } from "@modules/cards/infra/database/prisma/prisma-card-repository";
import { PrismaEmployeeRepository } from "@infra/data/repositories/prisma/prisma-employee-repository";
import { ExpressApp } from "@infra/http/app";
import { CardFactory } from "@modules/cards/factories/card-factory";
import { Employee } from "@domain/employee/employee";
import { Company } from "@domain/company/company";
import { Card } from "@domain/card/card";
import { ActivateCardRequestBody } from "@modules/cards/infra/http/controllers/activate-card/request";
import { TestHelper } from "../helpers/test-helper";

describe("PATCH /cards/:cardId/activate", () => {
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
    it("[200::OK] Should be able to activate a card", async () => {
      const activateCardReq: ActivateCardRequestBody = {
        cvv: card.securityCode.decrypt(),
        password: "1234",
      };

      const result = await server.patch(`/cards/${card._id}/activate`).send(activateCardReq);

      expect(result.statusCode).toEqual(httpStatus.OK);
      expect(result.body).toEqual({});
    });
  });

  describe("Fail", () => {
    it("[404::NOT_FOUND] Should return an error if the card does not exist", async () => {
      const activateCardReq: ActivateCardRequestBody = {
        cvv: card.securityCode.decrypt(),
        password: "1234",
      };

      const result = await server.patch(`/cards/${randUuid()}/activate`).send(activateCardReq);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).toHaveProperty("message", "Card not found");
    });

    it("[400:BAD_REQUEST] Should return an error if the card is already active", async () => {
      card.activate("1234");
      await cardRepo.save(card);
      const activateCardReq: ActivateCardRequestBody = {
        cvv: card.securityCode.decrypt(),
        password: "1234",
      };

      const result = await server.patch(`/cards/${card._id}/activate`).send(activateCardReq);

      expect(result.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).toHaveProperty("message", "The card is already active");
    });

    it("[400:BAD_REQUEST] Should return an error if the card is already active", async () => {
      card = new CardFactory().generate({
        id: card._id,
        employeeId: employee._id,
        expirationDate: randPastDate({ years: 10 }),
      });
      await cardRepo.save(card);
      const activateCardReq: ActivateCardRequestBody = {
        cvv: card.securityCode.decrypt(),
        password: "1234",
      };

      const result = await server.patch(`/cards/${card._id}/activate`).send(activateCardReq);

      expect(result.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).toHaveProperty("message", "The card is expired");
    });

    it("[400:BAD_REQUEST]", async () => {
      const activateCardReq: ActivateCardRequestBody = {
        cvv: card.securityCode.decrypt(),
        password: "12345",
      };

      const result = await server.patch(`/cards/${card._id}/activate`).send(activateCardReq);

      expect(result.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).toHaveProperty(
        "message",
        "Card Password must be a 4 numeric digits string"
      );
    });

    it("[401:UNAUTHORIZED] Should return an error if the CVV is wrong", async () => {
      const activateCardReq: ActivateCardRequestBody = {
        cvv: "123",
        password: "1234",
      };

      const result = await server.patch(`/cards/${card._id}/activate`).send(activateCardReq);

      expect(result.statusCode).toEqual(httpStatus.UNAUTHORIZED);
      expect(result.body).toHaveProperty("message", "Incorrect Card CVV");
    });
  });
});
