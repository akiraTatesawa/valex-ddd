import { DomainErrors } from "@core/domain/domain-error";
import { Result } from "@core/logic/result";
import { randFutureDate, randPastDate } from "@ngneat/falso";
import { CardExpirationDate } from "./card-expiration-date";

describe("Card Expiration Date Value Object", () => {
  describe("Success", () => {
    it("Should be able to generate an expiration date if its not provided", () => {
      const result = CardExpirationDate.create();

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardExpirationDate);
      expect(result.value?.getValue()).toMatch(/^[0-9]{2}\/[0-9]{2}$/);
    });

    it("Should be able to create an expiration date if the value is provided", () => {
      const expirationDate = randPastDate();

      const result = CardExpirationDate.create(expirationDate);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.value).toBeInstanceOf(CardExpirationDate);
      expect(result.value?.getValue()).toMatch(/^[0-9]{2}\/[0-9]{2}$/);
      expect(result.value?.getDate()).toEqual(expirationDate);
    });

    it("Should return 'true' if the card is expired", () => {
      const expirationDate = randPastDate();
      const cardExpirationDate = CardExpirationDate.create(expirationDate).value!;

      expect(cardExpirationDate.isExpired()).toEqual(true);
    });

    it("Should return 'false' if the card is not expired", () => {
      const expirationDate = randFutureDate();
      const cardExpirationDate = CardExpirationDate.create(expirationDate).value!;

      expect(cardExpirationDate.isExpired()).toEqual(false);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the provided expiration Date is not a valid Date", () => {
      const result = CardExpirationDate.create("" as any);

      expect(result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.error?.message).toEqual("Card Expiration Date must be a Date");
    });
  });
});
