import { randFullName, randEmail, randUuid, randPastDate } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { Employee, CreateEmployeeProps } from "./employee";

describe("Employee Entity", () => {
  let employeeProps: CreateEmployeeProps;

  describe("Success", () => {
    it("Should be able to create an Employee Entity", () => {
      employeeProps = {
        fullName: randFullName(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: randUuid(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(Employee);
      expect(result.value).toHaveProperty("_id");
      expect(result.value).toHaveProperty("createdAt");
      expect(result.value).toHaveProperty("fullName.value", employeeProps.fullName);
      expect(result.value).toHaveProperty("email.value", employeeProps.email);
      expect(result.value).toHaveProperty("cpf.value", employeeProps.cpf);
      expect(result.value).toHaveProperty("companyId", employeeProps.companyId);
    });

    it("Should be able to create an Employee Entity passing an 'id' and a 'createdAt'", () => {
      employeeProps = {
        fullName: randFullName(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: randUuid(),
        id: randUuid(),
        createdAt: randPastDate(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(Employee);
      expect(result.value).toHaveProperty("_id", employeeProps.id);
      expect(result.value).toHaveProperty("createdAt", employeeProps.createdAt);
      expect(result.value).toHaveProperty("fullName.value", employeeProps.fullName);
      expect(result.value).toHaveProperty("email.value", employeeProps.email);
      expect(result.value).toHaveProperty("cpf.value", employeeProps.cpf);
      expect(result.value).toHaveProperty("companyId", employeeProps.companyId);
    });
  });

  describe("Fail", () => {
    it("Should return an error if one of the value objects fail", () => {
      employeeProps = {
        fullName: randFullName(),
        cpf: "invalid cpf",
        email: randEmail(),
        companyId: randUuid(),
        id: randUuid(),
        createdAt: randPastDate(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toHaveProperty(
        "message",
        "Employee CPF must be an eleven numeric digits string"
      );
    });

    it("Should return an error if the ID is not an UUID", () => {
      employeeProps = {
        fullName: randFullName(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: randUuid(),
        id: "invalid ID",
        createdAt: randPastDate(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toHaveProperty("message", "Employee ID must be a valid UUID");
    });

    it("Should return an error if the Company ID is not an UUID", () => {
      employeeProps = {
        fullName: randFullName(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: "invalid ID",
        id: randUuid(),
        createdAt: randPastDate(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toHaveProperty("message", "Company ID must be a valid UUID");
    });

    it("Should return an error if the 'createdAt' is not a Date", () => {
      employeeProps = {
        fullName: randFullName(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: "invalid ID",
        id: randUuid(),
        createdAt: "" as any,
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toHaveProperty("message", "Employee Created At must be a Date");
    });
  });
});
