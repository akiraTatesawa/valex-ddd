// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { randNumber, randUuid } from "@ngneat/falso";
import { ExpressApp } from "@infra/http/app";
import { CompanyFactory } from "@tests/factories/company-factory";
import { EmployeeFactory } from "@tests/factories/employee-factory";
import { Employee } from "@domain/employee/employee";
import { Company } from "@domain/company/company";
import { PrismaCompanyRepository } from "@infra/data/repositories/prisma/prisma-company-repository";
import { PrismaEmployeeRepository } from "@infra/data/repositories/prisma/prisma-employee-repository";
import { PrismaCardRepository } from "@infra/data/repositories/prisma/prisma-card-repository";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { Card } from "@domain/card/card";
import { CardFactory } from "@tests/factories/card-factory";
import { RechargeCardRequest } from "@infra/http/controllers/requests/recharge-card-request";
import { TestHelper } from "../helpers/test-helper";
import { CardHelper } from "../helpers/card-helper";

describe("POST /cards/:cardId/recharge", () => {
  let employee: Employee;
  let company: Company;
  let card: Card;
  let headers: object;

  const companyRepo = new PrismaCompanyRepository(prisma);
  const employeeRepo = new PrismaEmployeeRepository(prisma);
  const cardRepo = new PrismaCardRepository(prisma);

  const server = supertest(new ExpressApp().app);

  beforeEach(async () => {
    await TestHelper.cleanDB();

    company = new CompanyFactory().generate();
    employee = new EmployeeFactory().generate({ companyId: company._id });
    card = new CardFactory().generate({ employeeId: employee._id });
    card.activate("1234");

    headers = {
      "x-api-key": company.apiKey,
    };

    await companyRepo.save(company);
    await employeeRepo.save(employee);
    await cardRepo.save(card);
  });

  describe("Success", () => {
    it("[201::CREATED] Should be able to recharge a card", async () => {
      const request: RechargeCardRequest = {
        amount: randNumber({ min: 1 }),
      };

      const result = await server.post(`/cards/${card._id}/recharge`).set(headers).send(request);

      expect(result.statusCode).toEqual(httpStatus.CREATED);
      expect(result.body).toHaveProperty("id");
      expect(result.body).toHaveProperty("amount", request.amount);
      expect(result.body).toHaveProperty("cardId", card._id);
      expect(result.body).toHaveProperty("timestamp");
    });
  });

  describe("Fail", () => {
    it("[400::BAD_REQUEST] Should return an error if the api_key has an invalid format", async () => {
      const request: RechargeCardRequest = {
        amount: randNumber({ min: 1 }),
      };
      headers = {
        "x-api-key": "invalid_api_key",
      };

      const result = await server.post(`/cards/${card._id}/recharge`).set(headers).send(request);

      expect(result.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("message", "Company API KEY must be a valid UUID");
      expect(result.body).toHaveProperty("type", httpStatus[400]);
    });

    it("[404::NOT_FOUND] Should return an error if the company does not exist", async () => {
      const request: RechargeCardRequest = {
        amount: randNumber({ min: 1 }),
      };
      headers = {
        "x-api-key": randUuid(),
      };

      const result = await server.post(`/cards/${card._id}/recharge`).set(headers).send(request);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("message", "Company not found");
      expect(result.body).toHaveProperty("type", httpStatus[404]);
    });

    it("[404::NOT_FOUND] Should return an error if the card does not exist", async () => {
      const request: RechargeCardRequest = {
        amount: randNumber({ min: 1 }),
      };

      const result = await server.post(`/cards/${randUuid()}/recharge`).set(headers).send(request);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("message", "Card not found");
      expect(result.body).toHaveProperty("type", httpStatus[404]);
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is expired", async () => {
      await CardHelper.expireCard(card);
      const request: RechargeCardRequest = {
        amount: randNumber({ min: 1 }),
      };

      const result = await server.post(`/cards/${card._id}/recharge`).set(headers).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("message", "The card is expired");
      expect(result.body).toHaveProperty("type", httpStatus[422]);
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is not active", async () => {
      await CardHelper.inactivateCard(card);

      const request: RechargeCardRequest = {
        amount: randNumber({ min: 1 }),
      };

      const result = await server.post(`/cards/${card._id}/recharge`).set(headers).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("message", "The card must be active");
      expect(result.body).toHaveProperty("type", httpStatus[422]);
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is virtual", async () => {
      const virtualCard = await CardHelper.createVirtualCard(card);

      const request: RechargeCardRequest = {
        amount: randNumber({ min: 1 }),
      };

      const result = await server
        .post(`/cards/${virtualCard._id}/recharge`)
        .set(headers)
        .send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("message", "Cannot recharge a virtual card");
      expect(result.body).toHaveProperty("type", httpStatus[422]);
    });
  });
});
