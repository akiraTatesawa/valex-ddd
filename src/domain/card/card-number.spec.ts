import { DomainErrors } from "@core/domain/domain-error";
import { Left, Right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { randCreditCardNumber, randFullName } from "@ngneat/falso";
import { CardNumber } from "./card-number";

describe("Card Number Value Object", () => {
  describe("Success", () => {
    it("Should be able to generate a Card Number it the value is not provided", () => {
      const result = CardNumber.create();

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardNumber);
      expect(result.value?.getValue()?.value).toMatch(/^[0-9]{16}$/);
    });

    it("Should be able to create a Card Number it the value is provided", () => {
      const cardNumber = randCreditCardNumber({ brand: "Mastercard" }).replaceAll(" ", "");

      const result = CardNumber.create(cardNumber);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardNumber);
      expect(result.value?.getValue()?.value).toMatch(/^[0-9]{16}$/);
      expect(result.value?.getValue()?.value).toEqual(cardNumber);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the provided card number value has an invalid format", () => {
      const cardNumber = randFullName();

      const result = CardNumber.create(cardNumber);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Card Number must be a 13 to 16 numeric digits string"
      );
    });
  });
});
