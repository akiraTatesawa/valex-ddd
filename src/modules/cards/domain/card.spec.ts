import "dotenv/config";
import Cryptr from "cryptr";
import { Result } from "@core/logic/result";
import { randUuid, randFullName, randEmail, randPastDate, randCreditCardCVV } from "@ngneat/falso";
import { Employee } from "@modules/employees/domain/employee";
import { DomainErrors } from "@core/domain/domain-error";
import { Card, CreateCardProps } from "./card";

describe("Card Entity", () => {
  let employee: Employee;
  const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

  beforeEach(() => {
    employee = Employee.create({
      fullName: randFullName(),
      cpf: "12345678936",
      companyId: randUuid(),
      email: randEmail(),
    }).value!;
  });

  describe("Success", () => {
    it("Should be able to create a card", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(Card);
      expect(result.value).toHaveProperty("_id");
      expect(result.value).toHaveProperty("number");
      expect(result.value).toHaveProperty("cardholderName");
      expect(result.value).toHaveProperty("securityCode");
      expect(result.value).toHaveProperty("expirationDate");
      expect(result.value).toHaveProperty("password", undefined);
      expect(result.value).toHaveProperty("isVirtual", false);
      expect(result.value).toHaveProperty("originalCardId", undefined);
      expect(result.value).toHaveProperty("isBlocked", false);
      expect(result.value).toHaveProperty("type", cardProps.type);
      expect(result.value).toHaveProperty("employeeId", cardProps.employeeId);
    });

    it("Should be able to reconstitute a card entity", () => {
      const cardProps: CreateCardProps = {
        id: randUuid(),
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        expirationDate: randPastDate(),
        number: "1234567891234567",
        password: "1234",
        securityCode: cryptr.encrypt(randCreditCardCVV()),
        isBlocked: false,
        isVirtual: false,
        originalCardId: undefined,
        type: "groceries",
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(Card);
      expect(result.value?._id).toEqual(cardProps.id);
      expect(result.value?.number.value).toEqual(cardProps.number);
      expect(result.value?.cardholderName.value).toEqual(cardProps.cardholderName);
      expect(result.value?.securityCode.value).toEqual(cardProps.securityCode);
      expect(result.value?.expirationDate.getDate()).toEqual(cardProps.expirationDate);
      expect(result.value?.password?.value).toEqual(cardProps.password);
      expect(result.value?.isVirtual).toEqual(cardProps.isVirtual);
      expect(result.value?.originalCardId).toEqual(cardProps.originalCardId);
      expect(result.value?.isBlocked).toEqual(cardProps.isBlocked);
      expect(result.value?.type).toEqual(cardProps.type);
      expect(result.value?.employeeId).toEqual(cardProps.employeeId);
    });

    it("Should be able to set 'isBlocked' to true", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };
      const card = Card.create(cardProps).value!;

      expect(() => {
        card.block();
      }).not.toThrow();
      expect(card.isBlocked).toEqual(true);
    });

    it("Should be able to set 'isBlocked' to false", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
        isBlocked: true,
      };
      const card = Card.create(cardProps).value!;

      expect(() => {
        card.unblock();
      }).not.toThrow();
      expect(card.isBlocked).toEqual(false);
    });

    it("Should be able to activate the card by setting a password", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };
      const password = "1234";
      const card = Card.create(cardProps).value!;

      const result = card.activate(password);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeNull();
      expect(card.password).toBeDefined();
      expect(card.password?.compare(password)).toEqual(true);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the 'employeeId' is not an UUID", () => {
      const cardProps: CreateCardProps = {
        employeeId: randEmail(),
        cardholderName: employee.fullName.value,
        type: "groceries",
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Employee ID must be a valid UUID");
    });

    it("Should return an error if the 'type' is not a valid Voucher Type", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "invalid_type" as any,
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual(
        "Card Type can only assume the values: 'restaurant' | 'health' | 'transport' | 'groceries' | 'education'"
      );
    });

    it("Should return an error if the 'cardholderName' has an invalid format", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: "1234name",
        type: "education",
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Cardholder Name must consist of only letters");
    });

    it("Should return an error when trying to activate a card that is already activated", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };
      const password = "1234";
      const card = Card.create(cardProps).value!;
      card.activate(password);

      const result = card.activate(password);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Card is already activated");
    });

    it("Should return an error when trying to activate a card with an invalid password", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };
      const password = "invalid password";
      const card = Card.create(cardProps).value!;

      const result = card.activate(password);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Card Password must be a 4 numeric digits string");
    });
  });
});
