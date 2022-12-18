import "dotenv/config";
import Cryptr from "cryptr";
import { Result } from "@core/logic/result";
import { randUuid, randEmail, randPastDate, randCreditCardCVV } from "@ngneat/falso";
import { DomainErrors } from "@domain/errors/domain-error";
import { Employee } from "@domain/employee/employee";
import { Left, Right } from "@core/logic/either";
import { EmployeeFactory } from "@tests/factories/employee-factory";
import { Card, CreateCardProps } from "./card";

describe("Card Entity", () => {
  const employee: Employee = new EmployeeFactory().generate();
  const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

  describe("Success", () => {
    it("Should be able to create a card", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Card);
      expect(result.value.getValue()).toHaveProperty("_id");
      expect(result.value.getValue()).toHaveProperty("number");
      expect(result.value.getValue()).toHaveProperty("cardholderName");
      expect(result.value.getValue()).toHaveProperty("securityCode");
      expect(result.value.getValue()).toHaveProperty("expirationDate");
      expect(result.value.getValue()).toHaveProperty("password", undefined);
      expect(result.value.getValue()).toHaveProperty("isVirtual", false);
      expect(result.value.getValue()).toHaveProperty("originalCardId", undefined);
      expect(result.value.getValue()).toHaveProperty("isBlocked", false);
      expect(result.value.getValue()).toHaveProperty("type", cardProps.type);
      expect(result.value.getValue()).toHaveProperty("employeeId", cardProps.employeeId);
    });

    it("Should be able to reconstitute a card entity", () => {
      const cardProps: CreateCardProps = {
        id: randUuid(),
        employeeId: employee._id,
        cardholderName: "NAME EMPLOYEE",
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

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Card);
      expect(result.value.getValue()?._id).toEqual(cardProps.id);
      expect(result.value.getValue()?.number.value).toEqual(cardProps.number);
      expect(result.value.getValue()?.cardholderName.value).toEqual(cardProps.cardholderName);
      expect(result.value.getValue()?.securityCode.value).toEqual(cardProps.securityCode);
      expect(result.value.getValue()?.expirationDate.getDate()).toEqual(cardProps.expirationDate);
      expect(result.value.getValue()?.password?.value).toEqual(cardProps.password);
      expect(result.value.getValue()?.isVirtual).toEqual(cardProps.isVirtual);
      expect(result.value.getValue()?.originalCardId).toEqual(cardProps.originalCardId);
      expect(result.value.getValue()?.isBlocked).toEqual(cardProps.isBlocked);
      expect(result.value.getValue()?.type).toEqual(cardProps.type);
      expect(result.value.getValue()?.employeeId).toEqual(cardProps.employeeId);
    });

    it("Should be able to set 'isBlocked' to true", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };
      const card = Card.create(cardProps).value.getValue()!;

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
      const card = Card.create(cardProps).value.getValue()!;

      expect(() => {
        card.unblock();
      }).not.toThrow();
      expect(card.isBlocked).toEqual(false);
    });

    it("Should be able to call 'isActive' and return false if the card is not active", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
        isBlocked: true,
      };
      const card = Card.create(cardProps).value.getValue()!;

      expect(card).toBeInstanceOf(Card);
      expect(card.isActive).toEqual(false);
    });

    it("Should be able to call 'isActive' and return true if the card is active", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
        isBlocked: true,
      };
      const card = Card.create(cardProps).value.getValue()!;
      card.activate("1234");

      expect(card).toBeInstanceOf(Card);
      expect(card.isActive).toEqual(true);
    });

    it("Should be able to activate the card by setting a password", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };
      const password = "1234";
      const card = Card.create(cardProps).value.getValue()!;

      const result = card.activate(password);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeNull();
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

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Employee ID must be a valid UUID");
    });

    it("Should return an error if the 'type' is not a valid Voucher Type", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "invalid_type" as any,
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
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

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Cardholder Name must consist of only letters"
      );
    });

    it("Should return an error if the 'number' has an invalid format", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "education",
        number: "abc",
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Card Number must be a 13 to 16 numeric digits string"
      );
    });

    it("Should return an error if the 'securityCode' has an invalid format", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "education",
        securityCode: "123457",
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Invalid CVV encryption");
    });

    it("Should return an error if the 'expirationDate' has an invalid format", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "education",
        expirationDate: "1234" as any,
      };

      const result = Card.create(cardProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card Expiration Date must be a Date");
    });

    it("Should return an error when trying to activate a card that is already activated", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };
      const password = "1234";
      const card = Card.create(cardProps).value.getValue()!;
      card.activate(password);

      const result = card.activate(password);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Card is already activated");
    });

    it("Should return an error when trying to activate a card with an invalid password", () => {
      const cardProps: CreateCardProps = {
        employeeId: employee._id,
        cardholderName: employee.fullName.value,
        type: "groceries",
      };
      const password = "invalid password";
      const card = Card.create(cardProps).value.getValue()!;

      const result = card.activate(password);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Card Password must be a 4 numeric digits string"
      );
    });
  });
});
