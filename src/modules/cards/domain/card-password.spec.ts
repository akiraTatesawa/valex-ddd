import { Result } from "@core/logic/result";
import { DomainErrors } from "@core/domain/domain-error";
import { randFullName } from "@ngneat/falso";
import { CardPassword } from "./card-password";

describe("Card Password Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a card password and hash it", () => {
      const password = "1234";

      const result = CardPassword.create(password);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(CardPassword);
      expect(result.value?.value).not.toEqual(password);
    });

    it("Should be able to create a card password without hashing", () => {
      const password = "1234";

      const result = CardPassword.create(password, true);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(CardPassword);
      expect(result.value?.value).toEqual(password);
    });

    it("Should be able to compare a value against the password an return 'true' if its correct", () => {
      const password = "1234";

      const result = CardPassword.create(password);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(CardPassword);
      expect(result.value?.compare(password)).toEqual(true);
    });

    it("Should be able to compare a value against the password an return 'false' if its incorrect", () => {
      const password = "1234";

      const result = CardPassword.create(password);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(CardPassword);
      expect(result.value?.compare("")).toEqual(false);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the password is not a 4 numeric digits string", () => {
      const invalidPassword = randFullName();

      const result = CardPassword.create(invalidPassword);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.error?.message).toEqual("Card Password must be a 4 numeric digits string");
    });
  });
});
