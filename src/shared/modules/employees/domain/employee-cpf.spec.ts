import { DomainErrors } from "@core/domain/domain-error";
import { Left, Right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { EmployeeCPF } from "./employee-cpf";

describe("Employee CPF Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a Employee CPF value object", () => {
      const validCpf = "12345678901"; // Eleven numeric digits

      const result = EmployeeCPF.create(validCpf);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(EmployeeCPF);
      expect(result.value.getValue()).toHaveProperty("value", validCpf);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the cpf is not an eleven numeric digits string", () => {
      const invalidCpf = "1234aaaa";

      const result = EmployeeCPF.create(invalidCpf);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Employee CPF must be an eleven numeric digits string"
      );
    });
  });
});
