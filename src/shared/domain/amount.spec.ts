import { randNumber } from "@ngneat/falso";
import { Right, Left } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { Amount } from "./amount";

describe("Amount Value Object", () => {
  describe("Success", () => {
    it("Should be able to create an amount", () => {
      const amount: number = randNumber({ min: 1 });

      const result = Amount.create(amount);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Amount);
      expect(result.value.getValue()?.value).toEqual(amount);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the amount is not a number", () => {
      const amount: any = randNumber({ min: 1 }).toString();

      const result = Amount.create(amount);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Amount must be a number");
    });

    it("Should return an error if the amount is not an integer", () => {
      const amount: number = randNumber({ min: 1, fraction: 2 });

      const result = Amount.create(amount);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Amount must be an integer");
    });

    it("Should return an error if the amount is lower than zero", () => {
      const amount: number = randNumber({ max: 0 });

      const result = Amount.create(amount);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Amount must greater than zero");
    });
  });
});
