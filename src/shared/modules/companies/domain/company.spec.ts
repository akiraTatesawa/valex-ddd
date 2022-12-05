import { randPastDate, randUuid, randText, randNumber } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { Left, Right } from "@core/logic/either";
import { Company } from "./company";
import { CompanyName } from "./company-name";

describe("Company Entity", () => {
  describe("Success", () => {
    it("Should be able to create a Company", () => {
      const name = randText({ charCount: randNumber({ min: 1, max: 29 }) });

      const result = Company.create({ name });

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getValue()).toBeInstanceOf(Company);
      expect(result.value.getValue()).toHaveProperty("_id");
      expect(result.value.getValue()).toHaveProperty("createdAt");
      expect(result.value.getValue()).toHaveProperty("apiKey");
      expect(result.value.getValue()?.name).toBeInstanceOf(CompanyName);
      expect(result.value.getValue()).toHaveProperty("name.value", name);
    });

    it("Should be able to create a Company passing optional props", () => {
      const name = randText({ charCount: randNumber({ min: 1, max: 29 }) });
      const id = randUuid();
      const apiKey = randUuid();
      const createdAt = randPastDate();

      const result = Company.create({ id, name, apiKey, createdAt });

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getValue()).toBeInstanceOf(Company);
      expect(result.value.getValue()).toHaveProperty("_id", id);
      expect(result.value.getValue()).toHaveProperty("createdAt", createdAt);
      expect(result.value.getValue()).toHaveProperty("apiKey", apiKey);
      expect(result.value.getValue()?.name).toBeInstanceOf(CompanyName);
      expect(result.value.getValue()).toHaveProperty("name.value", name);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the company name value object creation fail", () => {
      const name = null as any;

      const result = Company.create({ name });

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company Name cannot be null or undefined");
    });

    it("Should return an error if the company id is not an uuid", () => {
      const name = randText({ charCount: randNumber({ min: 1, max: 29 }) });
      const id = randText({ charCount: randNumber({ min: 1, max: 29 }) });

      const result = Company.create({ name, id });

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company ID must be a valid UUID");
    });

    it("Should return an error if the company api key is not an uuid", () => {
      const name = randText({ charCount: randNumber({ min: 1, max: 29 }) });
      const apiKey = randText({ charCount: randNumber({ min: 1, max: 29 }) });

      const result = Company.create({ name, apiKey });

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company API KEY must be a valid UUID");
    });

    it("Should return an error if the company createdAt is not a valid date", () => {
      const name = randText({ charCount: randNumber({ min: 1, max: 29 }) });
      const createdAt = randText({ charCount: randNumber({ min: 1, max: 29 }) }) as any;

      const result = Company.create({ name, createdAt });

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company Created At must be a Date");
    });
  });
});
