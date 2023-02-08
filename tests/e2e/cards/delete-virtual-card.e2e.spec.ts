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
import { DeleteVirtualCardRequest } from "@infra/http/controllers/requests/virtual-card.request";
import { TestHelper } from "../helpers/test-helper";
import { CardHelper } from "../helpers/card-helper";

describe("DELETE /cards/:cardId/virtual/delete", () => {
  let employee: Employee;
  let company: Company;
  let card: Card;
  let virtualCard: Card;

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
    virtualCard = await CardHelper.createVirtualCard(card);
  });

  describe("Success", () => {
    it("[200::OK] Should be able to delete a virtual card", async () => {
      const request: DeleteVirtualCardRequest = {
        password: "1234",
      };

      const result = await server.delete(`/cards/${virtualCard._id}/virtual/delete`).send(request);

      expect(result.statusCode).toEqual(httpStatus.OK);
      expect(result.body).toEqual({});
    });
  });

  describe("Fail", () => {
    it("[404::NOT_FOUND] Should return an error if the card does not exist", async () => {
      const request: DeleteVirtualCardRequest = {
        password: "1234",
      };

      const result = await server.delete(`/cards/${randUuid()}/virtual/delete`).send(request);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).toHaveProperty("type", httpStatus[404]);
      expect(result.body).toHaveProperty("message", "Card not found");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is not virtual", async () => {
      const request: DeleteVirtualCardRequest = {
        password: "1234",
      };

      const result = await server.delete(`/cards/${card._id}/virtual/delete`).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty("message", "The card must be virtual");
    });

    it("[401::UNAUTHORIZED] Should return an error if the password is incorrect", async () => {
      const request: DeleteVirtualCardRequest = {
        password: "1231",
      };

      const result = await server.delete(`/cards/${virtualCard._id}/virtual/delete`).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNAUTHORIZED);
      expect(result.body).toHaveProperty("type", httpStatus[401]);
      expect(result.body).toHaveProperty("message", "Wrong Password");
    });
  });
});
