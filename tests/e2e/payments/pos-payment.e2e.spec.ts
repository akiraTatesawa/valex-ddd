// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { randNumber, randUuid } from "@ngneat/falso";

import { Business } from "@domain/business/business";
import { ExpressApp } from "@infra/http/app";
import { BusinessFactory } from "@tests/factories/business-factory";
import { Card } from "@domain/card/card";
import { PrismaBusinessRepository } from "@infra/data/repositories/prisma/prisma-business-repository";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { CreatePosPaymentRequest } from "@infra/http/controllers/requests/create-pos-payment-request";
import { CardHelper } from "../helpers/card-helper";
import { TestHelper } from "../helpers/test-helper";
import { RechargeHelper } from "../helpers/recharge-helper";
import { BusinessHelper } from "../helpers/business-helper";

describe("POST /payments/pos", () => {
  let business: Business;
  let card: Card;

  const server = supertest(new ExpressApp().app);

  beforeEach(async () => {
    await TestHelper.cleanDB();

    card = await CardHelper.createCard();
    business = new BusinessFactory().generate({ type: card.type });

    await new PrismaBusinessRepository(prisma).save(business);
    await RechargeHelper.createRecharge(card, randNumber({ min: 1000 }));
  });

  describe("Success", () => {
    it("[200::OK] Should be able to create a POS payment", async () => {
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: business._id,
        cardId: card._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.OK);
      expect(result.body).toHaveProperty("id");
      expect(result.body).toHaveProperty("timestamp");
      expect(result.body).toHaveProperty("cardId", card._id);
      expect(result.body).toHaveProperty("businessId", business._id);
      expect(result.body).toHaveProperty("amount", request.amount);
    });
  });

  describe("Fail", () => {
    it("[400::BAD_REQUEST] Should return an error if the amount is lower than zero", async () => {
      const request: CreatePosPaymentRequest = {
        amount: -1,
        businessId: business._id,
        cardId: card._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(result.body).toHaveProperty("type", httpStatus[400]);
      expect(result.body).toHaveProperty("message", "Amount must greater than zero");
    });

    it("[401::UNAUTHORIZED] Should return an error if the password is incorrect", async () => {
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: business._id,
        cardId: card._id,
        cardPassword: "1231",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.UNAUTHORIZED);
      expect(result.body).toHaveProperty("type", httpStatus[401]);
      expect(result.body).toHaveProperty("message", "Wrong Password");
    });

    it("[404::NOT_FOUND] Should return an error if the card does not exist", async () => {
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: business._id,
        cardId: randUuid(),
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).toHaveProperty("type", httpStatus[404]);
      expect(result.body).toHaveProperty("message", "Card not found");
    });

    it("[404::NOT_FOUND] Should return an error if the business does not exist", async () => {
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: randUuid(),
        cardId: card._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(result.body).toHaveProperty("type", httpStatus[404]);
      expect(result.body).toHaveProperty("message", "Business not found");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is virtual", async () => {
      const virtualCard = await CardHelper.createVirtualCard(card);
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: business._id,
        cardId: virtualCard._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty("message", "Cannot use a virtual card on a POS payment");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is not active", async () => {
      await CardHelper.inactivateCard(card);
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: business._id,
        cardId: card._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty("message", "The card must be active");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is expired", async () => {
      await CardHelper.expireCard(card);
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: business._id,
        cardId: card._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty("message", "The card is expired");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card is blocked", async () => {
      await CardHelper.blockCard(card);
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: business._id,
        cardId: card._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty("message", "The card is blocked");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the card type is not the same as the business type", async () => {
      await BusinessHelper.changeBusinessType(business, "health");
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 1, max: 90 }),
        businessId: business._id,
        cardId: card._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty(
        "message",
        "Business Type must be the same as the Card Type"
      );
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the balance is insufficient", async () => {
      const request: CreatePosPaymentRequest = {
        amount: randNumber({ min: 9999 }),
        businessId: business._id,
        cardId: card._id,
        cardPassword: "1234",
      };

      const result = await server.post("/payments/pos").send(request);

      expect(result.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(result.body).toHaveProperty("type", httpStatus[422]);
      expect(result.body).toHaveProperty("message", "Insufficient Card Balance");
    });
  });
});
