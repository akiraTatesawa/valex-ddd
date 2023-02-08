// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { randUuid } from "@ngneat/falso";

import { Card } from "@domain/card/card";
import { Company } from "@domain/company/company";
import { Employee } from "@domain/employee/employee";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaCardRepository } from "@infra/data/repositories/prisma/prisma-card-repository";
import { PrismaCompanyRepository } from "@infra/data/repositories/prisma/prisma-company-repository";
import { PrismaEmployeeRepository } from "@infra/data/repositories/prisma/prisma-employee-repository";
import { ExpressApp } from "@infra/http/app";
import { CompanyFactory } from "@tests/factories/company-factory";
import { EmployeeFactory } from "@tests/factories/employee-factory";
import { CardFactory } from "@tests/factories/card-factory";
import { CreateVirtualCardRequest } from "@infra/http/controllers/requests/virtual-card.request";
import { TestHelper } from "../helpers/test-helper";
import { CardHelper } from "../helpers/card-helper";

describe("POST /cards/:cardId/virtual", () => {
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
    card.activate("1234");

    await companyRepo.save(company);
    await employeeRepo.save(employee);
    await cardRepo.save(card);
  });

  describe("Success", () => {
    it("[201::CREATED] Should be able to create a virtual card", async () => {
      const request: CreateVirtualCardRequest = {
        password: "1234",
      };

      const result = await server.post(`/cards/${card._id}/virtual`).send(request);

      expect(result.statusCode).toEqual(httpStatus.CREATED);
      expect(result.body).toHaveProperty("id");
      expect(result.body).toHaveProperty("number");
      expect(result.body).toHaveProperty("cardholderName");
      expect(result.body).toHaveProperty("securityCode");
      expect(result.body).toHaveProperty("expirationDate");
      expect(result.body).toHaveProperty("type");
    });
  });

  describe("Fail", () => {
    it("[404::NOT_FOUND] Should return an error if the card does not exist", async () => {
      const request: CreateVirtualCardRequest = {
        password: "1234",
      };

      const result = await server.post(`/cards/${randUuid()}/virtual`).send(request);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).toHaveProperty("type", httpStatus[404]);
      expect(result.body).toHaveProperty("message", "Card not found");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is not active", async () => {
      await CardHelper.inactivateCard(card);
      const request: CreateVirtualCardRequest = {
        password: "1234",
      };

      const result = await server.post(`/cards/${card._id}/virtual`).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty("message", "The card must be active");
    });

    it("[401::UNAUTHORIZED] Should return an error if the password is incorrect", async () => {
      const request: CreateVirtualCardRequest = {
        password: "1231",
      };

      const result = await server.post(`/cards/${card._id}/virtual`).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNAUTHORIZED);
      expect(result.body).toHaveProperty("type", httpStatus[401]);
      expect(result.body).toHaveProperty("message", "Wrong Password");
    });

    it("[400::BAD_REQUEST] Should return an error if the original card is virtual", async () => {
      const virtualCard = await CardHelper.createVirtualCard(card);
      const request: CreateVirtualCardRequest = {
        password: "1234",
      };

      const result = await server.post(`/cards/${virtualCard._id}/virtual`).send(request);

      expect(result.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).toHaveProperty("type", httpStatus[400]);
      expect(result.body).toHaveProperty(
        "message",
        "Cannot create a Virtual Card from another virtual card"
      );
    });
  });
});
