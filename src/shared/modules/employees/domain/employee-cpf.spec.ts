import { DomainErrors } from "@core/domain/domain-error";
import { Result } from "@core/logic/result";
import { EmployeeCPF } from "./employee-cpf";

describe("Employee CPF Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a Employee CPF value object", () => {
      const validCpf = "12345678901"; // Eleven numeric digits

      const result = EmployeeCPF.create(validCpf);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(EmployeeCPF);
      expect(result.value?.value).toEqual(validCpf);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the cpf is not an eleven numeric digits string", () => {
      const invalidCpf = "1234aaaa";

      const result = EmployeeCPF.create(invalidCpf);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Employee CPF must be an eleven numeric digits string");
    });
  });
});
