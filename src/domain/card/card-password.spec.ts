import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { randFullName } from "@ngneat/falso";
import { Left, Right } from "@core/logic/either";
import { CardPassword } from "./card-password";

describe("Card Password Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a card password and hash it", () => {
      const password = "1234";

      const result = CardPassword.create(password);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardPassword);
      expect(result.value.getValue()?.value).not.toEqual(password);
    });

    it("Should be able to create a card password without hashing", () => {
      const password = "1234";

      const result = CardPassword.create(password, true);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardPassword);
      expect(result.value.getValue()?.value).toEqual(password);
    });

    it("Should be able to compare a value against the password an return 'true' if its correct", () => {
      const password = "1234";

      const result = CardPassword.create(password);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardPassword);
      expect(result.value.getValue()?.compare(password)).toEqual(true);
    });

    it("Should be able to compare a value against the password an return 'false' if its incorrect", () => {
      const password = "1234";

      const result = CardPassword.create(password);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(CardPassword);
      expect(result.value.getValue()?.compare(" ")).toEqual(false);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the password is not a 4 numeric digits string", () => {
      const invalidPassword = randFullName();

      const result = CardPassword.create(invalidPassword);

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
