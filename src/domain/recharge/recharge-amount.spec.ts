import { randNumber } from "@ngneat/falso";
import { Right, Left } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { RechargeAmount } from "./recharge-amount";

describe("Recharge Amount Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a recharge amount", () => {
      const amount: number = randNumber({ min: 1 });

      const result = RechargeAmount.create(amount);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(RechargeAmount);
      expect(result.value.getValue()?.value).toEqual(amount);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the recharge amount is not a number", () => {
      const amount: any = randNumber({ min: 1 }).toString();

      const result = RechargeAmount.create(amount);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Recharge Amount must be a number");
    });

    it("Should return an error if the recharge amount is not an integer", () => {
      const amount: number = randNumber({ min: 1, fraction: 2 });

      const result = RechargeAmount.create(amount);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Recharge Amount must be an integer");
    });

    it("Should return an error if the recharge amount is lower than zero", () => {
      const amount: number = randNumber({ max: 0 });

      const result = RechargeAmount.create(amount);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Recharge Amount must greater than zero");
    });
  });
});
