import { randCompanyName, randText } from "@ngneat/falso";
import { DomainErrors } from "@core/domain/domain-error";
import { Left, Right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { CompanyName } from "./company-name";

describe("Company Name Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a company name value object", () => {
      const name = randCompanyName();

      const result = CompanyName.create(name);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getValue()).toBeInstanceOf(CompanyName);
      expect(result.value.getValue()?.value).toEqual(name);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the name is not a string", () => {
      const name = 1 as any;

      const result = CompanyName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company Name must be a string");
    });

    it("Should return an error if the name is null", () => {
      const name = null as any;

      const result = CompanyName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company Name cannot be null or undefined");
    });

    it("Should return an error if the name is an empty string", () => {
      const name = "";

      const result = CompanyName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company Name cannot be an empty string");
    });

    it("Should return an error if the name is longer than 30 characters", () => {
      const name = randText({ charCount: 31 });

      const result = CompanyName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Company Name cannot be longer than 30 characters"
      );
    });
  });
});
