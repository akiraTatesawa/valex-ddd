import "dotenv/config";
import Cryptr from "cryptr";
import { randCreditCardCVV, randFullName } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { CardCVV } from "./card-cvv";

describe("Card Security Code Value Object", () => {
  const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

  describe("Success", () => {
    it("Should be able to generate a Card CVV when its not provided", () => {
      const result = CardCVV.create();

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardCVV);
      expect(result.value?.value).toBeDefined();
      expect(result.value?.decrypt()).toHaveLength(3);
      expect(result.value?.value).not.toHaveLength(3);
    });

    it("Should be able to create a Card CVV when it is provided", () => {
      const cvv = randCreditCardCVV();
      const encryptedCVV = cryptr.encrypt(cvv);

      const result = CardCVV.create(encryptedCVV);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardCVV);
      expect(result.value?.value).toEqual(encryptedCVV);
      expect(result.value?.decrypt()).toEqual(cvv);
    });

    it("Should be able to compare an external value to the CVV original value", () => {
      const cvv = randCreditCardCVV();
      const encryptedCVV = cryptr.encrypt(cvv);

      const result = CardCVV.create(encryptedCVV);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardCVV);
      expect(result.value?.value).toEqual(encryptedCVV);
      expect(result.value?.decrypt()).toEqual(cvv);
      expect(result.value?.compare(cvv)).toEqual(true);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the provided CVV is not encrypted", () => {
      const invalidCVV = randFullName();

      const result = CardCVV.create(invalidCVV);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Invalid CVV encryption");
    });

    it("Should return an error if the provided CVV is correctly encrypted but with an invalid format", () => {
      const invalidCVV = randFullName();
      const encryptedCVV = cryptr.encrypt(invalidCVV);

      const result = CardCVV.create(encryptedCVV);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Card CVV must be a 3 digits numeric string");
    });
  });
});
