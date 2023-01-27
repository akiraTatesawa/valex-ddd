import { randText } from "@ngneat/falso";
import { Left, Right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";
import { BusinessName } from "./business-name";

describe("Business Name Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a Business Name", () => {
      const mockName = randText({ charCount: 20 });

      const result = BusinessName.create(mockName);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getValue()).toBeInstanceOf(BusinessName);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toHaveProperty("value", mockName);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the Business Name is longer than 30 char", () => {
      const mockName = randText({ charCount: 31 });

      const result = BusinessName.create(mockName);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Business Name cannot be longer than 30 characters"
      );
    });

    it("Should return an error if the Business Name is an empty string", () => {
      const mockName = "";

      const result = BusinessName.create(mockName);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getValue()).toBeNull();
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getError()).toHaveProperty(
        "message",
        "Business Name cannot be an empty string"
      );
    });
  });
});
