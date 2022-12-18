import "dotenv/config";
import Cryptr from "cryptr";
import { randCreditCardCVV, randFullName } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";
import { Left, Right } from "@core/logic/either";
import { CardCVV } from "./card-cvv";

describe("Card Security Code Value Object", () => {
  const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

  describe("Success", () => {
    it("Should be able to generate a Card CVV when its not provided", () => {
      const result = CardCVV.create();

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardCVV);
      expect(result.value.getValue()?.value).not.toHaveLength(3);
      expect(result.value.getValue()?.decrypt()).toHaveLength(3);
    });

    it("Should be able to create a Card CVV when it is provided", () => {
      const cvv = randCreditCardCVV();
      const encryptedCVV = cryptr.encrypt(cvv);

      const result = CardCVV.create(encryptedCVV);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardCVV);
      expect(result.value.getValue()?.value).toEqual(encryptedCVV);
      expect(result.value.getValue()?.decrypt()).toEqual(cvv);
    });

    it("Should be able to compare an external value to the CVV original value", () => {
      const cvv = randCreditCardCVV();
      const encryptedCVV = cryptr.encrypt(cvv);

      const result = CardCVV.create(encryptedCVV);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardCVV);
      expect(result.value.getValue()?.value).toEqual(encryptedCVV);
      expect(result.value.getValue()?.decrypt()).toEqual(cvv);
      expect(result.value.getValue()?.compare(cvv)).toEqual(true);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the provided CVV is not encrypted", () => {
      const invalidCVV = randFullName();

      const result = CardCVV.create(invalidCVV);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Invalid CVV encryption");
    });

    it("Should return an error if the provided CVV is correctly encrypted but with an invalid format", () => {
      const invalidCVV = randFullName();
      const encryptedCVV = cryptr.encrypt(invalidCVV);

      const result = CardCVV.create(encryptedCVV);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Card CVV must be a 3 digits numeric string"
      );
    });
  });
});
