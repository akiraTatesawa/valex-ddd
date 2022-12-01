import { randNumber } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { CardholderName } from "./cardholder-name";

describe("Cardholder Name Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a cardholder name", () => {
      const name = "random is fake name";
      const formattedNameExpect = "RANDOM F NAME";

      const result = CardholderName.create(name);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardholderName);
      expect(result.value?.value).toEqual(formattedNameExpect);
    });

    it("Should be able to create a cardholder name without formatting the name", () => {
      const name = "FAKE S NAME";

      const result = CardholderName.create(name, true);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardholderName);
      expect(result.value?.value).toEqual(name);
    });
  });

  describe("Fail", () => {
    it("Should not be able to create a cardholder name if the name contains a number", () => {
      const name = randNumber().toString();

      const result = CardholderName.create(name);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.error?.message).toEqual("Cardholder Name must consist of only letters");
    });

    it("Should not be able to create a cardholder name if the name is null", () => {
      const name = null as any;

      const result = CardholderName.create(name);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.error?.message).toEqual("Cardholder Name cannot be null or undefined");
    });
  });
});
