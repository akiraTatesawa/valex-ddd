import { Result } from "@core/logic/result";
import { randNumber, randText, randWord } from "@ngneat/falso";
import { DomainErrors } from "@domain/errors/domain-error";
import { Left, Right } from "@core/logic/either";
import { EmployeeName } from "./employee-name";

describe("Employee Name Value Object", () => {
  describe("Success", () => {
    it("Should create a Employee Name value object", () => {
      const name = randWord();

      const result = EmployeeName.create(name);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(EmployeeName);
      expect(result.value.getValue()).toHaveProperty("value", name);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the name has more than 30 characters", () => {
      const name = randText({ charCount: 31 });

      const result = EmployeeName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Employee Name cannot be longer than 30 characters"
      );
    });

    it("Should return an error if the name does not consist of just letters", () => {
      const name = randNumber({ min: 1000, max: 2000 }).toString();

      const result = EmployeeName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Employee Name must consist of only letters"
      );
    });

    it("Should return an error if the name is null or undefined", () => {
      const name = null as any;

      const result = EmployeeName.create(name);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Employee Name cannot be null or undefined");
    });
  });
});
