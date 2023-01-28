import { randNumber, randPastDate, randUuid } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { Left, Right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";
import { CreateRechargeProps, Recharge } from "./recharge";

describe("Recharge Entity", () => {
  describe("Success", () => {
    it("Should be able to create a recharge entity", () => {
      const rechargeProps: CreateRechargeProps = {
        amount: randNumber({ min: 1 }),
        cardId: randUuid(),
      };

      const recharge = Recharge.create(rechargeProps);

      expect(recharge).toBeInstanceOf(Right);
      expect(recharge.value).toBeInstanceOf(Result);
      expect(recharge.value.getError()).toBeNull();
      expect(recharge.value.getValue()).toBeInstanceOf(Recharge);
      expect(recharge.value.getValue()).toHaveProperty("_id");
      expect(recharge.value.getValue()).toHaveProperty("createdAt");
      expect(recharge.value.getValue()).toHaveProperty("amount.value", rechargeProps.amount);
      expect(recharge.value.getValue()).toHaveProperty("cardId", rechargeProps.cardId);
    });

    it("Should be able to reconstitute a recharge entity", () => {
      const rechargeProps: CreateRechargeProps = {
        id: randUuid(),
        amount: randNumber({ min: 1 }),
        cardId: randUuid(),
        createdAt: randPastDate(),
      };

      const recharge = Recharge.create(rechargeProps);

      expect(recharge).toBeInstanceOf(Right);
      expect(recharge.value).toBeInstanceOf(Result);
      expect(recharge.value.getError()).toBeNull();
      expect(recharge.value.getValue()).toBeInstanceOf(Recharge);
      expect(recharge.value.getValue()).toHaveProperty("_id", rechargeProps.id);
      expect(recharge.value.getValue()).toHaveProperty("createdAt", rechargeProps.createdAt);
      expect(recharge.value.getValue()).toHaveProperty("amount.value", rechargeProps.amount);
      expect(recharge.value.getValue()).toHaveProperty("cardId", rechargeProps.cardId);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the recharge amount is invalid", () => {
      const rechargeProps: CreateRechargeProps = {
        amount: randNumber({ min: 1, fraction: 2 }),
        cardId: randUuid(),
      };

      const recharge = Recharge.create(rechargeProps);

      expect(recharge).toBeInstanceOf(Left);
      expect(recharge.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(recharge.value.getValue()).toBeNull();
      expect(recharge.value.getError()).not.toBeNull();
      expect(recharge.value.getError()?.message).toEqual("Amount must be an integer");
    });

    it("Should return an error if the card id is not an UUID", () => {
      const rechargeProps: CreateRechargeProps = {
        amount: randNumber({ min: 1 }),
        cardId: "invalid_id",
      };

      const recharge = Recharge.create(rechargeProps);

      expect(recharge).toBeInstanceOf(Left);
      expect(recharge.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(recharge.value.getValue()).toBeNull();
      expect(recharge.value.getError()).not.toBeNull();
      expect(recharge.value.getError()?.message).toEqual("Card ID must be a valid UUID");
    });

    it("Should return an error if the recharge id is not an UUID", () => {
      const rechargeProps: CreateRechargeProps = {
        id: "invalid_id",
        amount: randNumber({ min: 1 }),
        cardId: randUuid(),
        createdAt: randPastDate(),
      };

      const recharge = Recharge.create(rechargeProps);

      expect(recharge).toBeInstanceOf(Left);
      expect(recharge.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(recharge.value.getValue()).toBeNull();
      expect(recharge.value.getError()).not.toBeNull();
      expect(recharge.value.getError()?.message).toEqual("Recharge ID must be a valid UUID");
    });

    it("Should return an error if the recharge createdAt is not a Date", () => {
      const rechargeProps: CreateRechargeProps = {
        id: randUuid(),
        amount: randNumber({ min: 1 }),
        cardId: randUuid(),
        createdAt: 1 as any,
      };

      const recharge = Recharge.create(rechargeProps);

      expect(recharge).toBeInstanceOf(Left);
      expect(recharge.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(recharge.value.getValue()).toBeNull();
      expect(recharge.value.getError()).not.toBeNull();
      expect(recharge.value.getError()?.message).toEqual("Recharge Created At must be a Date");
    });
  });
});
