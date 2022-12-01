import { randCreditCardCVV, randFullName } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { CardCVV } from "./card-cvv";

describe("Card Security Code Value Object", () => {
  describe("Success", () => {
    it("Should be able to generate a Card CVV when its not provided", () => {
      const result = CardCVV.create();

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardCVV);
      expect(result.value?.value).toBeDefined();
      expect(result.value?.value).toHaveLength(3);
    });

    it("Should be able to create a Card CVV when it is provided", () => {
      const cvv = randCreditCardCVV();

      const result = CardCVV.create(cvv);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardCVV);
      expect(result.value?.value).toEqual(cvv);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the provided CVV is not a 3 numeric digits string", () => {
      const invalidCVV = randFullName();

      const result = CardCVV.create(invalidCVV);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Card CVV must be a 3 digits numeric string");
    });
  });
});
