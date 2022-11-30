import { randCompanyName, randPastDate, randUuid } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { Company } from "./company";
import { CompanyName } from "./company-name";

describe("Company Entity", () => {
  describe("Success", () => {
    it("Should be able to create a Company", () => {
      const name = randCompanyName();

      const result = Company.create({ name });

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(Company);
      expect(result.value).toHaveProperty("_id");
      expect(result.value).toHaveProperty("createdAt");
      expect(result.value).toHaveProperty("apiKey");
      expect(result.value?.name).toBeInstanceOf(CompanyName);
    });

    it("Should be able to create a Company passing optional props", () => {
      const name = randCompanyName();
      const id = randUuid();
      const apiKey = randUuid();
      const createdAt = randPastDate();

      const result = Company.create({ id, name, apiKey, createdAt });

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(Company);
      expect(result.value).toHaveProperty("_id", id);
      expect(result.value).toHaveProperty("createdAt", createdAt);
      expect(result.value).toHaveProperty("apiKey", apiKey);
      expect(result.value?.name).toBeInstanceOf(CompanyName);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the company name value object creation fail", () => {
      const name = null as any;

      const result = Company.create({ name });

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Company Name cannot be null or undefined");
    });

    it("Should return an error if the company id is not an uuid", () => {
      const name = randCompanyName();
      const id = randCompanyName();

      const result = Company.create({ name, id });

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Company ID must be a valid UUID");
    });

    it("Should return an error if the company api key is not an uuid", () => {
      const name = randCompanyName();
      const apiKey = randCompanyName();

      const result = Company.create({ name, apiKey });

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Company API KEY must be a valid UUID");
    });

    it("Should return an error if the company api key is not a valid date", () => {
      const name = randCompanyName();
      const createdAt = randCompanyName() as any;

      const result = Company.create({ name, createdAt });

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Company Created At must be a Date");
    });
  });
});
