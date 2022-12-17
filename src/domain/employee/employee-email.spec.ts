import { randEmail } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { Left, Right } from "@core/logic/either";
import { EmployeeEmail } from "./employee-email";

describe("Employee Email Value Object", () => {
  describe("Success", () => {
    it("Should be able to create an Employee Email value object", () => {
      const validEmail = randEmail();

      const result = EmployeeEmail.create(validEmail);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(EmployeeEmail);
      expect(result.value.getValue()).toHaveProperty("value", validEmail);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the email format is not valid", () => {
      const invalidEmail = "email @email.com";

      const result = EmployeeEmail.create(invalidEmail);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Employee Email must be a valid email");
    });

    it("Should return an error if the email is null or undefined", () => {
      const invalidEmail = null as any;

      const result = EmployeeEmail.create(invalidEmail);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Employee Email cannot be null or undefined"
      );
    });
  });
});
