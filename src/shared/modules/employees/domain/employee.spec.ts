import { randEmail, randUuid, randPastDate, randWord } from "@ngneat/falso";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { Left, Right } from "@core/logic/either";
import { Employee, CreateEmployeeProps } from "./employee";

describe("Employee Entity", () => {
  let employeeProps: CreateEmployeeProps;

  describe("Success", () => {
    it("Should be able to create an Employee Entity", () => {
      employeeProps = {
        fullName: randWord(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: randUuid(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Employee);
      expect(result.value.getValue()).toHaveProperty("_id");
      expect(result.value.getValue()).toHaveProperty("createdAt");
      expect(result.value.getValue()).toHaveProperty("fullName.value", employeeProps.fullName);
      expect(result.value.getValue()).toHaveProperty("email.value", employeeProps.email);
      expect(result.value.getValue()).toHaveProperty("cpf.value", employeeProps.cpf);
      expect(result.value.getValue()).toHaveProperty("companyId", employeeProps.companyId);
    });

    it("Should be able to create an Employee Entity passing an 'id' and a 'createdAt'", () => {
      employeeProps = {
        fullName: randWord(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: randUuid(),
        id: randUuid(),
        createdAt: randPastDate(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Employee);
      expect(result.value.getValue()).toHaveProperty("_id", employeeProps.id);
      expect(result.value.getValue()).toHaveProperty("createdAt", employeeProps.createdAt);
      expect(result.value.getValue()).toHaveProperty("fullName.value", employeeProps.fullName);
      expect(result.value.getValue()).toHaveProperty("email.value", employeeProps.email);
      expect(result.value.getValue()).toHaveProperty("cpf.value", employeeProps.cpf);
      expect(result.value.getValue()).toHaveProperty("companyId", employeeProps.companyId);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the full name is invalid", () => {
      employeeProps = {
        fullName: "123123",
        cpf: "12345678901",
        email: randEmail(),
        companyId: randUuid(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Employee Name must consist of only letters"
      );
    });

    it("Should return an error if the cpf is invalid", () => {
      employeeProps = {
        fullName: randWord(),
        cpf: "12345678901invalid",
        email: randEmail(),
        companyId: randUuid(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Employee CPF must be an eleven numeric digits string"
      );
    });

    it("Should return an error if the email is invalid", () => {
      employeeProps = {
        fullName: randWord(),
        cpf: "12345678901",
        email: randWord(),
        companyId: randUuid(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Employee Email must be a valid email"
      );
    });

    it("Should return an error if the ID is not an UUID", () => {
      employeeProps = {
        fullName: randWord(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: randUuid(),
        id: "invalid ID",
        createdAt: randPastDate(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Employee ID must be a valid UUID");
    });

    it("Should return an error if the Company ID is not an UUID", () => {
      employeeProps = {
        fullName: randWord(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: "invalid ID",
        id: randUuid(),
        createdAt: randPastDate(),
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Company ID must be a valid UUID");
    });

    it("Should return an error if the 'createdAt' is not a Date", () => {
      employeeProps = {
        fullName: randWord(),
        cpf: "12345678901",
        email: randEmail(),
        companyId: "invalid ID",
        id: randUuid(),
        createdAt: "" as any,
      };

      const result = Employee.create(employeeProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Employee Created At must be a Date"
      );
    });
  });
});
