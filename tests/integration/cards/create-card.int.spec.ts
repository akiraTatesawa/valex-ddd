// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { randUuid } from "@ngneat/falso";

import { prisma } from "@infra/database/prisma/config/prisma.database";
import { ExpressApp } from "@infra/http/app";
import { CreateCardBody } from "@modules/cards/infra/http/controllers/create-card/request";
import { CompanyFactory } from "@shared/modules/companies/factories/company-factory";
import { PrismaCompanyRepository } from "@shared/modules/companies/infra/database/prisma/prisma-company-repository";
import { EmployeeFactory } from "@shared/modules/employees/factories/employee-factory";
import { PrismaEmployeeRepository } from "@shared/modules/employees/infra/database/prisma/prisma-employee-repository";
import { PrismaCardRepository } from "@modules/cards/infra/database/prisma/prisma-card-repository";
import { CardFactory } from "@modules/cards/factories/card-factory";
import { TestHelper } from "../helpers/test-helper";

describe("POST /cards", () => {
  const company = new CompanyFactory().generate();
  const employee = new EmployeeFactory().generate({ companyId: company._id });

  const companyRepo = new PrismaCompanyRepository(prisma);
  const employeeRepo = new PrismaEmployeeRepository(prisma);
  const cardRepo = new PrismaCardRepository(prisma);

  const server = supertest(new ExpressApp().app);

  beforeEach(async () => {
    await companyRepo.save(company);
    await employeeRepo.save(employee);
  });

  afterEach(async () => {
    await TestHelper.cleanDB();
  });

  describe("Success", () => {
    it("[201::CREATED] Should be able to create a card", async () => {
      const createCardRequest: CreateCardBody = {
        employeeId: employee._id,
        type: "education",
      };
      const headers = {
        "x-api-key": company.apiKey,
      };

      const result = await server.post("/cards").set(headers).send(createCardRequest);

      expect(result.status).toEqual(httpStatus.CREATED);
      expect(result.body).toHaveProperty("id");
      expect(result.body).toHaveProperty("number");
      expect(result.body).toHaveProperty("cardholderName");
      expect(result.body).toHaveProperty("securityCode");
      expect(result.body).toHaveProperty("type", createCardRequest.type);
      expect(result.body).toHaveProperty("expirationDate");
    });
  });

  describe("Fail", () => {
    it("[400::BAD_REQUEST]: Should return an error if the request payload is invalid", async () => {
      const createCardRequest: CreateCardBody = {
        employeeId: employee._id,
        type: "invalid" as any,
      };
      const headers = {
        "x-api-key": company.apiKey,
      };

      const result = await server.post("/cards").set(headers).send(createCardRequest);

      expect(result.status).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("type", httpStatus[400]);
      expect(result.body).toHaveProperty("message");
    });

    it("[400::BAD_REQUEST]: Should return an error if the API KEY is invalid", async () => {
      const createCardRequest: CreateCardBody = {
        employeeId: employee._id,
        type: "education",
      };
      const headers = {
        "x-api-key": 1234,
      };

      const result = await server.post("/cards").set(headers).send(createCardRequest);

      expect(result.status).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("type", httpStatus[400]);
      expect(result.body).toHaveProperty("message", '"Company API KEY" must be a valid GUID');
    });

    it("[404::NOT_FOUND]: Should return an error if the company does not exist", async () => {
      const createCardRequest: CreateCardBody = {
        employeeId: employee._id,
        type: "education",
      };
      const headers = {
        "x-api-key": randUuid(),
      };

      const result = await server.post("/cards").set(headers).send(createCardRequest);

      expect(result.status).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("type", httpStatus[404]);
      expect(result.body).toHaveProperty("message", "Company not found");
    });

    it("[404::NOT_FOUND]: Should return an error if the employee does not exist", async () => {
      const createCardRequest: CreateCardBody = {
        employeeId: randUuid(),
        type: "education",
      };
      const headers = {
        "x-api-key": company.apiKey,
      };

      const result = await server.post("/cards").set(headers).send(createCardRequest);

      expect(result.status).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("type", httpStatus[404]);
      expect(result.body).toHaveProperty("message", "Employee not found");
    });

    it("[422]::UNPROCESSABLE_ENTITY]: Should return an error if the employee does not belong to the company", async () => {
      const fakeCompany = new CompanyFactory().generate();
      await companyRepo.save(fakeCompany);
      const fakeEmployee = new EmployeeFactory().generate({
        cpf: "32165498714",
        companyId: fakeCompany._id,
      });
      await employeeRepo.save(fakeEmployee);
      const createCardRequest: CreateCardBody = {
        employeeId: fakeEmployee._id,
        type: "education",
      };
      const headers = {
        "x-api-key": company.apiKey,
      };

      const result = await server.post("/cards").set(headers).send(createCardRequest);

      expect(result.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty("message", "Employee does not belong to the company");
    });

    it("[409]::CONFLICT]: Should return an error if the employee already has a card with the same type", async () => {
      const card = new CardFactory().generate({ employeeId: employee._id, type: "education" });
      await cardRepo.save(card);
      const createCardRequest: CreateCardBody = {
        employeeId: employee._id,
        type: "education",
      };
      const headers = {
        "x-api-key": company.apiKey,
      };

      const result = await server.post("/cards").set(headers).send(createCardRequest);

      expect(result.status).toEqual(httpStatus.CONFLICT);
      expect(result.body).not.toHaveProperty("id");
      expect(result.body).toHaveProperty("type", httpStatus[409]);
      expect(result.body).toHaveProperty(
        "message",
        `The employee already has a '${createCardRequest.type}' voucher card`
      );
    });
  });
});
