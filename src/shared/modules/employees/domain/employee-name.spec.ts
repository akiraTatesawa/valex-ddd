import { Result } from "@core/logic/result";
import { randNumber, randText, randWord } from "@ngneat/falso";
import { DomainErrors } from "@core/domain/domain-error";
import { EmployeeName } from "./employee-name";

describe("Employee Name Value Object", () => {
  describe("Success", () => {
    it("Should create a Employee Name value object", () => {
      const name = randWord();

      const result = EmployeeName.create(name);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(EmployeeName);
      expect(result.value?.value).toEqual(name);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the name has more than 30 characters", () => {
      const name = randText({ charCount: 31 });

      const result = EmployeeName.create(name);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Employee Name cannot be longer than 30 characters");
    });

    it("Should return an error if the name does not consist of just letters", () => {
      const name = randNumber({ min: 1000, max: 2000 }).toString();

      const result = EmployeeName.create(name);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Employee Name must consist of only letters");
    });

    it("Should return an error if the name is null or undefined", () => {
      const name = null as any;

      const result = EmployeeName.create(name);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Employee Name cannot be null or undefined");
    });
  });
});
