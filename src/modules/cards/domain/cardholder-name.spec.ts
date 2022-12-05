import { randNumber } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { Right, Left } from "@core/logic/either";
import { CardholderName } from "./cardholder-name";

describe("Cardholder Name Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a cardholder name", () => {
      const name = "random is fake name";
      const formattedNameExpect = "RANDOM F NAME";

      const result = CardholderName.create(name);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardholderName);
      expect(result.value.getValue()?.value).toEqual(formattedNameExpect);
    });

    it("Should be able to create a cardholder name without formatting the name", () => {
      const name = "FAKE S NAME";

      const result = CardholderName.create(name, true);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardholderName);
      expect(result.value.getValue()?.value).toEqual(name);
    });
  });

  describe("Fail", () => {
    it("Should not be able to create a cardholder name if the name contains a number", () => {
      const name = randNumber().toString();

      const result = CardholderName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Cardholder Name must consist of only letters"
      );
    });

    it("Should not be able to create a cardholder name if the name is null", () => {
      const name = null as any;

      const result = CardholderName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Cardholder Name cannot be null or undefined"
      );
    });
  });
});
