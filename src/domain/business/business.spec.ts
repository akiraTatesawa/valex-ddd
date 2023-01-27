import { randText, randUuid } from "@ngneat/falso";
import { Left, Right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";
import { VoucherType } from "@shared/domain/voucher-type";
import { Business, BusinessCreateProps } from "./business";

describe("Business Entity", () => {
  describe("Success", () => {
    it("Should be able to create a Business Entity", () => {
      const mockBusinessProps: BusinessCreateProps = {
        name: randText({ charCount: 28 }),
        type: "health",
      };

      const result = Business.create(mockBusinessProps);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Business);
      expect(result.value.getValue()).toHaveProperty("_id");
      expect(result.value.getValue()).toHaveProperty("name.value", mockBusinessProps.name);
      expect(result.value.getValue()).toHaveProperty("type", mockBusinessProps.type);
    });

    it("Should be able to reconstitute a Business Entity", () => {
      const mockBusinessProps: BusinessCreateProps = {
        id: randUuid(),
        name: randText({ charCount: 28 }),
        type: "health",
      };

      const result = Business.create(mockBusinessProps);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Business);
      expect(result.value.getValue()).toHaveProperty("_id", mockBusinessProps.id);
      expect(result.value.getValue()).toHaveProperty("name.value", mockBusinessProps.name);
      expect(result.value.getValue()).toHaveProperty("type", mockBusinessProps.type);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the business name is invalid", () => {
      const mockBusinessProps: BusinessCreateProps = {
        name: randText({ charCount: 45 }),
        type: "health",
      };

      const result = Business.create(mockBusinessProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Business Name cannot be longer than 30 characters"
      );
    });

    it("Should return an error if the business type is invalid", () => {
      const mockBusinessProps: BusinessCreateProps = {
        name: randText({ charCount: 20 }),
        type: "invalid" as VoucherType,
      };

      const result = Business.create(mockBusinessProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Business Type can only assume the values: 'restaurant' | 'health' | 'transport' | 'groceries' | 'education'"
      );
    });

    it("Should return an error if the business id is invalid", () => {
      const mockBusinessProps: BusinessCreateProps = {
        id: "invalid_id",
        name: randText({ charCount: 20 }),
        type: "health",
      };

      const result = Business.create(mockBusinessProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Business ID must be a valid UUID");
    });
  });
});
