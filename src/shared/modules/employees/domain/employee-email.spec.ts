import { randEmail } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { EmployeeEmail } from "./employee-email";

describe("Employee Email Value Object", () => {
  describe("Success", () => {
    it("Should be able to create an Employee Email value object", () => {
      const validEmail = randEmail();

      const result = EmployeeEmail.create(validEmail);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value?.value).toEqual(validEmail);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the email format is not valid", () => {
      const invalidEmail = "email @email.com";

      const result = EmployeeEmail.create(invalidEmail);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Employee Email must be a valid email");
    });

    it("Should return an error if the email is null or undefined", () => {
      const invalidEmail = null as any;

      const result = EmployeeEmail.create(invalidEmail);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Employee Email cannot be null or undefined");
    });
  });
});
