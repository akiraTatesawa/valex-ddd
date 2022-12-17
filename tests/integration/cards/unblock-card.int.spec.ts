// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { randUuid, randPastDate } from "@ngneat/falso";

import { Employee } from "@shared/modules/employees/domain/employee";
import { Company } from "@shared/modules/companies/domain/company";
import { Card } from "@modules/cards/domain/card";
import { PrismaCompanyRepository } from "@shared/modules/companies/infra/database/prisma/prisma-company-repository";
import { PrismaEmployeeRepository } from "@shared/modules/employees/infra/database/prisma/prisma-employee-repository";
import { prisma } from "@infra/database/prisma/config/prisma.database";
import { PrismaCardRepository } from "@modules/cards/infra/database/prisma/prisma-card-repository";
import { ExpressApp } from "@infra/http/app";
import { CompanyFactory } from "@shared/modules/companies/factories/company-factory";
import { EmployeeFactory } from "@shared/modules/employees/factories/employee-factory";
import { CardFactory } from "@modules/cards/factories/card-factory";
import { UnblockCardRequestBody } from "@modules/cards/infra/http/controllers/unblock-card/request";
import { TestHelper } from "../helpers/test-helper";
import { CardHelper } from "../helpers/card-helper";

describe("PATCH /cards/:cardId/unblock", () => {
  const company: Company = new CompanyFactory().generate();
  const employee: Employee = new EmployeeFactory().generate({ companyId: company._id });

  let card: Card;
  const cardPassword = "1234";

  const companyRepo = new PrismaCompanyRepository(prisma);
  const employeeRepo = new PrismaEmployeeRepository(prisma);
  const cardRepo = new PrismaCardRepository(prisma);

  const server = supertest(new ExpressApp().app);

  beforeEach(async () => {
    await TestHelper.cleanDB();
    card = new CardFactory().generate({ employeeId: employee._id });

    await companyRepo.save(company);
    await employeeRepo.save(employee);
    await cardRepo.save(card);
  });

  describe("Success", () => {
    it("[200::OK] Should be able to unblock a card", async () => {
      card.block();
      await CardHelper.activateCard(card, cardPassword);
      const request: UnblockCardRequestBody = { password: cardPassword };

      const result = await server.patch(`/cards/${card._id}/unblock`).send(request);

      expect(result.statusCode).toEqual(httpStatus.OK);
      expect(result.body).toEqual({});
    });
  });

  describe("Fail", () => {
    it("[400::UNPROCESSABLE_ENTITY] Should return an error if the request body is invalid", async () => {
      const request = { password: cardPassword, invalid: "invalid" };

      const result = await server.patch(`/cards/${card._id}/unblock`).send(request);

      expect(result.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).toHaveProperty("type", "Bad Request");
    });

    it("[401::UNAUTHORIZED] Should return an error if password is wrong", async () => {
      await CardHelper.activateCard(card, cardPassword);
      const request: UnblockCardRequestBody = { password: "4321" };

      const result = await server.patch(`/cards/${card._id}/unblock`).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNAUTHORIZED);
      expect(result.body).toHaveProperty("message", "Wrong Password");
      expect(result.body).toHaveProperty("type", "Unauthorized");
    });

    it("[404::NOT_FOUND] Should return an error if the card does not exist", async () => {
      const request: UnblockCardRequestBody = { password: "1234" };

      const result = await server.patch(`/cards/${randUuid()}/unblock`).send(request);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).toHaveProperty("message", "Card not found");
      expect(result.body).toHaveProperty("type", "Not Found");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is not active", async () => {
      const request: UnblockCardRequestBody = { password: "1234" };

      const result = await server.patch(`/cards/${card._id}/unblock`).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("message", "The card must be active");
      expect(result.body).toHaveProperty("type", "Unprocessable Entity");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is expired", async () => {
      const expiredCard = new CardFactory().generate({
        id: card._id,
        employeeId: employee._id,
        expirationDate: randPastDate({ years: 10 }),
      });
      await CardHelper.activateCard(expiredCard, cardPassword);
      const request: UnblockCardRequestBody = { password: cardPassword };

      const result = await server.patch(`/cards/${expiredCard._id}/unblock`).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("message", "The card is expired");
      expect(result.body).toHaveProperty("type", "Unprocessable Entity");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is already unblocked", async () => {
      await CardHelper.activateCard(card, cardPassword);
      const request: UnblockCardRequestBody = { password: cardPassword };

      const result = await server.patch(`/cards/${card._id}/unblock`).send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("message", "The card is already unblocked");
      expect(result.body).toHaveProperty("type", "Unprocessable Entity");
    });
  });
});